// Generowanie treści przez OpenRouter — pełny framework SEO
// Wytyczne: seo-content-writer + seo-local + seo-audit
//
// Reguły CORE-EEAT które stosujemy w każdym promptcie:
//   C01 — Intent Alignment: title promise must match content delivery
//   C02 — Direct Answer: core answer in first 150 words
//   C06 — Audience Targeting: content addresses specific user type
//   O01 — Heading Hierarchy: H1→H2→H3, no level skipping
//   O06 — Section Chunking: each section single topic, 3-5 sentences
//   R01 — Data Precision: ≥5 precise numbers with units
//   R04 — Evidence-Claim Mapping: every claim backed by context
//   R07 — Entity Precision: full names for people/orgs
//
// Local SEO (seo-local): city in title+H1, dedicated service pages,
//   NAP visible, tel: link, areaServed, 3+ query variants per service

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_CONTENT   = 'anthropic/claude-sonnet-4-5';
const MODEL_BULK      = 'anthropic/claude-haiku-4-5';  // haiku bez daty

function getApiKey(): string {
  const key = import.meta.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('Brak OPENROUTER_API_KEY w env');
  return key;
}

async function callOpenRouter(
  messages: { role: 'system' | 'user'; content: string }[],
  model = MODEL_CONTENT,
  maxTokens = 1800
): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://fabryka-stron.pl',
      'X-Title': 'Fabryka Stron v3',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

function parseJSON<T>(raw: string): T {
  // Wyczyść markdown code blocks
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^```\s*/i, '')
    .trim();

  // Wyciągnij JSON jeśli jest otoczony tekstem
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd   = cleaned.lastIndexOf('}');
  if (jsonStart > 0 || jsonEnd < cleaned.length - 1) {
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
    }
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Próba naprawy skróconego JSON — zastąp obcięte stringi
    const repaired = cleaned.replace(/("(?:[^"\\]|\\.)*?)$/, '$1..."');
    return JSON.parse(repaired) as T;
  }
}

// ─── Wspólne zasady SEO dołączane do każdego promptu ─────────────────────────

function buildSEOSystem(industry: string, city: string): string {
  return `Jesteś ekspertem SEO i copywriterem dla lokalnych polskich firm (${industry}, ${city}).

ZASADY OBOWIĄZKOWE (CORE-EEAT + Local SEO):

1. TYTUŁ (max 60 znaków): "[Usługa] [Miasto] — [Firma]" lub "[Firma] | [Usługa] [Miasto]"
   Keyword w pierwszej pozycji lub do 3 słowa od początku.

2. META DESCRIPTION (dokładnie 140-155 znaków):
   Wzór: [Konkretna propozycja wartości] + [Lokalizacja] + [CTA].
   Przykład: "Profesjonalne szycie na miarę w Kielcach. Garnitury, sukienki, płaszcze. Ponad 15 lat doświadczenia. Zadzwoń: +48 xxx."
   NIE: "Profesjonalne usługi dla Ciebie."

3. TREŚĆ (C02 — Direct Answer): Pierwsze 2 zdania = konkretna odpowiedź na główne zapytanie.
   NIE zacznij od "Firma XYZ to..." ani "Witamy na stronie..."

4. KONKRETNE LICZBY (R01 — ≥5 liczb w treści usługi):
   Czas realizacji (dni), lata doświadczenia, zasięg km, liczba klientów, ceny orientacyjne, gwarancja.

5. LOCAL SEO SIGNALS:
   - Miasto w H1 i w pierwszych 2 zdaniach
   - Co najmniej 3 warianty zapytania (np. "szycie na miarę Kielce", "krawiec Kielce", "szycie odzieży Kielce")
   - Nazwy dzielnic/obszarów obsługiwanych jeśli dostępne

6. FAQ (seo-content-writer: 40-60 słów na odpowiedź):
   Pytania muszą odpowiadać realnym zapytaniom Google (People Also Ask).
   Format odpowiedzi: konkretny fakt + szczegół + opcjonalnie CTA.

7. ZERO GENERIC COPY:
   NIE: "profesjonalne", "kompleksowe", "wysokiej jakości usługi", "doświadczony zespół"
   TAK: konkretne fakty, liczby, specjalizacje, nazwy metod, materiałów

8. INTERNAL LINKING ANCHORS (sugestie):
   Zaproponuj 2-3 anchor texty dla linków wewnętrznych do innych usług.`;
}

// ─── Typy ─────────────────────────────────────────────────────────────────────

export type ContentInput = {
  company_name: string;
  industry: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  template_family?: string | null;
  services?: string[];
  locations?: string[];
};

export type ServiceContentInput = ContentInput & {
  service_name: string;
  service_slug: string;
};

// ─── Generowanie treści usługi ────────────────────────────────────────────────

export type GeneratedServiceContent = {
  full_description: string;        // 300-500 słów, paragrafami rozdzielone \n
  meta_title: string;              // max 60 znaków
  meta_description: string;        // 140-155 znaków
  h1: string;                      // nagłówek z city + service
  intro_paragraph: string;         // pierwsze 150 słów = direct answer (C02)
  key_facts: string[];             // ≥5 konkretnych faktów/liczb (R01)
  faq: {
    question: string;
    answer: string;                // 40-60 słów
    schema_answer: string;         // wersja skrócona do FAQPage schema
  }[];
  internal_link_anchors: string[]; // sugestie anchor textów
  query_variants: string[];        // 3+ warianty zapytania
};

export async function generateServiceContent(
  input: ServiceContentInput
): Promise<GeneratedServiceContent> {
  const system = buildSEOSystem(input.industry, input.city);

  const user = `Firma: ${input.company_name}
Branża: ${input.industry} | Miasto: ${input.city}
Usługa: ${input.service_name}
Slug strony: /uslugi/${input.service_slug}
Inne usługi: ${input.services?.join(', ') ?? 'brak'}
Dodatkowe lokalizacje: ${input.locations?.join(', ') ?? 'brak'}

Wygeneruj kompletną treść SEO dla strony tej usługi.
Zwróć WYŁĄCZNIE poprawny JSON (bez markdown, bez komentarzy):
{
  "meta_title": "max 60 znaków, keyword na początku, zawiera miasto",
  "meta_description": "140-155 znaków, konkretna propozycja wartości + miasto + CTA",
  "h1": "nagłówek z usługą i miastem, max 70 znaków",
  "intro_paragraph": "pierwsze 2-3 zdania (max 150 słów), bezpośrednia odpowiedź na zapytanie, keyword w pierwszym zdaniu",
  "full_description": "pełna treść (300-450 słów), akapity rozdzielone przez \\n\\n, minimum 5 konkretnych liczb, zero generic copy",
  "key_facts": ["fakt 1 z liczbą", "fakt 2 z liczbą", "fakt 3 z liczbą", "fakt 4", "fakt 5"],
  "faq": [
    {
      "question": "Ile kosztuje [usługa] w [miasto]?",
      "answer": "40-60 słów, konkretne zakresy cenowe lub czynniki wpływające na cenę, zakończone kontaktem",
      "schema_answer": "wersja skrócona do 160 znaków dla FAQPage schema"
    },
    {
      "question": "Jak długo trwa [usługa]?",
      "answer": "40-60 słów, konkretny czas realizacji",
      "schema_answer": "wersja skrócona do 160 znaków"
    },
    {
      "question": "Czy dojeżdżacie do klienta w [miasto]?",
      "answer": "40-60 słów, zasięg obsługi",
      "schema_answer": "wersja skrócona do 160 znaków"
    }
  ],
  "internal_link_anchors": ["anchor 1", "anchor 2", "anchor 3"],
  "query_variants": ["wariant 1", "wariant 2", "wariant 3", "wariant 4"]
}`;

  const raw = await callOpenRouter(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    MODEL_CONTENT, 2000
  );

  return parseJSON<GeneratedServiceContent>(raw);
}

// ─── Generowanie treści strony głównej ───────────────────────────────────────

export type GeneratedHomeContent = {
  meta_title: string;
  meta_description: string;
  h1: string;
  hero_subtitle: string;
  usp_points: string[];            // 3 unikalne punkty wartości
  about_short: string;             // 2-3 zdania do sekcji O nas
  cta_primary: string;             // tekst głównego CTA
  cta_secondary: string;           // tekst drugorzędnego CTA
};

export async function generateHomeContent(input: ContentInput): Promise<GeneratedHomeContent> {
  const system = buildSEOSystem(input.industry, input.city);

  const user = `Firma: ${input.company_name} | Branża: ${input.industry} | Miasto: ${input.city}
Usługi: ${input.services?.join(', ') ?? ''}
Lokalizacje: ${input.locations?.join(', ') ?? input.city}

Wygeneruj treść strony głównej. Zwróć WYŁĄCZNIE JSON:
{
  "meta_title": "max 60 znaków — keyword + miasto + firma",
  "meta_description": "140-155 znaków — usługi + miasto + CTA konkretny",
  "h1": "max 55 znaków, konkretny i lokalny (zawiera miasto lub usługę główną)",
  "hero_subtitle": "1-2 zdania max 120 znaków — główna propozycja wartości + dostępność",
  "usp_points": [
    "konkretna przewaga 1 (z liczbą)",
    "konkretna przewaga 2 (z liczbą lub szczegółem)",
    "konkretna przewaga 3 (lokalny sygnał)"
  ],
  "about_short": "2-3 zdania o firmie z E-E-A-T (lata działania, specjalizacja, zasięg)",
  "cta_primary": "tekst głównego CTA — konkretny, nie 'Dowiedz się więcej'",
  "cta_secondary": "tekst drugorzędnego CTA"
}`;

  const raw = await callOpenRouter(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    MODEL_BULK, 800
  );
  return parseJSON<GeneratedHomeContent>(raw);
}

// ─── Generowanie treści O nas ─────────────────────────────────────────────────

export type GeneratedAboutContent = {
  meta_title: string;
  meta_description: string;
  h1: string;
  body_paragraphs: string[];       // tablica akapitów (3-4 akapity)
  team_intro?: string;             // opcjonalny krótki opis zespołu
  credentials: string[];           // certyfikaty, lata, doświadczenia (E-E-A-T R04)
};

export async function generateAboutContent(input: ContentInput): Promise<GeneratedAboutContent> {
  const system = buildSEOSystem(input.industry, input.city);

  const user = `Firma: ${input.company_name} | Branża: ${input.industry} | Miasto: ${input.city}
Usługi: ${input.services?.join(', ') ?? ''}

Wygeneruj stronę O nas z silnymi sygnałami E-E-A-T.
Zwróć WYŁĄCZNIE JSON:
{
  "meta_title": "max 60 znaków",
  "meta_description": "140-155 znaków",
  "h1": "nagłówek strony O nas (max 60 znaków, konkretny — nie 'O nas')",
  "body_paragraphs": [
    "Akapit 1 (60-80 słów): historia firmy — kiedy założona, przez kogo, co specjalizuje",
    "Akapit 2 (60-80 słów): nasze wartości i podejście — konkretne metody pracy",
    "Akapit 3 (60-80 słów): zespół — kwalifikacje, certyfikaty, szkolenia",
    "Akapit 4 (50-60 słów): obszar działania + zaproszenie do kontaktu"
  ],
  "team_intro": "1 zdanie o głównej osobie/właścicielu (opcjonalne, jeśli pasuje do branży)",
  "credentials": [
    "certyfikat/uprawnienie 1",
    "doświadczenie z liczbą",
    "osiągnięcie 3",
    "specjalizacja 4"
  ]
}`;

  const raw = await callOpenRouter(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    MODEL_CONTENT, 1200
  );
  return parseJSON<GeneratedAboutContent>(raw);
}

// ─── Generowanie treści lokalizacji ──────────────────────────────────────────

export type GeneratedLocationContent = {
  meta_title: string;
  meta_description: string;
  h1: string;
  intro: string;
  local_signals: string[];         // konkretne sygnały lokalne (obiekty, dzielnice, fakty)
  service_descriptions: Record<string, string>; // slug → krótki opis dla tej lokalizacji
};

export async function generateLocationContent(params: {
  company_name: string;
  industry: string;
  base_city: string;
  location_city: string;
  location_region?: string;
  services?: string[];
}): Promise<GeneratedLocationContent> {
  const system = buildSEOSystem(params.industry, params.location_city);

  const user = `Firma: ${params.company_name} (baza: ${params.base_city})
Branża: ${params.industry}
Lokalizacja strony: ${params.location_city}${params.location_region ? ` (${params.location_region})` : ''}
Usługi: ${params.services?.join(', ') ?? ''}

WAŻNE: treść musi być UNIKALNA dla tej lokalizacji.
Test "swap test": zamień ${params.location_city} na inne miasto — jeśli tekst nadal działa bez zmian, to jest doorway page (ZAKAZANE).
Muszą być konkretne sygnały dla ${params.location_city}: lokalne obiekty, obszary, charakterystyczne cechy.

Zwróć WYŁĄCZNIE JSON:
{
  "meta_title": "max 60 znaków — usługa + ${params.location_city}",
  "meta_description": "140-155 znaków — konkretne usługi + ${params.location_city} + CTA",
  "h1": "max 65 znaków, zawiera ${params.location_city}",
  "intro": "2-3 zdania (80-120 słów). Lokalne sygnały: konkretne obszary/dzielnice/odległość od centrum. UNIKALNA treść niepowtarzalna dla tej lokalizacji.",
  "local_signals": [
    "konkretny sygnał lokalny 1 (np. dzielnica/rejon/obiekt)",
    "sygnał 2 (np. czas dojazdu/zasięg)",
    "sygnał 3"
  ],
  "service_descriptions": {
    "${params.services?.[0]?.toLowerCase().replace(/\s+/g, '-') ?? 'usluga-1'}": "1-2 zdania unikalne dla tej lokalizacji"
  }
}`;

  const raw = await callOpenRouter(
    [{ role: 'system', content: system }, { role: 'user', content: user }],
    MODEL_BULK, 800
  );
  return parseJSON<GeneratedLocationContent>(raw);
}

// ─── Bulk generation ─────────────────────────────────────────────────────────

export type BulkGenerationResult = {
  home: GeneratedHomeContent;
  about: GeneratedAboutContent;
  services: Record<string, GeneratedServiceContent>;
  locations: Record<string, GeneratedLocationContent>;
  errors: string[];
};

export async function generateAllClientContent(params: {
  input: ContentInput;
  serviceNames: string[];
  serviceSlugs: string[];
  locationCities: string[];
  locationRegions: (string | null)[];
}): Promise<BulkGenerationResult> {
  const { input, serviceNames, serviceSlugs, locationCities, locationRegions } = params;
  const errors: string[] = [];
  const result: BulkGenerationResult = {
    home: {} as GeneratedHomeContent,
    about: {} as GeneratedAboutContent,
    services: {},
    locations: {},
    errors,
  };

  try { result.home = await generateHomeContent(input); }
  catch (e) { errors.push('home: ' + (e instanceof Error ? e.message : String(e))); }

  try { result.about = await generateAboutContent(input); }
  catch (e) { errors.push('about: ' + (e instanceof Error ? e.message : String(e))); }

  for (let i = 0; i < serviceNames.length; i++) {
    const slug = serviceSlugs[i];
    try {
      result.services[slug] = await generateServiceContent({
        ...input,
        service_name: serviceNames[i],
        service_slug: slug,
      });
    } catch (e) {
      errors.push(`service[${slug}]: ` + (e instanceof Error ? e.message : String(e)));
    }
  }

  for (let i = 0; i < locationCities.length; i++) {
    const city = locationCities[i];
    try {
      result.locations[city] = await generateLocationContent({
        company_name: input.company_name,
        industry: input.industry,
        base_city: input.city,
        location_city: city,
        location_region: locationRegions[i] ?? undefined,
        services: input.services,
      });
    } catch (e) {
      errors.push(`location[${city}]: ` + (e instanceof Error ? e.message : String(e)));
    }
  }

  return result;
}
