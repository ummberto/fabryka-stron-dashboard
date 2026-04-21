// Generowanie zdjęć przez Runware.ai
// API: https://api.runware.ai/v1 (WebSocket lub REST)
// Używamy REST endpoint: POST /images/request

import { uploadClientAsset, buildClientAssetPath } from './supabase';
import { createAssetRecord } from './client-data';

const RUNWARE_URL = 'https://api.runware.ai/v1';

function getApiKey(): string {
  const key = import.meta.env.RUNWARE_API_KEY ?? process.env.RUNWARE_API_KEY;
  if (!key) throw new Error('Brak RUNWARE_API_KEY w env');
  return key;
}

// ─── Prompty per template family i typ zdjęcia ────────────────────────────────

type AssetType = 'hero' | 'service' | 'gallery' | 'team' | 'logo_placeholder';

const INDUSTRY_STYLE: Record<string, string> = {
  trade:     'industrial photography, natural light, professional craftsman at work, tools and equipment, real workplace environment',
  medical:   'clean clinical photography, bright white interior, professional medical environment, calm and trustworthy atmosphere',
  legal:     'elegant office photography, law books, professional workspace, neutral sophisticated tones, premium corporate feel',
  beauty:    'elegant beauty salon photography, soft warm lighting, luxury aesthetic, pastel tones, feminine and refined',
  universal: 'professional business photography, modern office, clean composition, neutral background',
};

const ASSET_TYPE_CONTEXT: Record<AssetType, string> = {
  hero:             'wide establishing shot, hero image for website, full width composition',
  service:          'close-up professional service photo, detailed craftsmanship, before/after quality work',
  gallery:          'portfolio photo, finished work result, high quality outcome showcase',
  team:             'professional team portrait, friendly and approachable, business casual',
  logo_placeholder: 'simple minimalist logo placeholder, text-free, abstract geometric symbol',
};

function buildPrompt(params: {
  industry: string;
  templateFamily: string;
  serviceName?: string;
  city: string;
  assetType: AssetType;
  imageryStyle: string;
}): string {
  const style = INDUSTRY_STYLE[params.templateFamily] ?? INDUSTRY_STYLE.universal;
  const typeCtx = ASSET_TYPE_CONTEXT[params.assetType];

  let serviceCtx = '';
  if (params.serviceName && params.assetType === 'service') {
    serviceCtx = `showing ${params.serviceName}, `;
  }

  const qualityTags = 'ultra realistic, sharp focus, professional photography, 8k quality, no text, no watermarks, no logos';
  const negativeBase = 'blurry, low quality, amateur, stock photo cliché, generic, cartoon, illustration, text, watermark';

  return {
    positive: `${typeCtx}, ${serviceCtx}${style}, photorealistic, ${qualityTags}`,
    negative: negativeBase,
  } as any; // Zwracamy jako string poniżej
}

function buildPromptStrings(params: Parameters<typeof buildPrompt>[0]): { positive: string; negative: string } {
  const style = INDUSTRY_STYLE[params.templateFamily] ?? INDUSTRY_STYLE.universal;
  const typeCtx = ASSET_TYPE_CONTEXT[params.assetType];

  let serviceCtx = '';
  if (params.serviceName && params.assetType === 'service') {
    serviceCtx = `showing ${params.serviceName} work, `;
  }

  const qualityTags = 'ultra realistic, sharp focus, professional photography, 8k quality, no text, no watermarks';
  const negativeBase = 'blurry, low quality, amateur, generic stock photo cliché, cartoon, illustration, text, watermark, nsfw';

  return {
    positive: `${typeCtx}, ${serviceCtx}${style}, photorealistic, ${qualityTags}`,
    negative: negativeBase,
  };
}

// ─── Wywołanie Runware API ────────────────────────────────────────────────────

type RunwareImageResult = {
  imageURL: string;
  imageUUID: string;
  positivePrompt: string;
  model: string;
};

export async function generateImageWithRunware(params: {
  positivePrompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfgScale?: number;
  model?: string;
  seed?: number;
}): Promise<RunwareImageResult> {
  const apiKey = getApiKey();

  const payload = [{
    taskType: 'imageInference',
    taskUUID: crypto.randomUUID(),
    positivePrompt: params.positivePrompt,
    negativePrompt: params.negativePrompt ?? 'blurry, low quality, text, watermark, nsfw',
    width: params.width ?? 1024,
    height: params.height ?? 768,
    steps: params.steps ?? 28,
    CFGScale: params.cfgScale ?? 7,
    numberResults: 1,
    model: params.model ?? 'runware:100@1', // Runware fast model
    outputFormat: 'WEBP',
    outputQuality: 90,
    seed: params.seed ?? -1,
  }];

  const res = await fetch(`${RUNWARE_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Runware error ${res.status}: ${err}`);
  }

  const data = await res.json();

  // Runware zwraca tablicę wyników
  const result = data?.data?.[0] ?? data?.[0];
  if (!result?.imageURL) {
    throw new Error('Runware: brak imageURL w odpowiedzi. Response: ' + JSON.stringify(data).slice(0, 300));
  }

  return result as RunwareImageResult;
}

// ─── Generuj i zapisz do Supabase Storage + asset_library ────────────────────

export type GeneratedAsset = {
  assetId: string;
  storagePath: string;
  publicUrl: string;
  imageUUID: string;
  type: AssetType;
  altText: string;
};

export async function generateAndSaveAsset(params: {
  clientId: string;
  assetType: AssetType;
  industry: string;
  templateFamily: string;
  city: string;
  serviceName?: string;
  imageryStyle?: string;
  width?: number;
  height?: number;
}): Promise<GeneratedAsset> {
  const { positive, negative } = buildPromptStrings({
    industry: params.industry,
    templateFamily: params.templateFamily,
    serviceName: params.serviceName,
    city: params.city,
    assetType: params.assetType,
    imageryStyle: params.imageryStyle ?? 'practical',
  });

  // Wymiary per typ
  const dimensions: Record<AssetType, { w: number; h: number }> = {
    hero:             { w: 1440, h: 810  },
    service:          { w: 800,  h: 600  },
    gallery:          { w: 1024, h: 768  },
    team:             { w: 800,  h: 1000 },
    logo_placeholder: { w: 512,  h: 512  },
  };
  const { w, h } = dimensions[params.assetType];

  // Generuj obraz
  const runwareResult = await generateImageWithRunware({
    positivePrompt: positive,
    negativePrompt: negative,
    width: params.width ?? w,
    height: params.height ?? h,
  });

  // Pobierz binarkę obrazu
  const imgRes = await fetch(runwareResult.imageURL);
  if (!imgRes.ok) throw new Error(`Nie udało się pobrać wygenerowanego obrazu: ${imgRes.status}`);
  const imgBlob = await imgRes.blob();
  const imgBuffer = await imgBlob.arrayBuffer();

  // Upload do Supabase Storage
  const fileName = `ai-${params.assetType}-${Date.now()}.webp`;
  const storagePath = buildClientAssetPath({ clientId: params.clientId, fileName });

  const fileObj = new File([imgBuffer], fileName, { type: 'image/webp' });
  await uploadClientAsset({
    path: storagePath,
    file: fileObj,
    contentType: 'image/webp',
  });

  // Alt text
  const altMap: Record<AssetType, string> = {
    hero:             `${params.industry} ${params.city} — zdjęcie pracowni`,
    service:          params.serviceName ? `${params.serviceName} ${params.city}` : `Usługa ${params.city}`,
    gallery:          `Realizacja ${params.city} — ${params.industry}`,
    team:             `Zespół ${params.city}`,
    logo_placeholder: `Logo firmy`,
  };
  const altText = altMap[params.assetType];

  // Zapis rekordu w asset_library
  const asset = await createAssetRecord({
    client_id: params.clientId,
    type: params.assetType === 'logo_placeholder' ? 'logo' : params.assetType,
    storage_path: storagePath,
    alt_text: altText,
    title: `AI — ${params.assetType}${params.serviceName ? ' ' + params.serviceName : ''}`,
  });

  const supabaseUrl = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/client-media/${storagePath}`;

  return {
    assetId: asset.id,
    storagePath,
    publicUrl,
    imageUUID: runwareResult.imageUUID,
    type: params.assetType,
    altText,
  };
}

// ─── Bulk: generuj wszystkie brakujące assety dla klienta ────────────────────

export type BulkImageResult = {
  generated: GeneratedAsset[];
  errors: { type: string; error: string }[];
};

export async function generateMissingAssets(params: {
  clientId: string;
  industry: string;
  templateFamily: string;
  city: string;
  imageryStyle: string;
  serviceNames?: string[];
  existingTypes: string[];   // typy które już są w asset_library
}): Promise<BulkImageResult> {
  const { existingTypes, serviceNames = [] } = params;
  const generated: GeneratedAsset[] = [];
  const errors: { type: string; error: string }[] = [];

  const baseParams = {
    clientId:      params.clientId,
    industry:      params.industry,
    templateFamily:params.templateFamily,
    city:          params.city,
    imageryStyle:  params.imageryStyle,
  };

  // Hero — jeśli brak
  if (!existingTypes.includes('hero')) {
    try {
      const a = await generateAndSaveAsset({ ...baseParams, assetType: 'hero' });
      generated.push(a);
    } catch (e) {
      errors.push({ type: 'hero', error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Team — jeśli brak
  if (!existingTypes.includes('team')) {
    try {
      const a = await generateAndSaveAsset({ ...baseParams, assetType: 'team' });
      generated.push(a);
    } catch (e) {
      errors.push({ type: 'team', error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Service images — po jednej per usługę (max 4)
  const serviceCount = Math.min(serviceNames.length, 4);
  const existingServiceCount = existingTypes.filter((t) => t === 'service').length;

  for (let i = existingServiceCount; i < serviceCount; i++) {
    try {
      const a = await generateAndSaveAsset({
        ...baseParams,
        assetType: 'service',
        serviceName: serviceNames[i],
      });
      generated.push(a);
    } catch (e) {
      errors.push({ type: `service[${serviceNames[i]}]`, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Gallery — 3 zdjęcia jeśli mniej niż 2
  const existingGalleryCount = existingTypes.filter((t) => t === 'gallery').length;
  const galleryToGenerate = Math.max(0, 3 - existingGalleryCount);

  for (let i = 0; i < galleryToGenerate; i++) {
    try {
      const a = await generateAndSaveAsset({ ...baseParams, assetType: 'gallery' });
      generated.push(a);
    } catch (e) {
      errors.push({ type: `gallery[${i}]`, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return { generated, errors };
}
