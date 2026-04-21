import { supabaseAdmin } from './supabase';
import type { SiteConfig } from '../types/database';

export type { SiteConfig };

export type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  sort_order: number;
};

export type PageItem = {
  id: string;
  slug: string;
  title: string | null;
  body_markdown: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

export async function getClientSiteConfig(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('*')
    .eq('client_id', clientId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania site_config: ${error.message}`);
  }

  return data as SiteConfig;
}

export async function getClientServices(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('id, name, slug, short_description, sort_order')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania services: ${error.message}`);
  }

  return (data ?? []) as ServiceItem[];
}

export async function getClientPage(clientId: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('id, slug, title, body_markdown, meta_title, meta_description, metadata')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania page(${slug}): ${error.message}`);
  }

  return data as PageItem;
}
export type LocationItem = {
  id: string;
  city: string;
  slug: string;
  region: string | null;
  is_main: boolean;
};

export async function getAllClientServices(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('id, name, slug, short_description, sort_order')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania wszystkich usług: ${error.message}`);
  }

  return (data ?? []) as ServiceItem[];
}

export async function getServiceBySlug(clientId: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('id, name, slug, short_description, sort_order')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania usługi (${slug}): ${error.message}`);
  }

  return data as ServiceItem;
}

export async function getAllClientLocations(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .select('id, city, slug, region, is_main')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('city', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania lokalizacji: ${error.message}`);
  }

  return (data ?? []) as LocationItem[];
}

export async function getLocationBySlug(clientId: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .select('id, city, slug, region, is_main')
    .eq('client_id', clientId)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania lokalizacji (${slug}): ${error.message}`);
  }

  return data as LocationItem;
}
export type ClientItem = {
  id: string;
  company_name: string;
  industry: string | null;
  status: string;
  created_at?: string;
};

export async function getClients() {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('id, company_name, industry, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania klientów: ${error.message}`);
  }

  return (data ?? []) as ClientItem[];
}

export async function getClientById(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania klienta: ${error.message}`);
  }

  return data;
}

export async function updateSiteConfig(clientId: string, payload: {
  site_name: string;
  domain: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  cta_url: string;
  facebook_url?: string;
  instagram_url?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .update({
      site_name: payload.site_name,
      domain: payload.domain,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      city: payload.city,
      cta_url: payload.cta_url,
      facebook_url: payload.facebook_url || null,
      instagram_url: payload.instagram_url || null,
      primary_color: payload.primary_color || null,
      secondary_color: payload.secondary_color || null,
      logo_url: payload.logo_url || null,
    })
    .eq('client_id', clientId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji site_config: ${error.message}`);
  }

  return data;
}

export async function createSystemLog(payload: {
  client_id: string;
  log_type: string;
  message: string;
  payload_json?: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin
    .from('system_logs')
    .insert({
      client_id: payload.client_id,
      log_type: payload.log_type,
      message: payload.message,
      payload_json: payload.payload_json ?? null,
    });

  if (error) {
    throw new Error(`Błąd zapisu system_log: ${error.message}`);
  }
}

export async function getSystemLogs(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('system_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Błąd pobierania system_logs: ${error.message}`);
  }

  return data ?? [];
}

export async function getChangeRequests(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Błąd pobierania change_requests: ${error.message}`);
  }

  return data ?? [];
}

export async function getAllChangeRequests() {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .select(`
      *,
      clients (
        company_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania wszystkich change_requests: ${error.message}`);
  }

  return data ?? [];
}

export async function updateChangeRequestStatus(requestId: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji statusu requestu: ${error.message}`);
  }

  return data;
}

export async function getChangeRequestById(requestId: string) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .select(`
      *,
      clients (
        company_name
      )
    `)
    .eq('id', requestId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania change_request: ${error.message}`);
  }

  return data;
}

export async function createJob(payload: {
  client_id: string;
  request_id?: string;
  job_type: string;
  trigger_source?: string;
  payload_json?: Record<string, unknown>;
}) {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert({
      client_id: payload.client_id,
      request_id: payload.request_id ?? null,
      job_type: payload.job_type,
      trigger_source: payload.trigger_source ?? 'operator_panel',
      payload_json: payload.payload_json ?? {},
      status: 'queued',
      progress: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia joba: ${error.message}`);
  }

  return data;
}

export async function getJobsByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Błąd pobierania jobs: ${error.message}`);
  }

  return data ?? [];
}

export async function getJobs() {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select(`
      *,
      clients (
        company_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania wszystkich jobs: ${error.message}`);
  }

  return data ?? [];
}

export async function updateJobStatus(jobId: string, status: string, progress?: number) {
  const updatePayload: Record<string, unknown> = { status };

  if (typeof progress === 'number') {
    updatePayload.progress = progress;
  }

  if (status === 'running') {
    updatePayload.started_at = new Date().toISOString();
  }

  if (status === 'completed' || status === 'failed' || status === 'canceled') {
    updatePayload.finished_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .update(updatePayload)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji statusu joba: ${error.message}`);
  }

  return data;
}

export async function createJobStep(payload: {
  job_id: string;
  step_name: string;
  status?: string;
  output_json?: Record<string, unknown>;
  error_message?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('job_steps')
    .insert({
      job_id: payload.job_id,
      step_name: payload.step_name,
      status: payload.status ?? 'queued',
      output_json: payload.output_json ?? {},
      error_message: payload.error_message ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia job_step: ${error.message}`);
  }

  return data;
}

export async function getJobSteps(jobId: string) {
  const { data, error } = await supabaseAdmin
    .from('job_steps')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania job_steps: ${error.message}`);
  }

  return data ?? [];
}
export async function getServiceVersions(serviceId: string) {
  const { data, error } = await supabaseAdmin
    .from('service_versions')
    .select('*')
    .eq('service_id', serviceId)
    .order('version_no', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania service_versions: ${error.message}`);
  }

  return data ?? [];
}

export async function getLatestServiceVersionNumber(serviceId: string) {
  const { data, error } = await supabaseAdmin
    .from('service_versions')
    .select('version_no')
    .eq('service_id', serviceId)
    .order('version_no', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania ostatniego version_no: ${error.message}`);
  }

  if (!data || data.length === 0) return 0;
  return Number(data[0].version_no ?? 0);
}

export async function createServiceDraftVersion(payload: {
  service_id: string;
  full_description: string;
  metadata?: Record<string, unknown>;
  source?: string;
}) {
  const latestVersion = await getLatestServiceVersionNumber(payload.service_id);
  const nextVersion = latestVersion + 1;

  const { data, error } = await supabaseAdmin
    .from('service_versions')
    .insert({
      service_id: payload.service_id,
      version_no: nextVersion,
      status: 'draft',
      full_description: payload.full_description,
      metadata: payload.metadata ?? {},
      source: payload.source ?? 'operator_panel',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia draft version: ${error.message}`);
  }

  return data;
}

export async function updateServiceVersionStatus(versionId: string, status: string) {
  const updatePayload: Record<string, unknown> = { status };

  if (status === 'approved') {
    updatePayload.approved_at = new Date().toISOString();
  }

  if (status === 'published') {
    updatePayload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('service_versions')
    .update(updatePayload)
    .eq('id', versionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji statusu wersji: ${error.message}`);
  }

  return data;
}
export async function publishServiceVersionToBase(
  serviceId: string,
  fullDescription: string
) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .update({
      short_description: fullDescription,
    })
    .eq('id', serviceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd publikacji service version do services: ${error.message}`);
  }

  return data;
}
export async function getServiceVersionById(versionId: string) {
  const { data, error } = await supabaseAdmin
    .from('service_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania service_version: ${error.message}`);
  }

  return data;
}

export async function saveContentDiff(payload: {
  request_id?: string | null;
  before_json: Record<string, unknown>;
  after_json: Record<string, unknown>;
  diff_summary: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('content_diffs')
    .insert({
      request_id: payload.request_id ?? null,
      before_json: payload.before_json,
      after_json: payload.after_json,
      diff_summary: payload.diff_summary,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd zapisu content_diff: ${error.message}`);
  }

  return data;
}

export async function getContentDiffsByRequestId(requestId: string) {
  const { data, error } = await supabaseAdmin
    .from('content_diffs')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania content_diffs: ${error.message}`);
  }

  return data ?? [];
}

export async function createDeploymentSnapshot(payload: {
  client_id: string;
  template_version?: string | null;
  snapshot_json: Record<string, unknown>;
}) {
  const { data, error } = await supabaseAdmin
    .from('deployment_snapshots')
    .insert({
      client_id: payload.client_id,
      template_version: payload.template_version ?? null,
      snapshot_json: payload.snapshot_json,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia deployment_snapshot: ${error.message}`);
  }

  return data;
}

export async function createDeployment(payload: {
  client_id: string;
  snapshot_id: string;
  type: string;
  status?: string;
  deploy_url?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('deployments')
    .insert({
      client_id: payload.client_id,
      snapshot_id: payload.snapshot_id,
      type: payload.type,
      status: payload.status ?? 'queued',
      deploy_url: payload.deploy_url ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia deployment: ${error.message}`);
  }

  return data;
}

export async function getDeploymentsByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('deployments')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Błąd pobierania deployments: ${error.message}`);
  }

  return data ?? [];
}
export async function getDeploymentById(deploymentId: string) {
  const { data, error } = await supabaseAdmin
    .from('deployments')
    .select('*')
    .eq('id', deploymentId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania deploymentu: ${error.message}`);
  }

  return data;
}

export async function getSnapshotById(snapshotId: string) {
  const { data, error } = await supabaseAdmin
    .from('deployment_snapshots')
    .select('*')
    .eq('id', snapshotId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania snapshotu: ${error.message}`);
  }

  return data;
}

export async function updateDeploymentStatus(
  deploymentId: string,
  status: string,
  deployUrl?: string | null
) {
  const payload: Record<string, unknown> = { status };

  if (typeof deployUrl !== 'undefined') {
    payload.deploy_url = deployUrl;
  }

  const { data, error } = await supabaseAdmin
    .from('deployments')
    .update(payload)
    .eq('id', deploymentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji deployment status: ${error.message}`);
  }

  return data;
}

export async function createRollbackDeployment(payload: {
  client_id: string;
  snapshot_id: string;
  deploy_url?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('deployments')
    .insert({
      client_id: payload.client_id,
      snapshot_id: payload.snapshot_id,
      type: 'rollback',
      status: 'rolled_back',
      deploy_url: payload.deploy_url ?? 'manual-rollback-url',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia rollback deployment: ${error.message}`);
  }

  return data;
}

export async function getLatestPublishedOrPreviewDeployment(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('deployments')
    .select('*')
    .eq('client_id', clientId)
    .in('type', ['preview', 'publish'])
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania ostatniego deploymentu: ${error.message}`);
  }

  return data?.[0] ?? null;
}
export async function updateChangeRequestClassification(payload: {
  request_id: string;
  change_class: string;
  requires_ai: boolean;
  requires_preview: boolean;
  publish_mode: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .update({
      change_class: payload.change_class,
      requires_ai: payload.requires_ai,
      requires_preview: payload.requires_preview,
      publish_mode: payload.publish_mode,
    })
    .eq('id', payload.request_id)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji klasyfikacji requestu: ${error.message}`);
  }

  return data;
}

export async function updateChangeRequestFull(payload: {
  request_id: string;
  request_type: string;
  change_class: string;
  requires_ai: boolean;
  requires_preview: boolean;
  publish_mode: string;
  status: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .update({
      request_type: payload.request_type,
      change_class: payload.change_class,
      requires_ai: payload.requires_ai,
      requires_preview: payload.requires_preview,
      publish_mode: payload.publish_mode,
      status: payload.status,
    })
    .eq('id', payload.request_id)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd pełnej aktualizacji requestu: ${error.message}`);
  }

  return data;
}

export async function createChangeRequest(payload: {
  client_id: string;
  request_type: string;
  change_class: string;
  requested_text: string;
  requires_ai?: boolean;
  requires_preview?: boolean;
  publish_mode?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('change_requests')
    .insert({
      client_id: payload.client_id,
      request_type: payload.request_type,
      change_class: payload.change_class,
      requested_text: payload.requested_text,
      requires_ai: payload.requires_ai ?? false,
      requires_preview: payload.requires_preview ?? false,
      publish_mode: payload.publish_mode ?? null,
      priority: 'normal',
      status: 'new',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia change_request: ${error.message}`);
  }

  return data;
}
export async function getClientPages(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('slug', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania pages: ${error.message}`);
  }

  return data ?? [];
}

export async function getPageById(pageId: string) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania page: ${error.message}`);
  }

  return data;
}

export async function getPageVersions(pageId: string) {
  const { data, error } = await supabaseAdmin
    .from('page_versions')
    .select('*')
    .eq('page_id', pageId)
    .order('version_no', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania page_versions: ${error.message}`);
  }

  return data ?? [];
}

export async function getLatestPageVersionNumber(pageId: string) {
  const { data, error } = await supabaseAdmin
    .from('page_versions')
    .select('version_no')
    .eq('page_id', pageId)
    .order('version_no', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania latest page version: ${error.message}`);
  }

  if (!data || data.length === 0) return 0;
  return Number(data[0].version_no ?? 0);
}

export async function createPageDraftVersion(payload: {
  page_id: string;
  body_markdown: string;
  metadata?: Record<string, unknown>;
  source?: string;
}) {
  const latestVersion = await getLatestPageVersionNumber(payload.page_id);
  const nextVersion = latestVersion + 1;

  const { data, error } = await supabaseAdmin
    .from('page_versions')
    .insert({
      page_id: payload.page_id,
      version_no: nextVersion,
      status: 'draft',
      body_markdown: payload.body_markdown,
      metadata: payload.metadata ?? {},
      source: payload.source ?? 'operator_panel',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia page draft version: ${error.message}`);
  }

  return data;
}

export async function updatePageVersionStatus(versionId: string, status: string) {
  const updatePayload: Record<string, unknown> = { status };

  if (status === 'approved') {
    updatePayload.approved_at = new Date().toISOString();
  }

  if (status === 'published') {
    updatePayload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('page_versions')
    .update(updatePayload)
    .eq('id', versionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji page version status: ${error.message}`);
  }

  return data;
}

export async function publishPageVersionToBase(pageId: string, bodyMarkdown: string) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .update({
      body_markdown: bodyMarkdown,
    })
    .eq('id', pageId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd publikacji page version do pages: ${error.message}`);
  }

  return data;
}
export async function getClientLocations(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('city', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania locations: ${error.message}`);
  }

  return data ?? [];
}

export async function getLocationById(locationId: string) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .select('*')
    .eq('id', locationId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania location: ${error.message}`);
  }

  return data;
}

export async function getLocationVersions(locationId: string) {
  const { data, error } = await supabaseAdmin
    .from('location_versions')
    .select('*')
    .eq('location_id', locationId)
    .order('version_no', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania location_versions: ${error.message}`);
  }

  return data ?? [];
}

export async function getLatestLocationVersionNumber(locationId: string) {
  const { data, error } = await supabaseAdmin
    .from('location_versions')
    .select('version_no')
    .eq('location_id', locationId)
    .order('version_no', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania latest location version: ${error.message}`);
  }

  if (!data || data.length === 0) return 0;
  return Number(data[0].version_no ?? 0);
}

export async function createLocationDraftVersion(payload: {
  location_id: string;
  description: string;
  metadata?: Record<string, unknown>;
  source?: string;
}) {
  const latestVersion = await getLatestLocationVersionNumber(payload.location_id);
  const nextVersion = latestVersion + 1;

  const { data, error } = await supabaseAdmin
    .from('location_versions')
    .insert({
      location_id: payload.location_id,
      version_no: nextVersion,
      status: 'draft',
      description: payload.description,
      metadata: payload.metadata ?? {},
      source: payload.source ?? 'operator_panel',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia location draft version: ${error.message}`);
  }

  return data;
}

export async function updateLocationVersionStatus(versionId: string, status: string) {
  const updatePayload: Record<string, unknown> = { status };

  if (status === 'approved') {
    updatePayload.approved_at = new Date().toISOString();
  }

  if (status === 'published') {
    updatePayload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('location_versions')
    .update(updatePayload)
    .eq('id', versionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji location version status: ${error.message}`);
  }

  return data;
}

export async function publishLocationVersionToBase(locationId: string, description: string) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .update({
      region: description,
    })
    .eq('id', locationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd publikacji location version do locations: ${error.message}`);
  }

  return data;
}
export async function getClientPosts(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('client_posts')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania client_posts: ${error.message}`);
  }

  return data ?? [];
}

export async function getPostById(postId: string) {
  const { data, error } = await supabaseAdmin
    .from('client_posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania post: ${error.message}`);
  }

  return data;
}

export async function createClientPost(payload: {
  client_id: string;
  slug: string;
  title: string;
  body_markdown?: string;
  status?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('client_posts')
    .insert({
      client_id: payload.client_id,
      slug: payload.slug,
      title: payload.title,
      body_markdown: payload.body_markdown ?? '',
      status: payload.status ?? 'draft',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia client_post: ${error.message}`);
  }

  return data;
}

export async function getPostVersions(postId: string) {
  const { data, error } = await supabaseAdmin
    .from('post_versions')
    .select('*')
    .eq('post_id', postId)
    .order('version_no', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania post_versions: ${error.message}`);
  }

  return data ?? [];
}

export async function getLatestPostVersionNumber(postId: string) {
  const { data, error } = await supabaseAdmin
    .from('post_versions')
    .select('version_no')
    .eq('post_id', postId)
    .order('version_no', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania latest post version: ${error.message}`);
  }

  if (!data || data.length === 0) return 0;
  return Number(data[0].version_no ?? 0);
}

export async function createPostDraftVersion(payload: {
  post_id: string;
  body_markdown: string;
  metadata?: Record<string, unknown>;
  source?: string;
}) {
  const latestVersion = await getLatestPostVersionNumber(payload.post_id);
  const nextVersion = latestVersion + 1;

  const { data, error } = await supabaseAdmin
    .from('post_versions')
    .insert({
      post_id: payload.post_id,
      version_no: nextVersion,
      status: 'draft',
      body_markdown: payload.body_markdown,
      metadata: payload.metadata ?? {},
      source: payload.source ?? 'operator_panel',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia post draft version: ${error.message}`);
  }

  return data;
}

export async function updatePostVersionStatus(versionId: string, status: string) {
  const updatePayload: Record<string, unknown> = { status };

  if (status === 'approved') {
    updatePayload.approved_at = new Date().toISOString();
  }

  if (status === 'published') {
    updatePayload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('post_versions')
    .update(updatePayload)
    .eq('id', versionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji post version status: ${error.message}`);
  }

  return data;
}

export async function publishPostVersionToBase(postId: string, bodyMarkdown: string) {
  const { data, error } = await supabaseAdmin
    .from('client_posts')
    .update({
      body_markdown: bodyMarkdown,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd publikacji post version do client_posts: ${error.message}`);
  }

  return data;
}
export async function getLatestVersionByStatus(
  tableName: 'service_versions' | 'page_versions' | 'location_versions' | 'post_versions',
  foreignKey: string,
  foreignId: string,
  status: 'draft' | 'approved' | 'published'
) {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select('*')
    .eq(foreignKey, foreignId)
    .eq('status', status)
    .order('version_no', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Błąd pobierania latest version by status z ${tableName}: ${error.message}`);
  }

  return data?.[0] ?? null;
}

export async function getContentStatusSummaryForClient(clientId: string) {
  const services = await getAllClientServices(clientId);
  const pages = await getClientPages(clientId);
  const locations = await getClientLocations(clientId);
  const posts = await getClientPosts(clientId);

  const serviceSummary = await Promise.all(
    services.map(async (item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      type: 'service',
      live_value: item.short_description ?? '',
      latest_draft: await getLatestVersionByStatus('service_versions', 'service_id', item.id, 'draft'),
      latest_approved: await getLatestVersionByStatus('service_versions', 'service_id', item.id, 'approved'),
      latest_published: await getLatestVersionByStatus('service_versions', 'service_id', item.id, 'published'),
    }))
  );

  const pageSummary = await Promise.all(
    pages.map(async (item) => ({
      id: item.id,
      name: item.title ?? item.slug,
      slug: item.slug,
      type: 'page',
      live_value: item.body_markdown ?? '',
      latest_draft: await getLatestVersionByStatus('page_versions', 'page_id', item.id, 'draft'),
      latest_approved: await getLatestVersionByStatus('page_versions', 'page_id', item.id, 'approved'),
      latest_published: await getLatestVersionByStatus('page_versions', 'page_id', item.id, 'published'),
    }))
  );

  const locationSummary = await Promise.all(
    locations.map(async (item) => ({
      id: item.id,
      name: item.city,
      slug: item.slug,
      type: 'location',
      live_value: item.region ?? '',
      latest_draft: await getLatestVersionByStatus('location_versions', 'location_id', item.id, 'draft'),
      latest_approved: await getLatestVersionByStatus('location_versions', 'location_id', item.id, 'approved'),
      latest_published: await getLatestVersionByStatus('location_versions', 'location_id', item.id, 'published'),
    }))
  );

  const postSummary = await Promise.all(
    posts.map(async (item) => ({
      id: item.id,
      name: item.title,
      slug: item.slug,
      type: 'post',
      live_value: item.body_markdown ?? '',
      latest_draft: await getLatestVersionByStatus('post_versions', 'post_id', item.id, 'draft'),
      latest_approved: await getLatestVersionByStatus('post_versions', 'post_id', item.id, 'approved'),
      latest_published: await getLatestVersionByStatus('post_versions', 'post_id', item.id, 'published'),
    }))
  );

  return {
    services: serviceSummary,
    pages: pageSummary,
    locations: locationSummary,
    posts: postSummary,
  };
}
export async function getPreviewDiffForClient(clientId: string) {
  const summary = await getContentStatusSummaryForClient(clientId);

  function buildDiffRows(items: any[], type: string) {
    return items.map((item) => {
      const liveValue = item.live_value ?? '';
      const approvedValue =
        item.latest_approved?.full_description ??
        item.latest_approved?.body_markdown ??
        item.latest_approved?.description ??
        item.latest_approved?.body_markdown ??
        '';

      const hasApproved = !!item.latest_approved;
      const isDifferent = hasApproved && String(liveValue) !== String(approvedValue);

      return {
        id: item.id,
        type,
        name: item.name,
        slug: item.slug,
        live_value: liveValue,
        approved_value: approvedValue,
        latest_draft_version: item.latest_draft?.version_no ?? null,
        latest_approved_version: item.latest_approved?.version_no ?? null,
        latest_published_version: item.latest_published?.version_no ?? null,
        has_changes_ready: isDifferent,
      };
    });
  }

  return {
    services: buildDiffRows(summary.services, 'service'),
    pages: buildDiffRows(summary.pages, 'page'),
    locations: buildDiffRows(summary.locations, 'location'),
    posts: buildDiffRows(summary.posts, 'post'),
  };
}
export async function getPublishChecklistForClient(clientId: string) {
  const client = await getClientById(clientId);
  const siteConfig = await getClientSiteConfig(clientId);
  const services = await getAllClientServices(clientId);
  const pages = await getClientPages(clientId);
  const locations = await getClientLocations(clientId);
  const posts = await getClientPosts(clientId);
  const assetQa = await getAssetQaSummaryForClient(clientId);
  const diff = await getPreviewDiffForClient(clientId);

  const hasPhone = !!siteConfig.phone?.trim();
  const hasEmail = !!siteConfig.email?.trim();
  const hasAddress = !!siteConfig.address?.trim();
  const hasCity = !!siteConfig.city?.trim();
  const hasSiteName = !!siteConfig.site_name?.trim();

  const hasServices = services.length > 0;
  const hasPages = pages.length > 0;
  const hasLocations = locations.length > 0;

  const readyItems =
    diff.services.filter((item) => item.has_changes_ready).length +
    diff.pages.filter((item) => item.has_changes_ready).length +
    diff.locations.filter((item) => item.has_changes_ready).length +
    diff.posts.filter((item) => item.has_changes_ready).length;

  const hasApprovedChanges = readyItems > 0;

  const checks = [
    {
      key: 'site_name',
      label: 'Nazwa strony ustawiona',
      ok: hasSiteName,
    },
    {
      key: 'phone',
      label: 'Telefon ustawiony',
      ok: hasPhone,
    },
    {
      key: 'email',
      label: 'E-mail ustawiony',
      ok: hasEmail,
    },
    {
      key: 'address',
      label: 'Adres ustawiony',
      ok: hasAddress,
    },
    {
      key: 'city',
      label: 'Miasto ustawione',
      ok: hasCity,
    },
    {
      key: 'services',
      label: 'Są aktywne usługi',
      ok: hasServices,
    },
    {
      key: 'pages',
      label: 'Są strony stałe',
      ok: hasPages,
    },
    {
      key: 'locations',
      label: 'Są lokalizacje',
      ok: hasLocations,
    },
    {
      key: 'approved_changes',
      label: 'Są zatwierdzone zmiany gotowe do publikacji',
      ok: hasApprovedChanges,
    },
    {
  key: 'asset_alt',
  label: 'Assety mają uzupełnione alt texty',
  ok: assetQa.isAssetQaOk,
},
  ];

  const failedChecks = checks.filter((item) => !item.ok);

  const canPreview =
    hasSiteName &&
    hasPhone &&
    hasServices &&
    hasPages &&
    hasLocations &&
    hasApprovedChanges;

  const canPublish =
  hasSiteName &&
  hasPhone &&
  hasEmail &&
  hasAddress &&
  hasCity &&
  hasServices &&
  hasPages &&
  hasLocations &&
  hasApprovedChanges &&
  assetQa.isAssetQaOk;

  return {
  client,
  siteConfig,
  servicesCount: services.length,
  pagesCount: pages.length,
  locationsCount: locations.length,
  postsCount: posts.length,
  assetQa,
  readyItems,
  checks,
  failedChecks,
  canPreview,
  canPublish,
};
}
export async function triggerVercelDeploy(payload: {
  mode: 'preview' | 'publish';
  deploymentId: string;
  clientId: string;
}) {
  const previewHook = import.meta.env.VERCEL_PREVIEW_DEPLOY_HOOK_URL;
  const productionHook = import.meta.env.VERCEL_PRODUCTION_DEPLOY_HOOK_URL;

  const hookUrl =
    payload.mode === 'preview' ? previewHook : productionHook;

  if (!hookUrl) {
    throw new Error(
      `Brak deploy hook URL dla trybu ${payload.mode}. Uzupełnij envy.`
    );
  }

  const response = await fetch(hookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deploymentId: payload.deploymentId,
      clientId: payload.clientId,
      mode: payload.mode,
      triggeredAt: new Date().toISOString(),
    }),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body: text,
  };
}
export async function createIndexingEvent(payload: {
  deployment_id: string;
  url: string;
  status?: string;
  response?: Record<string, unknown> | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('indexing_events')
    .insert({
      deployment_id: payload.deployment_id,
      url: payload.url,
      status: payload.status ?? 'queued',
      response: payload.response ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia indexing_event: ${error.message}`);
  }

  return data;
}

export async function getIndexingEventsByDeploymentId(deploymentId: string) {
  const { data, error } = await supabaseAdmin
    .from('indexing_events')
    .select('*')
    .eq('deployment_id', deploymentId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania indexing_events dla deploymentu: ${error.message}`);
  }

  return data ?? [];
}

export async function getIndexingEventsByClientId(clientId: string) {
  const { data: deployments, error: deploymentsError } = await supabaseAdmin
    .from('deployments')
    .select('id')
    .eq('client_id', clientId);

  if (deploymentsError) {
    throw new Error(`Błąd pobierania deploymentów do indexing_events: ${deploymentsError.message}`);
  }

  const deploymentIds = (deployments ?? []).map((item) => item.id);

  if (deploymentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from('indexing_events')
    .select('*')
    .in('deployment_id', deploymentIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania indexing_events klienta: ${error.message}`);
  }

  return data ?? [];
}

export async function getAllIndexingEvents() {
  const { data, error } = await supabaseAdmin
    .from('indexing_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania wszystkich indexing_events: ${error.message}`);
  }

  return data ?? [];
}

export async function updateIndexingEventStatus(
  indexingEventId: string,
  status: string,
  response?: Record<string, unknown> | null
) {
  const payload: Record<string, unknown> = { status };

  if (typeof response !== 'undefined') {
    payload.response = response;
  }

  const { data, error } = await supabaseAdmin
    .from('indexing_events')
    .update(payload)
    .eq('id', indexingEventId)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji indexing_event status: ${error.message}`);
  }

  return data;
}
export function getPublicAssetUrl(storagePath: string): string {
  const base = process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/client-media/${storagePath}`;
}

export function getAssetsByType(
  assets: Array<{ type: string; storage_path: string; alt_text: string | null; title: string | null }>,
  type: string
) {
  return assets.filter((a) => a.type === type);
}

export function getFirstAssetByType(
  assets: Array<{ type: string; storage_path: string; alt_text: string | null; title: string | null }>,
  type: string
) {
  return assets.find((a) => a.type === type) ?? null;
}

export async function getAssetsByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('asset_library')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania asset_library: ${error.message}`);
  }

  return data ?? [];
}

export async function createAssetRecord(payload: {
  client_id: string;
  type: string;
  storage_path: string;
  alt_text?: string | null;
  title?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('asset_library')
    .insert({
      client_id: payload.client_id,
      type: payload.type,
      storage_path: payload.storage_path,
      alt_text: payload.alt_text ?? null,
      title: payload.title ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia asset record: ${error.message}`);
  }

  return data;
}

export async function updateAssetRecord(payload: {
  asset_id: string;
  alt_text?: string | null;
  title?: string | null;
  type?: string | null;
}) {
  const updatePayload: Record<string, unknown> = {};

  if (typeof payload.alt_text !== 'undefined') {
    updatePayload.alt_text = payload.alt_text;
  }

  if (typeof payload.title !== 'undefined') {
    updatePayload.title = payload.title;
  }

  if (typeof payload.type !== 'undefined') {
    updatePayload.type = payload.type;
  }

  const { data, error } = await supabaseAdmin
    .from('asset_library')
    .update(updatePayload)
    .eq('id', payload.asset_id)
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd aktualizacji asset record: ${error.message}`);
  }

  return data;
}

export async function getAssetById(assetId: string) {
  const { data, error } = await supabaseAdmin
    .from('asset_library')
    .select('*')
    .eq('id', assetId)
    .single();

  if (error) {
    throw new Error(`Błąd pobierania assetu: ${error.message}`);
  }

  return data;
}
export async function getAssetsMissingAltByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('asset_library')
    .select('*')
    .eq('client_id', clientId)
    .or('alt_text.is.null,alt_text.eq.')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Błąd pobierania assetów bez alt_text: ${error.message}`);
  }

  return data ?? [];
}

export function generateAltSuggestion(payload: {
  title?: string | null;
  type?: string | null;
  storage_path?: string | null;
  client_name?: string | null;
}) {
  const title = payload.title?.trim() || 'obraz';
  const type = payload.type?.trim() || 'asset';
  const clientName = payload.client_name?.trim() || 'klienta';

  if (type === 'logo') {
    return `Logo firmy ${clientName}`;
  }

  if (type === 'gallery') {
    return `Zdjęcie z realizacji firmy ${clientName}: ${title}`;
  }

  if (type === 'document') {
    return `Dokument firmy ${clientName}: ${title}`;
  }

  return `Zdjęcie przedstawiające ${title} dla firmy ${clientName}`;
}

export async function getAssetQaSummaryForClient(clientId: string) {
  const assets = await getAssetsByClientId(clientId);
  const missingAlt = assets.filter(
    (item) => !item.alt_text || !String(item.alt_text).trim()
  );

  const logos = assets.filter((item) => item.type === 'logo');
  const images = assets.filter((item) => item.type === 'image' || item.type === 'gallery');

  return {
    totalAssets: assets.length,
    missingAltCount: missingAlt.length,
    hasLogo: logos.length > 0,
    imageCount: images.length,
    isAssetQaOk: assets.length > 0 && missingAlt.length === 0,
    missingAltAssets: missingAlt,
  };
}
export async function getDesignProfileByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('design_profiles')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle();

  if (error) {
    throw new Error(`Błąd pobierania design_profile: ${error.message}`);
  }

  return data;
}

export async function upsertDesignProfile(payload: {
  client_id: string;
  template_family: string;
  font_pair?: string | null;
  cta_style?: string | null;
  section_rhythm?: string | null;
  radius_style?: string | null;
  motion_level?: string | null;
  imagery_style?: string | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('design_profiles')
    .upsert(
      {
        client_id: payload.client_id,
        template_family: payload.template_family,
        font_pair: payload.font_pair ?? null,
        cta_style: payload.cta_style ?? null,
        section_rhythm: payload.section_rhythm ?? null,
        radius_style: payload.radius_style ?? null,
        motion_level: payload.motion_level ?? null,
        imagery_style: payload.imagery_style ?? null,
      },
      {
        onConflict: 'client_id',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd zapisu design_profile: ${error.message}`);
  }

  return data;
}
export async function getSectionVariantsByClientId(clientId: string) {
  const { data, error } = await supabaseAdmin
    .from('page_section_variants')
    .select('*')
    .eq('client_id', clientId)
    .order('route', { ascending: true })
    .order('section_key', { ascending: true });

  if (error) {
    throw new Error(`Błąd pobierania page_section_variants: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertSectionVariant(payload: {
  client_id: string;
  route: string;
  section_key: string;
  variant_key: string;
}) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('page_section_variants')
    .select('*')
    .eq('client_id', payload.client_id)
    .eq('route', payload.route)
    .eq('section_key', payload.section_key)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Błąd sprawdzania istniejącego wariantu sekcji: ${existingError.message}`);
  }

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('page_section_variants')
      .update({
        variant_key: payload.variant_key,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd aktualizacji page_section_variant: ${error.message}`);
    }

    return data;
  }

  const { data, error } = await supabaseAdmin
    .from('page_section_variants')
    .insert({
      client_id: payload.client_id,
      route: payload.route,
      section_key: payload.section_key,
      variant_key: payload.variant_key,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Błąd tworzenia page_section_variant: ${error.message}`);
  }

  return data;
}

export async function getSectionVariantMapForClient(clientId: string) {
  const variants = await getSectionVariantsByClientId(clientId);

  const grouped: Record<string, Record<string, string>> = {};

  for (const item of variants) {
    if (!grouped[item.route]) {
      grouped[item.route] = {};
    }

    grouped[item.route][item.section_key] = item.variant_key;
  }

  return grouped;
}
export async function restoreClientDataFromSnapshot(payload: {
  client_id: string;
  snapshot_json: Record<string, unknown>;
}): Promise<void> {
  const snap = payload.snapshot_json;

  // Przywróć site_config
  const sc = snap.siteConfig as Record<string, unknown> | undefined;
  if (sc) {
    await supabaseAdmin
      .from('site_config')
      .update({
        site_name: sc.site_name ?? null,
        domain: sc.domain ?? null,
        phone: sc.phone ?? null,
        email: sc.email ?? null,
        address: sc.address ?? null,
        city: sc.city ?? null,
        cta_url: sc.cta_url ?? null,
        template_family: sc.template_family ?? null,
        template_version: sc.template_version ?? null,
      })
      .eq('client_id', payload.client_id);
  }

  // Przywróć treści usług
  const services = snap.services as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(services)) {
    for (const svc of services) {
      if (!svc.id) continue;
      await supabaseAdmin
        .from('services')
        .update({ short_description: svc.short_description ?? null })
        .eq('id', String(svc.id));
    }
  }

  // Przywróć treści stron
  const pages = snap.pages as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(pages)) {
    for (const page of pages) {
      if (!page.id) continue;
      await supabaseAdmin
        .from('pages')
        .update({
          title: page.title ?? null,
          body_markdown: page.body_markdown ?? null,
          meta_title: page.meta_title ?? null,
          meta_description: page.meta_description ?? null,
        })
        .eq('id', String(page.id));
    }
  }

  // Przywróć lokalizacje
  const locations = snap.locations as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(locations)) {
    for (const loc of locations) {
      if (!loc.id) continue;
      await supabaseAdmin
        .from('locations')
        .update({ region: loc.region ?? null })
        .eq('id', String(loc.id));
    }
  }
}

export async function getSystemHealthForClient(clientId: string) {
  const client = await getClientById(clientId);
  const siteConfig = await getClientSiteConfig(clientId);
  const services = await getAllClientServices(clientId);
  const pages = await getClientPages(clientId);
  const locations = await getClientLocations(clientId);
  const posts = await getClientPosts(clientId);
  const assets = await getAssetsByClientId(clientId);
  const deployments = await getDeploymentsByClientId(clientId);
  const logs = await getSystemLogs(clientId);
  const requests = await getChangeRequests(clientId);
  const designProfile = await getDesignProfileByClientId(clientId);
  const sectionVariants = await getSectionVariantsByClientId(clientId);
  const checklist = await getPublishChecklistForClient(clientId);
  const assetQa = await getAssetQaSummaryForClient(clientId);

  const latestDeployment = deployments[0] ?? null;
  const latestLog = logs[0] ?? null;

  const checks = [
    {
      key: 'client_exists',
      label: 'Klient istnieje',
      ok: !!client,
    },
    {
      key: 'site_config',
      label: 'Site config istnieje',
      ok: !!siteConfig,
    },
    {
      key: 'services',
      label: 'Są usługi',
      ok: services.length > 0,
    },
    {
      key: 'pages',
      label: 'Są strony stałe',
      ok: pages.length > 0,
    },
    {
      key: 'locations',
      label: 'Są lokalizacje',
      ok: locations.length > 0,
    },
    {
      key: 'posts',
      label: 'Są wpisy lub moduł postów działa',
      ok: posts.length >= 0,
    },
    {
      key: 'assets',
      label: 'Asset library działa',
      ok: assets.length >= 0,
    },
    {
      key: 'deployments',
      label: 'Istnieje historia deploymentów',
      ok: deployments.length > 0,
    },
    {
      key: 'logs',
      label: 'System logs działają',
      ok: logs.length > 0,
    },
    {
      key: 'change_requests',
      label: 'Change requests działają',
      ok: requests.length >= 0,
    },
    {
      key: 'design_profile',
      label: 'Design profile istnieje',
      ok: !!designProfile,
    },
    {
      key: 'section_variants',
      label: 'Section variants warstwa działa',
      ok: sectionVariants.length >= 0,
    },
    {
      key: 'publish_checklist',
      label: 'Publish checklist działa',
      ok: !!checklist,
    },
    {
      key: 'asset_qa',
      label: 'Asset QA działa',
      ok: !!assetQa,
    },
  ];

  const warnings: string[] = [];

  if (!designProfile) {
    warnings.push('Brakuje design profile dla klienta.');
  }

  if (assetQa.missingAltCount > 0) {
    warnings.push(`Brakuje alt text dla ${assetQa.missingAltCount} assetów.`);
  }

  if (!latestDeployment) {
    warnings.push('Brak deploymentów — nie było jeszcze pełnego preview/publish.');
  }

  if (!siteConfig.domain) {
    warnings.push('Brak domeny w site_config — indexing events po publish mogą się nie tworzyć.');
  }

  if (!checklist.canPublish) {
    warnings.push('Klient nie przechodzi jeszcze publish checklist.');
  }

  if (locations.some((item) => !item.region)) {
    warnings.push('Część lokalizacji nie ma uzupełnionej wartości live/opisu.');
  }

  return {
    client,
    counts: {
      services: services.length,
      pages: pages.length,
      locations: locations.length,
      posts: posts.length,
      assets: assets.length,
      deployments: deployments.length,
      logs: logs.length,
      requests: requests.length,
      sectionVariants: sectionVariants.length,
    },
    latestDeployment,
    latestLog,
    checks,
    warnings,
    checklist,
    assetQa,
  };
}

// ─── INTAKE: tworzenie nowego klienta od zera ─────────────────────────────────

export async function createClient(payload: {
  company_name: string;
  industry: string;
  status?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .insert({
      company_name: payload.company_name,
      industry: payload.industry,
      status: payload.status ?? 'brief_received',
    })
    .select()
    .single();

  if (error) throw new Error(`Błąd tworzenia klienta: ${error.message}`);
  return data;
}

export async function createSiteConfig(payload: {
  client_id: string;
  site_name: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  cta_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  template_family?: string;
  template_version?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .insert({
      client_id: payload.client_id,
      site_name: payload.site_name,
      domain: payload.domain ?? null,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      address: payload.address ?? null,
      city: payload.city ?? null,
      cta_url: payload.cta_url ?? null,
      facebook_url: payload.facebook_url ?? null,
      instagram_url: payload.instagram_url ?? null,
      primary_color: payload.primary_color ?? null,
      secondary_color: payload.secondary_color ?? null,
      logo_url: payload.logo_url ?? null,
      template_family: payload.template_family ?? 'universal',
      template_version: payload.template_version ?? 'v1',
    })
    .select()
    .single();

  if (error) throw new Error(`Błąd tworzenia site_config: ${error.message}`);
  return data;
}

export async function createService(payload: {
  client_id: string;
  name: string;
  slug: string;
  short_description?: string;
  sort_order?: number;
}) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .insert({
      client_id: payload.client_id,
      name: payload.name,
      slug: payload.slug,
      short_description: payload.short_description ?? null,
      sort_order: payload.sort_order ?? 0,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new Error(`Błąd tworzenia usługi: ${error.message}`);
  return data;
}

export async function createPage(payload: {
  client_id: string;
  slug: string;
  title: string;
  body_markdown?: string;
  meta_title?: string;
  meta_description?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .insert({
      client_id: payload.client_id,
      slug: payload.slug,
      title: payload.title,
      body_markdown: payload.body_markdown ?? null,
      meta_title: payload.meta_title ?? null,
      meta_description: payload.meta_description ?? null,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new Error(`Błąd tworzenia strony: ${error.message}`);
  return data;
}

export async function createLocation(payload: {
  client_id: string;
  city: string;
  slug: string;
  region?: string;
  is_main?: boolean;
}) {
  const { data, error } = await supabaseAdmin
    .from('locations')
    .insert({
      client_id: payload.client_id,
      city: payload.city,
      slug: payload.slug,
      region: payload.region ?? null,
      is_main: payload.is_main ?? false,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new Error(`Błąd tworzenia lokalizacji: ${error.message}`);
  return data;
}

// ─── INTAKE PROJECTS ─────────────────────────────────────────────────────────

export type IntakeProject = {
  id: string;
  company_name: string;
  industry: string | null;
  main_offer: string | null;
  extra_offers: string[] | null;
  main_location: string | null;
  service_area: string[] | null;
  target_audience: string | null;
  benefits: string[] | null;
  tone_of_voice: string | null;
  website_goal: string | null;
  phone: string | null;
  email: string | null;
  has_blog: boolean;
  has_faq: boolean;
  has_reviews: boolean;
  has_case_studies: boolean;
  site_type_preference: string | null;
  competitors: string | null;
  current_url: string | null;
  manual_keywords: string | null;
  target_stack: string | null;
  has_location_pages: string | null;
  enrichment_json: Record<string, unknown> | null;
  metaprompt: string | null;
  status: string;
  created_at: string;
};

export async function createIntakeProject(
  payload: Omit<IntakeProject, 'id' | 'enrichment_json' | 'metaprompt' | 'status' | 'created_at'>
): Promise<IntakeProject> {
  const { storeCreate } = await import('./intake-store');
  return storeCreate(payload);
}

export async function getIntakeProjects(): Promise<IntakeProject[]> {
  const { storeGetAll } = await import('./intake-store');
  return storeGetAll();
}

export async function getIntakeProjectById(id: string): Promise<IntakeProject> {
  const { storeGetById } = await import('./intake-store');
  return storeGetById(id);
}

export async function updateIntakeEnrichmentAndMetaprompt(
  id: string,
  enrichment: Record<string, unknown>,
  metaprompt: string
): Promise<void> {
  const { storeUpdateEnrichment } = await import('./intake-store');
  storeUpdateEnrichment(id, enrichment, metaprompt);
}

export async function updateIntakeStatus(id: string, status: string): Promise<void> {
  const { storeUpdateStatus } = await import('./intake-store');
  storeUpdateStatus(id, status);
}

// ─── getClientData: pobiera komplet danych klienta jednym wywołaniem ─────────

export type ClientData = {
  client: Awaited<ReturnType<typeof getClientById>>;
  siteConfig: SiteConfig;
  services: ServiceItem[];
  pages: Awaited<ReturnType<typeof getClientPages>>;
  locations: Awaited<ReturnType<typeof getClientLocations>>;
  posts: Awaited<ReturnType<typeof getClientPosts>>;
  assets: Awaited<ReturnType<typeof getAssetsByClientId>>;
  designProfile: Awaited<ReturnType<typeof getDesignProfileByClientId>>;
};

export async function getClientData(clientId: string): Promise<ClientData> {
  const [client, siteConfig, services, pages, locations, posts, assets, designProfile] =
    await Promise.all([
      getClientById(clientId),
      getClientSiteConfig(clientId),
      getAllClientServices(clientId),
      getClientPages(clientId),
      getClientLocations(clientId),
      getClientPosts(clientId),
      getAssetsByClientId(clientId),
      getDesignProfileByClientId(clientId),
    ]);

  return { client, siteConfig, services, pages, locations, posts, assets, designProfile };
}

// ─────────────────────────────────────────────────────────────────────────────

// Pomocnik: generuje slug z nazwy (np. "Naprawa instalacji" → "naprawa-instalacji")
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}