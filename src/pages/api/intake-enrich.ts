import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { intakeId } = body as { intakeId: string };

    if (!intakeId) {
      return new Response(JSON.stringify({ ok: false, error: 'Brak intakeId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { storeGetById, storeUpdateEnrichment, storeUpdateStatus } =
      await import('../../lib/intake-store');
    const { enrichIntakeData, buildMetaprompt } =
      await import('../../lib/intake-enrichment');

    const intake = storeGetById(intakeId);
    storeUpdateStatus(intakeId, 'enriching');

    const enrichment = await enrichIntakeData(intake);
    const metaprompt = buildMetaprompt(intake, enrichment);

    storeUpdateEnrichment(intakeId, enrichment as Record<string, unknown>, metaprompt);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
