import type { APIRoute } from 'astro';
import { generateAndSaveAsset, generateMissingAssets } from '../../lib/ai-images';
import {
  createSystemLog,
  getAssetsByClientId,
  getClientById,
  getClientSiteConfig,
  getDesignProfileByClientId,
  getAllClientServices,
} from '../../lib/client-data';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, clientId } = body;

    if (!clientId) return json({ ok: false, error: 'Brak clientId' }, 400);

    const [client, siteConfig, profile] = await Promise.all([
      getClientById(clientId),
      getClientSiteConfig(clientId),
      getDesignProfileByClientId(clientId),
    ]);

    const baseParams = {
      clientId,
      industry: client.industry ?? 'usługi',
      templateFamily: profile?.template_family ?? siteConfig.template_family ?? 'universal',
      city: siteConfig.city ?? '',
      imageryStyle: profile?.imagery_style ?? 'practical',
    };

    // ── Generuj jeden asset ─────────────────────────────────────────────────
    if (action === 'generate-single') {
      const { assetType, serviceName } = body;

      const asset = await generateAndSaveAsset({
        ...baseParams,
        assetType,
        serviceName,
      });

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_image_generated',
        message: `Runware wygenerował zdjęcie: ${assetType}${serviceName ? ' — ' + serviceName : ''}`,
        payload_json: { asset_id: asset.assetId, type: assetType, uuid: asset.imageUUID },
      });

      return json({ ok: true, asset });
    }

    // ── Generuj wszystkie brakujące ─────────────────────────────────────────
    if (action === 'generate-missing') {
      const [existingAssets, services] = await Promise.all([
        getAssetsByClientId(clientId),
        getAllClientServices(clientId),
      ]);

      const existingTypes = existingAssets.map((a) => a.type);

      const result = await generateMissingAssets({
        ...baseParams,
        serviceNames: services.map((s) => s.name),
        existingTypes,
      });

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_images_bulk_generated',
        message: `Runware bulk: ${result.generated.length} zdjęć wygenerowanych`,
        payload_json: {
          generated_count: result.generated.length,
          errors: result.errors,
          types: result.generated.map((a) => a.type),
        },
      });

      return json({ ok: true, ...result });
    }

    return json({ ok: false, error: `Nieznana akcja: ${action}` }, 400);

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ ok: false, error: msg }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
