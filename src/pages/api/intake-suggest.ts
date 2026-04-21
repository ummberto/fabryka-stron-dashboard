import type { APIRoute } from 'astro';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

function getApiKey(): string {
  const key = import.meta.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('Brak OPENROUTER_API_KEY w env');
  return key;
}

async function callAI(prompt: string): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://fabryka-stron.pl',
      'X-Title': 'Fabryka Stron - Suggest',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '[]';
}

function parseArray(raw: string): string[] {
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(cleaned);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, location, services, service_area } = body as {
      type: 'cities' | 'keywords';
      location?: string;
      services?: string[];
      service_area?: string;
    };

    let prompt = '';

    if (type === 'cities') {
      if (!location) throw new Error('Brak location');
      const context = service_area ? ` Znany kontekst geograficzny: "${service_area}".` : '';
      prompt = `Jesteś ekspertem od polskiej geografii lokalnej i rynków lokalnych.
Firma działa w miejscowości "${location}" w Polsce.${context}
Podaj 12 miast i miejscowości w promieniu do 50 km, sortując od NAJWIĘKSZYCH i NAJWAŻNIEJSZYCH rynków (największa liczba mieszkańców, największy potencjał klientów) do mniejszych.
Skup się na miastach gdzie firma realnie pozyska klientów — pomijaj małe wsie i sołectwa.
Nie powtarzaj miast które są już w kontekście geograficznym.
Zwróć WYŁĄCZNIE tablicę JSON z samymi nazwami: ["Miasto1", "Miasto2", ...]
Bez markdown, bez komentarzy, tylko JSON array.`;
    } else if (type === 'keywords') {
      const serviceList = (services ?? []).filter(Boolean).join(', ');
      if (!serviceList) throw new Error('Brak services');
      prompt = `Jesteś senior SEO specjalistą dla polskiego rynku lokalnego.
Wygeneruj 15 fraz kluczowych w języku polskim dla firmy świadczącej usługi: "${serviceList}"${location ? ` w lokalizacji "${location}"` : ''}.
Frazy mają być:
- Naturalne, po polsku
- Mix: ogólne + z lokalizacją + long-tail
- Gotowe do użycia w treści strony i meta tagach
Zwróć WYŁĄCZNIE tablicę JSON: ["fraza 1", "fraza 2", ...]
Bez markdown, bez komentarzy, tylko JSON array.`;
    } else {
      throw new Error('Nieprawidłowy type');
    }

    const raw = await callAI(prompt);
    const suggestions = parseArray(raw);

    return new Response(JSON.stringify({ ok: true, suggestions }), {
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
