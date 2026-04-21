export interface Client {
  id: string;
  company_name: string;
  industry: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface SiteConfig {
  id: string;
  client_id: string;
  site_name: string | null;
  domain: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  template_family: string | null;
  template_version: string | null;
  cta_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Service {
  id: string;
  client_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ServiceVersion {
  id: string;
  service_id: string;
  version_no: number;
  status: string;
  full_description: string | null;
  metadata: Record<string, unknown> | null;
  source: string | null;
  approved_at: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface Page {
  id: string;
  client_id: string;
  slug: string;
  title: string | null;
  body_markdown: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface PageVersion {
  id: string;
  page_id: string;
  version_no: number;
  status: string;
  body_markdown: string | null;
  metadata: Record<string, unknown> | null;
  source: string | null;
  approved_at: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface Location {
  id: string;
  client_id: string;
  city: string;
  slug: string;
  region: string | null;
  is_main: boolean;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface LocationVersion {
  id: string;
  location_id: string;
  version_no: number;
  status: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  source: string | null;
  approved_at: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface ClientPost {
  id: string;
  client_id: string;
  slug: string;
  title: string;
  body_markdown: string | null;
  status: string;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PostVersion {
  id: string;
  post_id: string;
  version_no: number;
  status: string;
  body_markdown: string | null;
  metadata: Record<string, unknown> | null;
  source: string | null;
  approved_at: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface ChangeRequest {
  id: string;
  client_id: string;
  request_type: string;
  change_class: string;
  target_table: string | null;
  target_record_id: string | null;
  requires_ai: boolean;
  requires_preview: boolean;
  priority: string;
  status: string;
  requested_text: string;
  publish_mode: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Job {
  id: string;
  client_id: string;
  request_id: string | null;
  job_type: string;
  trigger_source: string | null;
  payload_json: Record<string, unknown>;
  status: string;
  progress: number;
  result_json: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string | null;
}

export interface JobStep {
  id: string;
  job_id: string;
  step_name: string;
  status: string;
  output_json: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string | null;
}

export interface Deployment {
  id: string;
  client_id: string;
  snapshot_id: string;
  type: string;
  status: string;
  deploy_url: string | null;
  created_at: string | null;
}

export interface DeploymentSnapshot {
  id: string;
  client_id: string;
  snapshot_json: Record<string, unknown>;
  template_version: string | null;
  created_at: string | null;
}

export interface IndexingEvent {
  id: string;
  deployment_id: string;
  url: string;
  status: string;
  response: Record<string, unknown> | null;
  created_at: string | null;
}

export interface AssetLibrary {
  id: string;
  client_id: string;
  type: string;
  storage_path: string;
  alt_text: string | null;
  title: string | null;
  created_at: string | null;
}

export interface DesignProfile {
  id: string;
  client_id: string;
  template_family: string;
  font_pair: string | null;
  cta_style: string | null;
  section_rhythm: string | null;
  radius_style: string | null;
  motion_level: string | null;
  imagery_style: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PageSectionVariant {
  id: string;
  client_id: string;
  route: string;
  section_key: string;
  variant_key: string;
  created_at: string | null;
}

export interface SystemLog {
  id: string;
  client_id: string;
  log_type: string;
  message: string;
  payload_json: Record<string, unknown> | null;
  created_at: string | null;
}

export interface ContentDiff {
  id: string;
  request_id: string | null;
  before_json: Record<string, unknown>;
  after_json: Record<string, unknown>;
  diff_summary: string;
  created_at: string | null;
}
