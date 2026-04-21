// intake-enrichment.ts
// LLM #1 — analityk/strateg: jeden call → ustrukturyzowany JSON
// LLM #2 — brak: metaprompt budowany czystym szablonem (przewidywalny, tani, szybki)

import type { IntakeProject } from './client-data';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

function getApiKey(): string {
  const key = import.meta.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('Brak OPENROUTER_API_KEY w env');
  return key;
}

async function callAI(system: string, user: string): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://fabryka-stron.pl',
      'X-Title': 'Fabryka Stron - Intake',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

function safeParseJSON<T>(raw: string): T {
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^```\s*/i, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && (start > 0 || end < cleaned.length - 1)) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned) as T;
}

// ─── Typy wyjściowe enrichmentu ──────────────────────────────────────────────

export type EnrichmentPage = {
  name: string;
  slug: string;
  goal: string;
  primary_keywords: string[];
  sections: string[];
  meta_title: string;
  meta_description: string;
};

export type EnrichmentOutput = {
  recommended_site_type: string;
  recommended_page_count: number;
  pages: EnrichmentPage[];
  seo_keywords: {
    primary: string[];
    secondary: string[];
    local_variants: string[];
    long_tail: string[];
  };
  target_audiences: Array<{ type: string; intent: string }>;
  usp: string[];
  conversion_strategy: {
    main_cta: string;
    secondary_cta: string;
    trust_elements: string[];
  };
  brand_positioning: {
    tone: string;
    positioning: string;
  };
  content_notes: string;
  technical_notes: string;
};

// ─── AI enrichment (LLM #1) ──────────────────────────────────────────────────

export async function enrichIntakeData(intake: IntakeProject): Promise<EnrichmentOutput> {
  const systemPrompt = `Jesteś strategiem digital marketingu i SEO dla lokalnych polskich firm.
Twoim zadaniem jest analiza danych wejściowych firmy i przygotowanie strategicznych danych
do stworzenia profesjonalnej strony internetowej.

ZASADY:
- Myśl jak senior SEO specialist + UX strategist + conversion copywriter
- Uwzględnij lokalny kontekst polskiego rynku
- Frazy kluczowe generuj w języku polskim, naturalnie
- Struktura strony musi odzwierciedlać cel biznesowy (leady, kontakt, sprzedaż)
- Zwróć WYŁĄCZNIE poprawny JSON, bez markdownu, bez komentarzy

WYMAGANA STRUKTURA JSON:
{
  "recommended_site_type": string,
  "recommended_page_count": number,
  "pages": [{ "name": string, "slug": string, "goal": string, "primary_keywords": string[], "sections": string[], "meta_title": string, "meta_description": string }],
  "seo_keywords": { "primary": string[], "secondary": string[], "local_variants": string[], "long_tail": string[] },
  "target_audiences": [{ "type": string, "intent": string }],
  "usp": string[],
  "conversion_strategy": { "main_cta": string, "secondary_cta": string, "trust_elements": string[] },
  "brand_positioning": { "tone": string, "positioning": string },
  "content_notes": string,
  "technical_notes": string
}`;

  const userPrompt = `Przeanalizuj dane firmy i zwróć ustrukturyzowaną strategię jako JSON.

DANE FIRMY:
- Nazwa: ${intake.company_name}
- Branża: ${intake.industry ?? 'nie podano'}
- Główna oferta: ${intake.main_offer ?? 'nie podano'}
- Dodatkowe usługi: ${(intake.extra_offers ?? []).join(', ') || 'brak'}
- Lokalizacja główna: ${intake.main_location ?? 'nie podano'}
- Obszar działania: ${(intake.service_area ?? []).join(', ') || 'jak lokalizacja główna'}
- Grupa docelowa: ${intake.target_audience ?? 'nie podano'}
- Przewagi firmy: ${(intake.benefits ?? []).join(', ') || 'nie podano'}
- Ton komunikacji: ${intake.tone_of_voice ?? 'profesjonalny'}
- Cel strony: ${intake.website_goal ?? 'pozyskiwanie klientów'}
- Blog: ${intake.has_blog ? 'tak' : 'nie'}
- FAQ: ${intake.has_faq ? 'tak' : 'nie'}
- Opinie/recenzje: ${intake.has_reviews ? 'tak' : 'nie'}
- Case studies: ${intake.has_case_studies ? 'tak' : 'nie'}
- Preferowany typ strony: ${intake.site_type_preference ?? 'dopasuj do branży'}
- Konkurenci: ${intake.competitors ?? 'nie podano'}
- Aktualna strona: ${intake.current_url ?? 'brak'}
- Manualne słowa kluczowe: ${intake.manual_keywords ?? 'brak'}

Zwróć wyłącznie JSON. Bez markdown. Bez komentarzy.`;

  const raw = await callAI(systemPrompt, userPrompt);
  return safeParseJSON<EnrichmentOutput>(raw);
}

// ─── Metaprompt builder (szablon — bez AI) ───────────────────────────────────

export function buildMetaprompt(intake: IntakeProject, e: EnrichmentOutput): string {
  const serviceArea = (intake.service_area ?? []).join(', ') || (intake.main_location ?? '');
  const benefits = (intake.benefits ?? []).map((b) => `- ${b}`).join('\n') || '- nie podano';
  const extraOffers = (intake.extra_offers ?? []).join('\n- ') || 'brak';

  const seoBlock = [
    `Główne frazy: ${e.seo_keywords.primary.join(', ')}`,
    `Wspierające: ${e.seo_keywords.secondary.join(', ')}`,
    `Lokalne warianty: ${e.seo_keywords.local_variants.join(', ')}`,
    `Long-tail: ${e.seo_keywords.long_tail.join(', ')}`,
  ].join('\n');

  const pagesBlock = e.pages
    .map((p, i) => {
      const sections = p.sections.map((s) => `    - ${s}`).join('\n');
      return `${i + 1}. **${p.name}** (\`/${p.slug}\`)
   Cel: ${p.goal}
   Główne frazy: ${p.primary_keywords.join(', ')}
   Meta title: ${p.meta_title}
   Meta description: ${p.meta_description}
   Sekcje:
${sections}`;
    })
    .join('\n\n');

  const uspBlock = e.usp.map((u) => `- ${u}`).join('\n');
  const trustBlock = e.conversion_strategy.trust_elements.map((t) => `- ${t}`).join('\n');
  const audienceBlock = e.target_audiences
    .map((a) => `- **${a.type}**: ${a.intent}`)
    .join('\n');

  const optionalFeatures: string[] = [];
  if (intake.has_faq) optionalFeatures.push('sekcja FAQ (min. 5 pytań)');
  if (intake.has_reviews) optionalFeatures.push('sekcja opinii/rekomendacji klientów');
  if (intake.has_blog) optionalFeatures.push('podstrona Blog z listą wpisów');
  if (intake.has_case_studies) optionalFeatures.push('sekcja realizacji / case studies');

  const locationPagesBlock = (() => {
    const mode = intake.has_location_pages;
    if (!mode) return '';
    const cities = intake.service_area ?? [intake.main_location ?? ''];
    const services = intake.extra_offers ?? [];

    if (mode === 'lokalizacje') {
      return `
---

## PODSTRONY LOKALIZACJI

Wygeneruj osobne podstrony dla każdej obsługiwanej lokalizacji:

${cities.map((c) => `- \`/${c.toLowerCase().replace(/\s+/g, '-')}\` — "${intake.main_offer ?? 'usługa'} ${c}"`).join('\n')}

Każda podstrona lokalizacji musi:
- Mieć unikalny H1 z nazwą miasta i usługą
- Zawierać lokalne słowa kluczowe (city + usługa)
- Mieć dedykowany meta title i meta description
- Linkować do strony głównej i formularza kontaktowego`;
    }

    if (mode === 'uslugi') {
      return `
---

## PODSTRONY USŁUG

Wygeneruj osobne podstrony dla każdej usługi:

${[intake.main_offer, ...services].filter(Boolean).map((s) => `- \`/${(s ?? '').toLowerCase().replace(/\s+/g, '-')}\` — pełna strona usługi: "${s}"`).join('\n')}

Każda podstrona usługi musi:
- Skupiać się na jednej konkretnej usłudze
- Zawierać: opis, korzyści, cennik (lub "wycena indywidualna"), FAQ, CTA
- Mieć unikalny meta title z nazwą usługi`;
    }

    if (mode === 'lokalizacje-i-uslugi') {
      const combos = cities.slice(0, 5).flatMap((c) =>
        [intake.main_offer, ...services.slice(0, 3)].filter(Boolean).map((s) =>
          `- \`/${(s ?? '').toLowerCase().replace(/\s+/g, '-')}-${c.toLowerCase().replace(/\s+/g, '-')}\` — "${s} ${c}"`
        )
      );
      return `
---

## PODSTRONY LOKALIZACJA x USŁUGA

Wygeneruj kombinowane podstrony usługa + miasto (tzw. landing pages lokalne):

${combos.join('\n')}

Zasady dla podstron lokalizacja×usługa:
- URL: /[slug-usługi]-[slug-miasta]
- H1: "[Usługa] [Miasto]" — eksplicytne, konwersyjne
- Treść unikalna dla każdej kombinacji (nie powielaj szablonowo)
- Schema.org: LocalBusiness z adresem miasta
- Wewnętrzne linkowanie między miastami i usługami`;
    }

    return '';
  })();

  return `# METAPROMPT: Strona internetowa dla ${intake.company_name}

---

## ROLA

Jesteś jednocześnie:
- **Senior UX/UI designerem** dla stron usługowych i lokalnych biznesów
- **Senior SEO strategistem** specjalizującym się w lokalnym SEO w Polsce
- **Senior copywriterem konwersyjnym** piszącym po polsku
- **Senior front-end developerem** tworzącym produkcyjny, semantyczny kod

---

## CEL BIZNESOWY

Główny cel strony: **${intake.website_goal ?? 'pozyskiwanie klientów'}**

Firma: **${intake.company_name}**
Branża: ${intake.industry ?? '-'}
Lokalizacja: ${intake.main_location ?? '-'} (obsługiwany obszar: ${serviceArea})

Główne CTA: **${e.conversion_strategy.main_cta}**
Drugie CTA: ${e.conversion_strategy.secondary_cta}

---

## DANE FIRMY

**Główna oferta:** ${intake.main_offer ?? '-'}

**Dodatkowe usługi:**
- ${extraOffers}

**Przewagi firmy (USP):**
${benefits}

**Pozycjonowanie marki:** ${e.brand_positioning.positioning}

**Ton komunikacji:** ${e.brand_positioning.tone}

**Grupy docelowe i intencje:**
${audienceBlock}

**Dane kontaktowe:**
- Telefon: ${intake.phone ?? '-'}
- E-mail: ${intake.email ?? '-'}

---

## SEO

${seoBlock}

**Zasady SEO:**
- Każda podstrona ma unikalny primary keyword, meta title i meta description
- City/lokalizacja w H1 i tytule tam, gdzie ma sens
- Nagłówki H1→H2→H3 bez pomijania poziomów
- Naturalne nasycenie frazami (nie przesycaj)
- Dane strukturalne: LocalBusiness schema.org na stronie głównej
- Linki tel: i mailto: klikalny
- sitemap.xml i robots.txt

---

## STRUKTURA STRONY

**Typ strony:** ${e.recommended_site_type} (${e.recommended_page_count} podstron)

${pagesBlock}
${locationPagesBlock}

---

## ELEMENTY OBOWIĄZKOWE

**Elementy zaufania:**
${trustBlock}

**Opcjonalne funkcjonalności:**
${optionalFeatures.length > 0 ? optionalFeatures.map((f) => `- ${f}`).join('\n') : '- brak dodatkowych elementów'}

---

## WYMAGANIA TREŚCI

- Pisz **po polsku**, profesjonalnie i konkretnie
- Unikaj generycznego marketingowego bełkotu
- Podkreślaj lokalność, doświadczenie, szybkość i zaufanie
- Każda sekcja ma jasny cel: konwersyjny lub informacyjny
- Hero section: oferta + lokalizacja + CTA widoczne bez scrollowania
- Elementy zaufania: above the fold lub bardzo wysoko

---

## WYMAGANIA UX/UI

- **Mobile-first** — projekt zaczyna się od widoku mobilnego
- Nowoczesny, premium i profesjonalny wygląd
- Czytelna hierarchia informacji
- Szybki kontakt telefoniczny i formularzowy jako priorytety
- Responsywny układ na wszystkich urządzeniach

---

## WYMAGANIA TECHNICZNE

**Stack:** ${intake.target_stack ?? 'Next.js + Tailwind CSS'}

- Semantyczny HTML5 (header, main, section, footer, nav, article)
- Accessibility: ARIA labels, alt texty, kontrast min. 4.5:1
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Reusable components (nawigacja, footer, CTA, karta usługi)
- Formularz kontaktowy gotowy do podpięcia backendu (name, phone, message, submit)
- Schema.org: LocalBusiness, breadcrumbs, FAQ (jeśli dotyczy)
- Czyste URL-e, no trailing slash

${e.technical_notes ? `**Dodatkowe uwagi techniczne:** ${e.technical_notes}` : ''}

---

## OUTPUT

Dostarcz kompletny, produkcyjny kod:

1. **Architektura plików** — struktura katalogów
2. **Wszystkie podstrony** — kompletny kod każdej z listy powyżej
3. **Komponenty** — nawigacja, footer, CTA section, karta usługi, formularz
4. **Treści** — pełne copywriterskie treści (nie placeholder "lorem ipsum")
5. **SEO meta** — title, description, og:* dla każdej podstrony
6. **Schema.org** — LocalBusiness markup na stronie głównej

Jeżeli jakieś dane wejściowe są niepełne — uzupełnij je rozsądnie na podstawie branży i lokalizacji, zachowując profesjonalizm i spójność.

${e.content_notes ? `**Dodatkowe uwagi contentowe:** ${e.content_notes}` : ''}

---

*Wygenerowano przez Fabrykę Stron — ${new Date().toLocaleDateString('pl-PL')}*
`;
}
