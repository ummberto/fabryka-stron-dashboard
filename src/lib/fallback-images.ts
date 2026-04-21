/**
 * Fallback Images — zasady doboru zdjęć per branża
 *
 * Gdy klient nie ma własnych assetów w Supabase, system dobiera
 * tematycznie pasujące zdjęcia z Unsplash na podstawie pola `industry`
 * (lub `template_family`).
 *
 * Zasady:
 * 1. Wszystkie URL-e kończą się parametrami Unsplash (?w=…&q=75&fit=crop)
 *    zoptymalizowanymi pod dany slot (hero = szeroki, karta = kwadrat).
 * 2. Każda branża definiuje: hero, team, process/about, why, serwisy (3+),
 *    oraz opcjonalnie slider testimoniali (bg).
 * 3. Fallback dla nieznanych branż to pakiet "ogólne usługi budowlane".
 * 4. Branżę identyfikujemy po industry (string), następnie template_family.
 * 5. Do rozpoznania używamy slug-like keywords (lowercase, bez polskich znaków).
 */

export interface IndustryImages {
  /** Szerokie hero — format 16:9, min 1920px */
  hero: string;
  /** Zdjęcie zespołu / pracowników w akcji — format 4:3 */
  team: string;
  /** Zdjęcie procesu pracy / warsztat — format 4:3 */
  process: string;
  /** Zdjęcie "dlaczego my" — format 3:4 lub kwadrat */
  why: string;
  /** Zdjęcia usług (3–6 sztuk) — format 3:2 */
  services: string[];
  /** Tło sekcji testimoniali — ciemne, format panorama */
  testimonialsBg: string;
  /** Zdjęcie dla sekcji O nas (półstrona) */
  about: string;
  /** Zdjęcia galerii / realizacji */
  gallery: string[];
}

// ── Branże ────────────────────────────────────────────────────────────────────

const ELECTRICAL: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=75&fit=crop',
  ],
};

const PLUMBING: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1584622781867-1c5dc37eacdf?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=75&fit=crop',
  ],
};

const HVAC: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=75&fit=crop',
  ],
};

const CLEANING: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1584622781867-1c5dc37eacdf?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1584622781867-1c5dc37eacdf?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1584622781867-1c5dc37eacdf?w=600&q=75&fit=crop',
  ],
};

const CONSTRUCTION: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=600&q=75&fit=crop',
  ],
};

const PAINTING: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=75&fit=crop',
  ],
};

const ROOFING: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=75&fit=crop',
  ],
};

const LANDSCAPING: IndustryImages = {
  hero: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=75&fit=crop',
  team: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&q=75&fit=crop',
  process: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=75&fit=crop',
  why: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=75&fit=crop',
  about: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=900&q=75&fit=crop',
  testimonialsBg: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=60&fit=crop',
  services: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=700&q=75&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=75&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=75&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75&fit=crop',
  ],
};

/** Domyślny fallback dla nieznanych branż (usługi remontowe/ogólnobudowlane) */
const DEFAULT: IndustryImages = CONSTRUCTION;

// ── Mapowanie keywords → zestaw zdjęć ────────────────────────────────────────

/**
 * Normalizuje string do porównania: lowercase, bez polskich znaków, tylko alfanumeryczne
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const INDUSTRY_MAP: Array<{ keywords: string[]; images: IndustryImages }> = [
  {
    keywords: ['elektryk', 'elektryka', 'electrical', 'electric', 'instalacje elektryczne', 'voltflow', 'volts'],
    images: ELECTRICAL,
  },
  {
    keywords: ['hydraulik', 'hydraulika', 'plumbing', 'plumber', 'instalacje sanitarne', 'kanalizacja', 'woda'],
    images: PLUMBING,
  },
  {
    keywords: ['klimatyzacja', 'hvac', 'ogrzewanie', 'wentylacja', 'heating', 'cooling', 'pompa ciepla', 'kotly'],
    images: HVAC,
  },
  {
    keywords: ['sprzatanie', 'czyszczenie', 'cleaning', 'cleaner', 'mycie', 'porzadki', 'serwis sprzatajacy'],
    images: CLEANING,
  },
  {
    keywords: ['remont', 'budowlanka', 'budowlany', 'construction', 'wykonczenia', 'wykonczenia', 'generalne', 'budowa'],
    images: CONSTRUCTION,
  },
  {
    keywords: ['malarz', 'malarstwo', 'painting', 'malowanie', 'tynkowanie', 'tynki'],
    images: PAINTING,
  },
  {
    keywords: ['dach', 'dachy', 'roofing', 'dekarstwo', 'dekarz', 'krycie dachow'],
    images: ROOFING,
  },
  {
    keywords: ['ogrod', 'ogrodnik', 'landscaping', 'zielen', 'zieleń', 'pielegnacja', 'trawnik', 'nasadzenia'],
    images: LANDSCAPING,
  },
];

/**
 * Zwraca zestaw zdjęć dopasowany do branży klienta.
 *
 * @param industry — pole `industry` z tabeli `clients`, np. "Elektryk Warszawa"
 * @param templateFamily — pole `template_family` z design profile, np. "voltflow"
 */
export function getFallbackImages(
  industry?: string | null,
  templateFamily?: string | null
): IndustryImages {
  const candidates = [industry, templateFamily]
    .filter(Boolean)
    .map((s) => normalize(s!));

  for (const candidate of candidates) {
    for (const entry of INDUSTRY_MAP) {
      if (entry.keywords.some((kw) => candidate.includes(normalize(kw)))) {
        return entry.images;
      }
    }
  }

  return DEFAULT;
}

/**
 * Zwraca URL zdjęcia usługi dla danego indeksu (cyklicznie).
 */
export function getServiceFallback(
  images: IndustryImages,
  index: number
): string {
  return images.services[index % images.services.length];
}

/**
 * Zwraca URL zdjęcia galerii dla danego indeksu (cyklicznie).
 */
export function getGalleryFallback(
  images: IndustryImages,
  index: number
): string {
  return images.gallery[index % images.gallery.length];
}
