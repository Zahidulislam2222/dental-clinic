/**
 * FHIR R4 Patient Bundle Export
 * HIPAA 164.524 — Right to Access: patients can export all their data
 *
 * Returns a FHIR Bundle (type: collection) containing:
 * - Patient resource
 * - All Appointment resources
 * - All AllergyIntolerance resources
 * - All Condition resources
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('fhir-export');

const FHIR_CONTENT_TYPE = 'application/fhir+json; charset=utf-8';

function operationOutcome(severity: string, code: string, diagnostics: string, status = 400) {
  return new Response(JSON.stringify({
    resourceType: 'OperationOutcome',
    issue: [{ severity, code, diagnostics }],
  }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': FHIR_CONTENT_TYPE },
  });
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Authenticate
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return operationOutcome('error', 'login', 'Authorization required', 401);
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return operationOutcome('error', 'login', 'Invalid or expired token', 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'patient';
    const isStaff = ['doctor', 'admin'].includes(role);

    // Determine which patient to export
    let body: { patientId?: string } = {};
    if (req.method === 'POST') {
      body = await req.json();
    }

    const targetPatientId = body.patientId || user.id;

    // Authorization: patients can only export their own data
    if (!isStaff && targetPatientId !== user.id) {
      return operationOutcome('error', 'forbidden', 'Patients can only export their own data', 403);
    }

    // Audit log the export
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'FHIR_EXPORT',
      table_name: 'fhir_resources',
      details: `FHIR Bundle export for patient: ${targetPatientId}`,
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    });

    // Collect all resources for this patient
    const patientRefs = [targetPatientId, `patient-${targetPatientId}`];
    const allResources: unknown[] = [];

    // 1. Patient resource
    const { data: patientData } = await supabaseAdmin
      .from('fhir_resources')
      .select('resource')
      .eq('resource_type', 'Patient')
      .in('resource_id', patientRefs)
      .order('version', { ascending: false });

    if (patientData) {
      // Deduplicate — take latest version per resource_id
      const seen = new Set<string>();
      for (const row of patientData) {
        const id = (row.resource as Record<string, string>).id;
        if (!seen.has(id)) {
          seen.add(id);
          allResources.push(row.resource);
        }
      }
    }

    // 2. All related resources (Appointment, AllergyIntolerance, Condition)
    for (const refType of ['Appointment', 'AllergyIntolerance', 'Condition']) {
      const { data } = await supabaseAdmin
        .from('fhir_resources')
        .select('resource')
        .eq('resource_type', refType)
        .order('version', { ascending: false });

      if (data) {
        for (const row of data) {
          const r = row.resource as Record<string, unknown>;
          // Check if resource references this patient
          const subjectRef = (r.subject as Record<string, string>)?.reference;
          const patientRef = (r.patient as Record<string, string>)?.reference;
          const participantRefs = (r.participant as Array<{ actor: { reference: string } }>)
            ?.map(p => p.actor?.reference) || [];

          const allRefs = [subjectRef, patientRef, ...participantRefs].filter(Boolean);
          const matches = allRefs.some(ref =>
            patientRefs.some(pr => ref === `Patient/${pr}` || ref === pr)
          );

          if (matches) {
            allResources.push(row.resource);
          }
        }
      }
    }

    // 3. Include Organization and Practitioner context
    const { data: orgData } = await supabaseAdmin
      .from('fhir_resources')
      .select('resource')
      .in('resource_type', ['Organization', 'Practitioner'])
      .order('version', { ascending: false });

    if (orgData) {
      const seen = new Set<string>();
      for (const row of orgData) {
        const id = (row.resource as Record<string, string>).id;
        if (!seen.has(id)) {
          seen.add(id);
          allResources.push(row.resource);
        }
      }
    }

    // Build the Bundle
    const bundle = {
      resourceType: 'Bundle',
      id: `export-${targetPatientId}-${Date.now()}`,
      meta: { lastUpdated: new Date().toISOString() },
      type: 'collection',
      total: allResources.length,
      entry: allResources.map((resource) => ({
        fullUrl: `urn:uuid:${(resource as Record<string, string>).id}`,
        resource,
      })),
    };

    return new Response(JSON.stringify(bundle, null, 2), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': FHIR_CONTENT_TYPE,
        'Content-Disposition': `attachment; filename="fhir-export-${targetPatientId}.json"`,
      },
    });

  } catch (error) {
    log.error('FHIR export error', { error_code: error?.code || 'UNKNOWN' });
    return operationOutcome('fatal', 'exception', 'Export failed', 500);
  }
});
