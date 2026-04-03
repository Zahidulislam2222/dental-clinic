/**
 * FHIR R4 REST API — Supabase Edge Function
 * Implements read, search, create, update, and delete interactions per FHIR R4 4.0.1
 *
 * Endpoints:
 *   GET    /fhir/metadata                → CapabilityStatement
 *   GET    /fhir/:type/:id               → Read
 *   GET    /fhir/:type?params            → Search
 *   POST   /fhir/:type                   → Create
 *   PUT    /fhir/:type/:id               → Update
 *   DELETE /fhir/:type/:id               → Delete
 *   GET    /fhir/Patient/$export?id=X    → Bulk export (redirect to fhir-export)
 *
 * Search params:
 *   Patient:    _id, name, phone, birthdate, identifier
 *   Appointment: patient, status, date
 *   AllergyIntolerance/Condition: patient
 *
 * FHIR-API-001: POST/PUT/DELETE support
 * FHIR-API-002: Patient search params (name, phone, birthdate)
 * FHIR-API-003: Appointment date search
 * FHIR-EXPORT-001: $export operation
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('fhir-api');

const FHIR_CONTENT_TYPE = 'application/fhir+json; charset=utf-8';

const SUPPORTED_TYPES = [
  'Patient', 'Appointment', 'Practitioner', 'Organization',
  'AllergyIntolerance', 'Condition', 'Procedure', 'Observation',
  'Encounter', 'DocumentReference',
];

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
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [
            { name: '_id', type: 'token' },
            { name: 'name', type: 'string' },
            { name: 'phone', type: 'token' },
            { name: 'birthdate', type: 'date' },
            { name: 'identifier', type: 'token' },
          ],
        },
        {
          type: 'Appointment',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'status', type: 'token' },
            { name: 'date', type: 'date' },
          ],
        },
        {
          type: 'Practitioner',
          interaction: [{ code: 'read' }, { code: 'create' }, { code: 'update' }],
        },
        {
          type: 'Organization',
          interaction: [{ code: 'read' }, { code: 'create' }, { code: 'update' }],
        },
        {
          type: 'AllergyIntolerance',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }, { code: 'delete' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Condition',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }, { code: 'delete' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Procedure',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Observation',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Encounter',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'DocumentReference',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }, { code: 'delete' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
      ],
      operation: [
        { name: 'export', definition: 'http://hl7.org/fhir/uv/bulkdata/OperationDefinition/export' },
      ],
    }],
  };
}

interface AuthContext {
  user: { id: string; email: string };
  role: string;
  isStaff: boolean;
  supabaseAdmin: ReturnType<typeof createClient>;
}

async function authenticate(req: Request): Promise<AuthContext | Response> {
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

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'patient';
  const isStaff = ['doctor', 'admin', 'receptionist'].includes(role);

  return { user: { id: user.id, email: user.email || '' }, role, isStaff, supabaseAdmin };
}

async function auditLog(ctx: AuthContext, action: string, method: string, path: string, ip: string) {
  await ctx.supabaseAdmin.from('audit_logs').insert({
    user_id: ctx.user.id,
    user_email: ctx.user.email,
    user_role: ctx.role,
    action,
    table_name: 'fhir_resources',
    details: `FHIR API: ${method} ${path}`,
    ip_address: ip,
  });
}

// ── Handlers ──

async function handleRead(ctx: AuthContext, resourceType: string, resourceId: string, baseUrl: string) {
  // Patients can only read their own Patient resource
  if (!ctx.isStaff && resourceType === 'Patient' && resourceId !== ctx.user.id && resourceId !== `patient-${ctx.user.id}`) {
    return operationOutcome('error', 'forbidden', 'Patients can only access their own data', 403);
  }

  const { data, error } = await ctx.supabaseAdmin
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

async function handleSearch(ctx: AuthContext, resourceType: string, params: URLSearchParams, baseUrl: string) {
  let query = ctx.supabaseAdmin
    .from('fhir_resources')
    .select('resource')
    .eq('resource_type', resourceType);

  const patientParam = params.get('patient');
  const statusParam = params.get('status');
  const idParam = params.get('_id');
  const nameParam = params.get('name');
  const phoneParam = params.get('phone');
  const birthdateParam = params.get('birthdate');
  const identifierParam = params.get('identifier');
  const dateParam = params.get('date');

  // _id search
  if (idParam) {
    query = query.eq('resource_id', idParam);
  }

  // Patient authorization — patients can only search their own
  if (!ctx.isStaff) {
    if (resourceType === 'Patient') {
      query = query.or(`resource_id.eq.${ctx.user.id},resource_id.eq.patient-${ctx.user.id}`);
    } else if (patientParam) {
      if (patientParam !== ctx.user.id && patientParam !== `Patient/${ctx.user.id}`) {
        return operationOutcome('error', 'forbidden', 'Patients can only search their own data', 403);
      }
    } else {
      query = query.or(
        `resource->subject->>reference.eq.Patient/${ctx.user.id},resource->patient->>reference.eq.Patient/${ctx.user.id}`
      );
    }
  }

  // Patient reference search (for staff)
  if (patientParam && ctx.isStaff) {
    const patientRef = patientParam.startsWith('Patient/') ? patientParam : `Patient/${patientParam}`;
    query = query.or(
      `resource->subject->>reference.eq.${patientRef},resource->patient->>reference.eq.${patientRef}`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(500);

  if (error) {
    return operationOutcome('error', 'exception', 'Search operation failed', 500);
  }

  let entries = (data || []).map((row: { resource: unknown }) => ({
    fullUrl: `${baseUrl}/${resourceType}/${(row.resource as Record<string, string>).id}`,
    resource: row.resource,
  }));

  // Post-query filters (applied on JSONB fields)
  if (statusParam) {
    entries = entries.filter((e: { resource: Record<string, string> }) =>
      e.resource.status === statusParam
    );
  }

  // Patient-specific search params (FHIR-API-002)
  if (resourceType === 'Patient') {
    if (nameParam) {
      const nameLower = nameParam.toLowerCase();
      entries = entries.filter((e: { resource: Record<string, unknown> }) => {
        const names = e.resource.name as Array<{ family?: string; given?: string[]; text?: string }> || [];
        return names.some(n =>
          n.family?.toLowerCase().includes(nameLower) ||
          n.given?.some(g => g.toLowerCase().includes(nameLower)) ||
          n.text?.toLowerCase().includes(nameLower)
        );
      });
    }

    if (phoneParam) {
      entries = entries.filter((e: { resource: Record<string, unknown> }) => {
        const telecoms = e.resource.telecom as Array<{ system?: string; value?: string }> || [];
        return telecoms.some(t => t.system === 'phone' && t.value?.includes(phoneParam));
      });
    }

    if (birthdateParam) {
      entries = entries.filter((e: { resource: Record<string, string> }) =>
        e.resource.birthDate === birthdateParam
      );
    }

    if (identifierParam) {
      entries = entries.filter((e: { resource: Record<string, unknown> }) => {
        const identifiers = e.resource.identifier as Array<{ value?: string; system?: string }> || [];
        // Support system|value format
        if (identifierParam.includes('|')) {
          const [system, value] = identifierParam.split('|');
          return identifiers.some(id =>
            (!system || id.system === system) && id.value === value
          );
        }
        return identifiers.some(id => id.value === identifierParam);
      });
    }
  }

  // Appointment date search (FHIR-API-003)
  if (resourceType === 'Appointment' && dateParam) {
    // Support: date=2024-01-15, date=ge2024-01-15, date=le2024-01-15
    const prefixMatch = dateParam.match(/^(eq|ne|gt|lt|ge|le)?(.+)$/);
    const prefix = prefixMatch?.[1] || 'eq';
    const dateValue = prefixMatch?.[2] || dateParam;

    entries = entries.filter((e: { resource: Record<string, string> }) => {
      const start = e.resource.start;
      if (!start) return false;
      const startDate = start.substring(0, 10); // YYYY-MM-DD
      switch (prefix) {
        case 'eq': return startDate === dateValue;
        case 'ne': return startDate !== dateValue;
        case 'gt': return startDate > dateValue;
        case 'lt': return startDate < dateValue;
        case 'ge': return startDate >= dateValue;
        case 'le': return startDate <= dateValue;
        default: return startDate === dateValue;
      }
    });
  }

  return fhirResponse({
    resourceType: 'Bundle',
    id: `searchset-${Date.now()}`,
    meta: { lastUpdated: new Date().toISOString() },
    type: 'searchset',
    total: entries.length,
    entry: entries,
  });
}

async function handleCreate(ctx: AuthContext, resourceType: string, body: Record<string, unknown>, baseUrl: string) {
  // Only staff can create resources (except Patient for self-registration)
  if (!ctx.isStaff && resourceType !== 'Patient') {
    return operationOutcome('error', 'forbidden', 'Only staff can create resources', 403);
  }

  if (!body.resourceType || body.resourceType !== resourceType) {
    return operationOutcome('error', 'invalid', `Resource type mismatch: expected ${resourceType}`, 400);
  }

  // Assign ID if not present
  const resourceId = (body.id as string) || `${resourceType.toLowerCase()}-${crypto.randomUUID()}`;
  body.id = resourceId;
  body.meta = {
    ...(body.meta as Record<string, unknown> || {}),
    lastUpdated: new Date().toISOString(),
    versionId: '1',
  };

  const { error } = await ctx.supabaseAdmin
    .from('fhir_resources')
    .insert({
      resource_type: resourceType,
      resource_id: resourceId,
      resource: body,
      version: 1,
      created_by: ctx.user.id,
    });

  if (error) {
    // Duplicate check
    if (error.code === '23505') {
      return operationOutcome('error', 'duplicate', `${resourceType}/${resourceId} already exists`, 409);
    }
    return operationOutcome('error', 'exception', 'Create operation failed', 500);
  }

  return new Response(JSON.stringify(body), {
    status: 201,
    headers: {
      ...corsHeaders,
      'Content-Type': FHIR_CONTENT_TYPE,
      'Location': `${baseUrl}/${resourceType}/${resourceId}`,
    },
  });
}

async function handleUpdate(ctx: AuthContext, resourceType: string, resourceId: string, body: Record<string, unknown>, baseUrl: string) {
  // Only staff can update (patients can update their own Patient resource)
  if (!ctx.isStaff && !(resourceType === 'Patient' && (resourceId === ctx.user.id || resourceId === `patient-${ctx.user.id}`))) {
    return operationOutcome('error', 'forbidden', 'Insufficient permissions', 403);
  }

  if (!body.resourceType || body.resourceType !== resourceType) {
    return operationOutcome('error', 'invalid', `Resource type mismatch: expected ${resourceType}`, 400);
  }

  // Get current version
  const { data: current } = await ctx.supabaseAdmin
    .from('fhir_resources')
    .select('version')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const newVersion = (current?.version || 0) + 1;
  body.id = resourceId;
  body.meta = {
    ...(body.meta as Record<string, unknown> || {}),
    lastUpdated: new Date().toISOString(),
    versionId: String(newVersion),
  };

  const { error } = await ctx.supabaseAdmin
    .from('fhir_resources')
    .insert({
      resource_type: resourceType,
      resource_id: resourceId,
      resource: body,
      version: newVersion,
      created_by: ctx.user.id,
    });

  if (error) {
    return operationOutcome('error', 'exception', 'Update operation failed', 500);
  }

  return fhirResponse(body, current ? 200 : 201);
}

async function handleDelete(ctx: AuthContext, resourceType: string, resourceId: string) {
  // Only admin/doctor can delete
  if (!['admin', 'doctor'].includes(ctx.role)) {
    return operationOutcome('error', 'forbidden', 'Only admin or doctor can delete resources', 403);
  }

  // Soft-delete: mark as entered-in-error by inserting a new version
  const { data: current } = await ctx.supabaseAdmin
    .from('fhir_resources')
    .select('resource, version')
    .eq('resource_type', resourceType)
    .eq('resource_id', resourceId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (!current) {
    return operationOutcome('error', 'not-found', `${resourceType}/${resourceId} not found`, 404);
  }

  const deletedResource = {
    ...(current.resource as Record<string, unknown>),
    meta: {
      lastUpdated: new Date().toISOString(),
      versionId: String(current.version + 1),
      tag: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue', code: 'DELETED' }],
    },
  };

  // Mark with deleted status where applicable
  if ('status' in (current.resource as Record<string, unknown>)) {
    (deletedResource as Record<string, unknown>).status = 'entered-in-error';
  }

  await ctx.supabaseAdmin.from('fhir_resources').insert({
    resource_type: resourceType,
    resource_id: resourceId,
    resource: deletedResource,
    version: current.version + 1,
    created_by: ctx.user.id,
  });

  return new Response(null, { status: 204, headers: corsHeaders });
}

// ── Main Handler ──

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const fhirIdx = pathParts.indexOf('fhir');
    const fhirPath = fhirIdx >= 0 ? pathParts.slice(fhirIdx + 1) : pathParts;
    const baseUrl = `${url.origin}/fhir`;
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    // GET /fhir/metadata — no auth required (FHIR spec)
    if (fhirPath.length === 1 && fhirPath[0] === 'metadata' && req.method === 'GET') {
      return fhirResponse(buildCapabilityStatement(baseUrl));
    }

    // All other endpoints require authentication
    const authResult = await authenticate(req);
    if (authResult instanceof Response) return authResult;
    const ctx = authResult;

    const resourceType = fhirPath[0];
    const resourceId = fhirPath[1];

    // Validate resource type
    if (resourceType && !SUPPORTED_TYPES.includes(resourceType) && resourceType !== 'Patient') {
      // Check for $export operation
      if (resourceType === 'Patient' || (fhirPath[0] === 'Patient' && fhirPath[1] === '$export')) {
        // Handled below
      } else if (!SUPPORTED_TYPES.includes(resourceType)) {
        return operationOutcome('error', 'not-supported', `Unsupported resource type: ${resourceType}`, 400);
      }
    }

    // $export operation (FHIR-EXPORT-001)
    if (resourceType === 'Patient' && resourceId === '$export') {
      await auditLog(ctx, 'FHIR_EXPORT', req.method, url.pathname, clientIp);
      const exportPatientId = url.searchParams.get('id') || ctx.user.id;
      // Redirect to the dedicated export function
      const { data, error } = await ctx.supabaseAdmin.functions.invoke('fhir-export', {
        body: { patientId: exportPatientId },
        headers: { Authorization: req.headers.get('authorization')! },
      });
      if (error) return operationOutcome('error', 'exception', 'Export failed', 500);
      return fhirResponse(data);
    }

    // Audit log the access
    const action = req.method === 'GET' ? 'FHIR_READ' :
                   req.method === 'POST' ? 'FHIR_CREATE' :
                   req.method === 'PUT' ? 'FHIR_UPDATE' :
                   req.method === 'DELETE' ? 'FHIR_DELETE' : 'FHIR_ACCESS';
    await auditLog(ctx, action, req.method, url.pathname, clientIp);

    // Route by method
    switch (req.method) {
      case 'GET': {
        if (resourceType && resourceId) {
          return handleRead(ctx, resourceType, resourceId, baseUrl);
        }
        if (resourceType) {
          return handleSearch(ctx, resourceType, url.searchParams, baseUrl);
        }
        return operationOutcome('error', 'not-found', 'Unknown FHIR endpoint', 404);
      }

      case 'POST': {
        if (!resourceType) {
          return operationOutcome('error', 'invalid', 'Resource type is required', 400);
        }
        const body = await req.json();
        return handleCreate(ctx, resourceType, body, baseUrl);
      }

      case 'PUT': {
        if (!resourceType || !resourceId) {
          return operationOutcome('error', 'invalid', 'Resource type and ID are required for update', 400);
        }
        const body = await req.json();
        return handleUpdate(ctx, resourceType, resourceId, body, baseUrl);
      }

      case 'DELETE': {
        if (!resourceType || !resourceId) {
          return operationOutcome('error', 'invalid', 'Resource type and ID are required for delete', 400);
        }
        return handleDelete(ctx, resourceType, resourceId);
      }

      default:
        return operationOutcome('error', 'not-supported', `Method ${req.method} is not supported`, 405);
    }

  } catch (error) {
    log.error('FHIR API error', { error_code: error?.code || 'UNKNOWN' });
    return operationOutcome('fatal', 'exception', 'Internal server error', 500);
  }
});
