/**
 * FHIR R4 REST API — Supabase Edge Function
 * Implements read and search interactions per FHIR R4 4.0.1
 *
 * Endpoints:
 *   GET /fhir/metadata              → CapabilityStatement
 *   GET /fhir/Patient/:id           → Patient read
 *   GET /fhir/Appointment?patient=X → Appointment search
 *   GET /fhir/AllergyIntolerance?patient=X
 *   GET /fhir/Condition?patient=X
 *   GET /fhir/Practitioner/:id      → Practitioner read
 *   GET /fhir/Organization/:id      → Organization read
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FHIR_CONTENT_TYPE = 'application/fhir+json; charset=utf-8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
};

function fhirResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': FHIR_CONTENT_TYPE },
  });
}

function operationOutcome(severity: string, code: string, diagnostics: string, status = 400) {
  return fhirResponse({
    resourceType: 'OperationOutcome',
    issue: [{ severity, code, diagnostics }],
  }, status);
}

function buildCapabilityStatement(baseUrl: string) {
  return {
    resourceType: 'CapabilityStatement',
    id: 'everyday-dental-surgery',
    meta: { lastUpdated: new Date().toISOString() },
    status: 'active',
    date: new Date().toISOString(),
    kind: 'instance',
    fhirVersion: '4.0.1',
    format: ['json'],
    implementation: {
      description: 'Everyday Dental Surgery FHIR R4 Server',
      url: baseUrl,
    },
    rest: [{
      mode: 'server',
      security: {
        cors: true,
        service: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
            code: 'SMART-on-FHIR',
          }],
        }],
        description: 'OAuth2 via Supabase Auth. All PHI encrypted at rest with pgcrypto.',
      },
      resource: [
        {
          type: 'Patient',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: '_id', type: 'token' }],
        },
        {
          type: 'Appointment',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'status', type: 'token' },
          ],
        },
        {
          type: 'Practitioner',
          interaction: [{ code: 'read' }],
        },
        {
          type: 'Organization',
          interaction: [{ code: 'read' }],
        },
        {
          type: 'AllergyIntolerance',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Condition',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
      ],
    }],
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return operationOutcome('error', 'not-supported', 'Only GET is supported', 405);
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    // Find 'fhir' segment to parse relative path
    const fhirIdx = pathParts.indexOf('fhir');
    const fhirPath = fhirIdx >= 0 ? pathParts.slice(fhirIdx + 1) : pathParts;
    const baseUrl = `${url.origin}/fhir`;

    // GET /fhir/metadata — no auth required (FHIR spec: metadata is public)
    if (fhirPath.length === 1 && fhirPath[0] === 'metadata') {
      return fhirResponse(buildCapabilityStatement(baseUrl));
    }

    // All other endpoints require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return operationOutcome('error', 'login', 'Authorization header required', 401);
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
    const isStaff = ['doctor', 'admin', 'receptionist'].includes(role);

    // Audit log the FHIR access
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'FHIR_READ',
      table_name: 'fhir_resources',
      details: `FHIR API: ${req.method} ${url.pathname}`,
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    });

    const resourceType = fhirPath[0];
    const resourceId = fhirPath[1];

    // ── Read by type and ID ──
    if (resourceType && resourceId) {
      // Authorization: patients can only read their own Patient resource
      if (!isStaff && resourceType === 'Patient' && resourceId !== user.id && resourceId !== `patient-${user.id}`) {
        return operationOutcome('error', 'forbidden', 'Patients can only access their own data', 403);
      }

      const { data, error } = await supabaseAdmin
        .from('fhir_resources')
        .select('resource')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return operationOutcome('error', 'not-found', `${resourceType}/${resourceId} not found`, 404);
      }

      return fhirResponse(data.resource);
    }

    // ── Search by type ──
    if (resourceType && !resourceId) {
      const patientParam = url.searchParams.get('patient');
      const statusParam = url.searchParams.get('status');
      const idParam = url.searchParams.get('_id');

      let query = supabaseAdmin
        .from('fhir_resources')
        .select('resource')
        .eq('resource_type', resourceType);

      // If searching with _id, filter by resource_id
      if (idParam) {
        query = query.eq('resource_id', idParam);
      }

      // Patient can only search their own linked resources
      if (!isStaff) {
        if (['Patient'].includes(resourceType)) {
          query = query.or(`resource_id.eq.${user.id},resource_id.eq.patient-${user.id}`);
        } else if (patientParam) {
          // Ensure patient param matches the user
          if (patientParam !== user.id && patientParam !== `Patient/${user.id}`) {
            return operationOutcome('error', 'forbidden', 'Patients can only search their own data', 403);
          }
        } else {
          // For non-Patient resources without patient param, filter by subject/patient reference
          query = query.or(
            `resource->subject->>reference.eq.Patient/${user.id},resource->patient->>reference.eq.Patient/${user.id}`
          );
        }
      }

      // Apply patient search parameter for staff
      if (patientParam && isStaff) {
        const patientRef = patientParam.startsWith('Patient/') ? patientParam : `Patient/${patientParam}`;
        query = query.or(
          `resource->subject->>reference.eq.${patientRef},resource->patient->>reference.eq.${patientRef}`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return operationOutcome('error', 'exception', error.message, 500);
      }

      // Build FHIR searchset Bundle
      const entries = (data || []).map((row: { resource: unknown }) => ({
        fullUrl: `${baseUrl}/${resourceType}/${(row.resource as Record<string, string>).id}`,
        resource: row.resource,
      }));

      // Filter by status if provided
      let filteredEntries = entries;
      if (statusParam) {
        filteredEntries = entries.filter((e: { resource: Record<string, string> }) =>
          e.resource.status === statusParam
        );
      }

      return fhirResponse({
        resourceType: 'Bundle',
        id: `searchset-${Date.now()}`,
        meta: { lastUpdated: new Date().toISOString() },
        type: 'searchset',
        total: filteredEntries.length,
        entry: filteredEntries,
      });
    }

    return operationOutcome('error', 'not-found', 'Unknown FHIR endpoint', 404);

  } catch (error) {
    console.error('FHIR API error:', error);
    return operationOutcome('fatal', 'exception', 'Internal server error', 500);
  }
});
