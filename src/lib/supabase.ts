import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Brak SUPABASE_URL w env');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Brak SUPABASE_SERVICE_ROLE_KEY w env');
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function uploadClientAsset(params: {
  bucket?: string;
  path: string;
  file: File;
  contentType?: string;
}) {
  const bucket = params.bucket ?? 'client-media';

  const arrayBuffer = await params.file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(params.path, fileBuffer, {
      contentType: params.contentType ?? params.file.type ?? 'application/octet-stream',
      upsert: true,
    });

  if (error) {
    throw new Error(`Błąd uploadu do storage: ${error.message}`);
  }

  return data;
}

export function buildClientAssetPath(params: {
  clientId: string;
  fileName: string;
}) {
  const safeName = params.fileName.replace(/\s+/g, '-').toLowerCase();
  return `${params.clientId}/${Date.now()}-${safeName}`;
}