import { supabaseAdmin } from './supabase';

export type SiteConfig = {
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
};

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
    .select('id, slug, title, body_markdown, meta_title, meta_description')
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