import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const { storeGetAll } = await import('../../lib/intake-store');
    const projects = storeGetAll();
    return new Response(JSON.stringify({ ok: true, count: projects.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
