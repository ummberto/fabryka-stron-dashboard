// Centralny katalog Design System v3
// Źródło prawdy dla template families, presetów i katalogu sekcji.

export type TemplateFamilyKey = 'universal' | 'trade' | 'medical' | 'legal' | 'beauty';

export type DesignPreset = {
  font_pair: string;
  cta_style: 'soft' | 'urgent' | 'premium';
  section_rhythm: 'airy' | 'compact';
  radius_style: 'soft' | 'squared';
  motion_level: 'none' | 'low' | 'medium';
  imagery_style: 'clinical' | 'practical' | 'elegant';
};

export type SectionVariantRule = {
  section_key: string;
  recommended_variant: string;
  allowed_variants: string[];
  note: string;
};

export type TemplateFamilyDef = {
  key: TemplateFamilyKey;
  label: string;
  description: string;
  example_industries: string[];
  preset: DesignPreset;
  sections: SectionVariantRule[];
  do: string[];
  dont: string[];
};

// ─── KATALOG SEKCJI ──────────────────────────────────────────────────────────

export const SECTION_CATALOG: Record<string, { label: string; variants: Record<string, string> }> = {
  hero: {
    label: 'Hero',
    variants: {
      v1: 'Klasyczny — duży nagłówek + CTA + zdjęcie po prawej',
      v2: 'Fullwidth — tło zdjęciowe + nakładka tekstowa',
      v3: 'Minimalistyczny — tylko tekst, bez zdjęcia',
      compact: 'Kompaktowy — mała sekcja powitalna bez zdjęcia',
      premium: 'Premium — animowany gradient + typografia display',
    },
  },
  services_grid: {
    label: 'Siatka usług',
    variants: {
      v1: 'Karty 3-kolumnowe z ikoną i opisem',
      v2: 'Lista z lewą ikoną — bardziej treściwa',
      v3: 'Duże kafle z tłem — dla 4-6 usług',
      compact: 'Prosta lista bez ikon',
    },
  },
  faq: {
    label: 'FAQ',
    variants: {
      v1: 'Accordion — rozwijane pytania',
      v2: 'Dwukolumnowy grid — widoczne odpowiedzi',
      compact: 'Prosta lista pytanie + odpowiedź',
    },
  },
  reviews: {
    label: 'Opinie',
    variants: {
      v1: 'Karty z gwiazdkami i podpisem',
      v2: 'Duży cytat wyróżniony',
      compact: 'Lista inline bez kart',
    },
  },
  cta: {
    label: 'CTA',
    variants: {
      soft: 'Delikatne — zachęta bez presji',
      urgent: 'Pilne — "Zadzwoń teraz", licznik lub dostępność',
      premium: 'Premium — elegancki blok z wyróżnieniem wartości',
    },
  },
  contact_block: {
    label: 'Blok kontaktowy',
    variants: {
      v1: 'Formularz + dane kontaktowe obok',
      v2: 'Tylko dane kontaktowe — bez formularza',
      v3: 'Mapa + formularz',
    },
  },
  local_proof: {
    label: 'Dowód lokalny',
    variants: {
      v1: 'Liczniki: lat doświadczenia, realizacji, zasięg km',
      v2: 'Mapa obszaru obsługi',
      compact: 'Prosta lista obsługiwanych dzielnic/miast',
    },
  },
  about_teaser: {
    label: 'O nas (skrót)',
    variants: {
      v1: 'Zdjęcie + krótki tekst + link do O nas',
      v2: 'Tylko tekst — bez zdjęcia',
    },
  },
};

// ─── TEMPLATE FAMILIES ───────────────────────────────────────────────────────

export const TEMPLATE_FAMILIES: Record<TemplateFamilyKey, TemplateFamilyDef> = {
  universal: {
    key: 'universal',
    label: 'Universal',
    description: 'Ogólny szablon dla firm usługowych bez wyraźnej specjalizacji branżowej. Bezpieczny, czytelny, łatwy w utrzymaniu.',
    example_industries: ['agencje', 'freelancerzy', 'konsultanci', 'firmy IT', 'usługi różne'],
    preset: {
      font_pair: 'Inter + Inter',
      cta_style: 'soft',
      section_rhythm: 'airy',
      radius_style: 'soft',
      motion_level: 'low',
      imagery_style: 'practical',
    },
    sections: [
      { section_key: 'hero', recommended_variant: 'v1', allowed_variants: ['v1', 'v2', 'v3'], note: 'Klasyczny hero dobrze sprawdza się w większości branż.' },
      { section_key: 'services_grid', recommended_variant: 'v1', allowed_variants: ['v1', 'v2', 'v3', 'compact'], note: '3-kolumnowe karty dla 3-9 usług.' },
      { section_key: 'reviews', recommended_variant: 'v1', allowed_variants: ['v1', 'v2', 'compact'], note: 'Karty z gwiazdkami budują zaufanie.' },
      { section_key: 'faq', recommended_variant: 'v1', allowed_variants: ['v1', 'v2', 'compact'], note: 'Accordion standardowy.' },
      { section_key: 'cta', recommended_variant: 'soft', allowed_variants: ['soft', 'urgent', 'premium'], note: 'Miękkie CTA dla universal.' },
      { section_key: 'contact_block', recommended_variant: 'v1', allowed_variants: ['v1', 'v2', 'v3'], note: 'Formularz + dane.' },
    ],
    do: [
      'Używaj neutralnej palety kolorów.',
      'Podkreślaj konkretne efekty pracy.',
      'CTA prowadź do formularza lub telefonu.',
    ],
    dont: [
      'Nie używaj imagery_style: clinical — zbyt zimny dla universal.',
      'Nie stosuj motion_level: medium bez powodu.',
    ],
  },

  trade: {
    key: 'trade',
    label: 'Trade',
    description: 'Dla firm rzemieślniczych i usługowych — hydraulika, elektryka, budowlanka, remonty, klimatyzacja. Nacisk na dostępność 24/7, zaufanie i szybkość reakcji.',
    example_industries: ['hydraulicy', 'elektrycy', 'firmy remontowe', 'ślusarze', 'dekarze', 'klimatyzacja', 'instalatorzy'],
    preset: {
      font_pair: 'Roboto + Roboto Condensed',
      cta_style: 'urgent',
      section_rhythm: 'compact',
      radius_style: 'squared',
      motion_level: 'none',
      imagery_style: 'practical',
    },
    sections: [
      { section_key: 'hero', recommended_variant: 'v2', allowed_variants: ['v1', 'v2', 'compact'], note: 'Fullwidth z numerem telefonu w pierwszym widoku.' },
      { section_key: 'services_grid', recommended_variant: 'v2', allowed_variants: ['v1', 'v2', 'compact'], note: 'Lista z ikonami — szybka orientacja.' },
      { section_key: 'local_proof', recommended_variant: 'v1', allowed_variants: ['v1', 'compact'], note: 'Liczniki i zasięg to kluczowy dowód lokalny dla trade.' },
      { section_key: 'reviews', recommended_variant: 'v1', allowed_variants: ['v1', 'compact'], note: 'Opinie z nazwiskiem i dzielnicą — wiarygodność lokalna.' },
      { section_key: 'cta', recommended_variant: 'urgent', allowed_variants: ['urgent', 'soft'], note: 'Urgent CTA — "Awaria? Dzwoń teraz".' },
      { section_key: 'faq', recommended_variant: 'compact', allowed_variants: ['v1', 'compact'], note: 'FAQ krótkie — klienci trade nie czytają długich tekstów.' },
      { section_key: 'contact_block', recommended_variant: 'v2', allowed_variants: ['v1', 'v2'], note: 'Tylko dane kontaktowe — numer telefonu najważniejszy.' },
    ],
    do: [
      'Numer telefonu widoczny w hero i w sticky headerze.',
      'Eksponuj dostępność: całodobowe, weekendy, 24/7.',
      'Dodaj local proof — dzielnice, zasięg, lata w branży.',
      'Zdjęcia: realne prace, ekipa, nie stockowe.',
    ],
    dont: [
      'Nie używaj elegant imagery — wygląda nieprofesjonalnie dla hydraulika.',
      'Nie stosuj premium CTA — zbyt drogi dla trade.',
      'Nie ukrywaj numeru telefonu za formularzem.',
    ],
  },

  medical: {
    key: 'medical',
    label: 'Medical',
    description: 'Dla gabinetów medycznych, fizjoterapeutów, dentystów, lekarzy specjalistów, weterynarzy. Nacisk na zaufanie, kompetencje i spokojną estetykę.',
    example_industries: ['lekarze', 'dentyści', 'fizjoterapeuci', 'psycholodzy', 'weterynarze', 'dietetycy', 'gabinety medyczne'],
    preset: {
      font_pair: 'DM Serif + DM Sans',
      cta_style: 'soft',
      section_rhythm: 'airy',
      radius_style: 'soft',
      motion_level: 'low',
      imagery_style: 'clinical',
    },
    sections: [
      { section_key: 'hero', recommended_variant: 'v1', allowed_variants: ['v1', 'v3'], note: 'Spokojny hero — zdjęcie gabinetu lub specjalisty.' },
      { section_key: 'about_teaser', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Zdjęcie specjalisty + kilka zdań — personalizacja ważna.' },
      { section_key: 'services_grid', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Karty usług z krótkim opisem.' },
      { section_key: 'reviews', recommended_variant: 'v2', allowed_variants: ['v1', 'v2'], note: 'Wyróżniony cytat od pacjenta — buduje zaufanie.' },
      { section_key: 'faq', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Accordion z pytaniami pacjentów.' },
      { section_key: 'cta', recommended_variant: 'soft', allowed_variants: ['soft'], note: 'Tylko soft CTA — urgent jest zbyt agresywne dla medical.' },
      { section_key: 'contact_block', recommended_variant: 'v1', allowed_variants: ['v1', 'v3'], note: 'Formularz rezerwacji lub mapa z adresem.' },
    ],
    do: [
      'Podkreślaj kwalifikacje i certyfikaty.',
      'Używaj spokojnej palety: biele, szarości, akcent w jednym kolorze.',
      'Zdjęcia: gabinet, specjalista, nie klipart z stetoskopem.',
      'RODO i polityka prywatności widoczna przy formularzu.',
    ],
    dont: [
      'Nie używaj urgent CTA — wywołuje niepokój.',
      'Nie stosuj compact rhythm — zbyt gęste dla medical.',
      'Nie stosuj motion_level: medium — roztrasza pacjentów.',
    ],
  },

  legal: {
    key: 'legal',
    label: 'Legal',
    description: 'Dla kancelarii prawnych, radców prawnych, notariuszy, doradców podatkowych. Nacisk na powagę, profesjonalizm i precyzję.',
    example_industries: ['prawnicy', 'radcy prawni', 'notariusze', 'doradcy podatkowi', 'kancelarie'],
    preset: {
      font_pair: 'Playfair Display + Source Sans Pro',
      cta_style: 'premium',
      section_rhythm: 'airy',
      radius_style: 'squared',
      motion_level: 'none',
      imagery_style: 'elegant',
    },
    sections: [
      { section_key: 'hero', recommended_variant: 'v3', allowed_variants: ['v1', 'v3'], note: 'Minimalistyczny hero — powaga bez zdjęć stockowych.' },
      { section_key: 'about_teaser', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Zdjęcie kancelarii lub prawnika + credentials.' },
      { section_key: 'services_grid', recommended_variant: 'v2', allowed_variants: ['v1', 'v2'], note: 'Lista specjalizacji z opisami.' },
      { section_key: 'reviews', recommended_variant: 'v2', allowed_variants: ['v2', 'compact'], note: 'Wyróżniony cytat — jeden mocny zamiast wielu.' },
      { section_key: 'faq', recommended_variant: 'v2', allowed_variants: ['v1', 'v2'], note: 'Widoczne odpowiedzi — klienci mają konkretne pytania.' },
      { section_key: 'cta', recommended_variant: 'premium', allowed_variants: ['premium', 'soft'], note: 'Premium CTA z podkreśleniem wartości konsultacji.' },
      { section_key: 'contact_block', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Formularz + dane + dojazd.' },
    ],
    do: [
      'Eksponuj specjalizacje i lata praktyki.',
      'Używaj poważnej typografii — szeryfowej dla nagłówków.',
      'Zdjęcia: kancelaria, biuro, nie stockowe dłonie z dokumentami.',
      'Wyraź poufność i dyskrecję w treści.',
    ],
    dont: [
      'Nie używaj urgent CTA — deprecjonuje powagę kancelarii.',
      'Nie stosuj practical imagery — zbyt potoczne dla legal.',
      'Nie mieszaj wielu kolorów akcentowych.',
    ],
  },

  beauty: {
    key: 'beauty',
    label: 'Beauty',
    description: 'Dla salonów fryzjerskich, kosmetycznych, SPA, stylizacji paznokci, lash & brow. Nacisk na estetykę, emocje i zaufanie do specjalisty.',
    example_industries: ['fryzjerzy', 'kosmetyczki', 'salony paznokci', 'lash & brow', 'SPA', 'masaż', 'stylizatorzy'],
    preset: {
      font_pair: 'Cormorant Garamond + Lato',
      cta_style: 'soft',
      section_rhythm: 'airy',
      radius_style: 'soft',
      motion_level: 'medium',
      imagery_style: 'elegant',
    },
    sections: [
      { section_key: 'hero', recommended_variant: 'premium', allowed_variants: ['v2', 'premium'], note: 'Duże, piękne zdjęcie efektów pracy — pierwsze wrażenie kluczowe.' },
      { section_key: 'about_teaser', recommended_variant: 'v1', allowed_variants: ['v1'], note: 'Zdjęcie specjalistki + osobista historia.' },
      { section_key: 'services_grid', recommended_variant: 'v3', allowed_variants: ['v1', 'v3'], note: 'Duże kafle z zdjęciami usług.' },
      { section_key: 'reviews', recommended_variant: 'v1', allowed_variants: ['v1', 'v2'], note: 'Karty z gwiazdkami i inicjałami.' },
      { section_key: 'faq', recommended_variant: 'v1', allowed_variants: ['v1', 'compact'], note: 'Accordion — często pytania o cennik i dostępność.' },
      { section_key: 'cta', recommended_variant: 'soft', allowed_variants: ['soft', 'premium'], note: 'Soft lub premium — "Umów wizytę" zamiast "Zadzwoń teraz".' },
      { section_key: 'contact_block', recommended_variant: 'v3', allowed_variants: ['v1', 'v3'], note: 'Mapa + formularz rezerwacji online.' },
    ],
    do: [
      'Galeria efektów pracy — najważniejszy element konwersji.',
      'Podkreślaj konkretne marki produktów i certyfikaty.',
      'Zdjęcia: własne efekty pracy, nie stockowe.',
      'Godziny pracy i możliwość rezerwacji online.',
    ],
    dont: [
      'Nie używaj urgent CTA — beauty to nie awaria.',
      'Nie stosuj clinical imagery — zabija atmosferę.',
      'Nie stosuj squared radius — zbyt ostry dla beauty.',
    ],
  },
};

// ─── HELPERY ─────────────────────────────────────────────────────────────────

export function getDesignPreset(family: TemplateFamilyKey): DesignPreset {
  return TEMPLATE_FAMILIES[family].preset;
}

export function getRecommendedSections(family: TemplateFamilyKey): SectionVariantRule[] {
  return TEMPLATE_FAMILIES[family].sections;
}

export function getAllFamilies(): TemplateFamilyDef[] {
  return Object.values(TEMPLATE_FAMILIES);
}

// Checklista spójności wizualnej dla danego profilu
export type ChecklistItem = {
  id: string;
  label: string;
  category: 'typography' | 'color' | 'imagery' | 'cta' | 'layout' | 'content';
  severity: 'blocker' | 'warning' | 'info';
  passed: boolean;
  note?: string;
};

export function runDesignConsistencyCheck(params: {
  family: TemplateFamilyKey | null;
  font_pair: string | null;
  cta_style: string | null;
  section_rhythm: string | null;
  radius_style: string | null;
  motion_level: string | null;
  imagery_style: string | null;
  section_keys_set: string[];
}): ChecklistItem[] {
  const { family, font_pair, cta_style, section_rhythm, radius_style, motion_level, imagery_style, section_keys_set } = params;

  const items: ChecklistItem[] = [];

  // 1. Podstawowe pola profilu
  items.push({
    id: 'has_family',
    label: 'Template family jest ustawiony',
    category: 'layout',
    severity: 'blocker',
    passed: !!family,
  });
  items.push({
    id: 'has_font_pair',
    label: 'Font pair jest ustawiony',
    category: 'typography',
    severity: 'blocker',
    passed: !!font_pair,
  });
  items.push({
    id: 'has_cta_style',
    label: 'CTA style jest ustawiony',
    category: 'cta',
    severity: 'blocker',
    passed: !!cta_style,
  });
  items.push({
    id: 'has_section_rhythm',
    label: 'Section rhythm jest ustawiony',
    category: 'layout',
    severity: 'warning',
    passed: !!section_rhythm,
  });
  items.push({
    id: 'has_radius_style',
    label: 'Radius style jest ustawiony',
    category: 'layout',
    severity: 'warning',
    passed: !!radius_style,
  });
  items.push({
    id: 'has_motion_level',
    label: 'Motion level jest ustawiony',
    category: 'layout',
    severity: 'info',
    passed: !!motion_level,
  });
  items.push({
    id: 'has_imagery_style',
    label: 'Imagery style jest ustawiony',
    category: 'imagery',
    severity: 'warning',
    passed: !!imagery_style,
  });

  // 2. Walidacja reguł per family
  if (family === 'medical') {
    items.push({
      id: 'medical_no_urgent_cta',
      label: 'Medical: brak urgent CTA (zbyt agresywne dla pacjentów)',
      category: 'cta',
      severity: 'blocker',
      passed: cta_style !== 'urgent',
      note: 'W branży medycznej urgent CTA wywołuje niepokój. Użyj soft.',
    });
    items.push({
      id: 'medical_no_compact_rhythm',
      label: 'Medical: brak compact rhythm (zbyt gęste dla medical)',
      category: 'layout',
      severity: 'warning',
      passed: section_rhythm !== 'compact',
    });
  }

  if (family === 'legal') {
    items.push({
      id: 'legal_no_urgent_cta',
      label: 'Legal: brak urgent CTA (deprecjonuje powagę kancelarii)',
      category: 'cta',
      severity: 'blocker',
      passed: cta_style !== 'urgent',
    });
    items.push({
      id: 'legal_no_practical_imagery',
      label: 'Legal: imagery style nie jest practical (zbyt potoczne)',
      category: 'imagery',
      severity: 'warning',
      passed: imagery_style !== 'practical',
    });
  }

  if (family === 'beauty') {
    items.push({
      id: 'beauty_no_urgent_cta',
      label: 'Beauty: brak urgent CTA (beauty to nie awaria)',
      category: 'cta',
      severity: 'warning',
      passed: cta_style !== 'urgent',
    });
    items.push({
      id: 'beauty_no_clinical',
      label: 'Beauty: imagery style nie jest clinical (zabija atmosferę)',
      category: 'imagery',
      severity: 'blocker',
      passed: imagery_style !== 'clinical',
    });
    items.push({
      id: 'beauty_no_squared_radius',
      label: 'Beauty: radius style nie jest squared (zbyt ostry)',
      category: 'layout',
      severity: 'warning',
      passed: radius_style !== 'squared',
    });
  }

  if (family === 'trade') {
    items.push({
      id: 'trade_no_elegant_imagery',
      label: 'Trade: imagery style nie jest elegant (nieprofesjonalne dla hydraulika)',
      category: 'imagery',
      severity: 'warning',
      passed: imagery_style !== 'elegant',
    });
    items.push({
      id: 'trade_no_premium_cta',
      label: 'Trade: brak premium CTA (zbyt drogi przekaz dla trade)',
      category: 'cta',
      severity: 'warning',
      passed: cta_style !== 'premium',
    });
  }

  // 3. Sekcje minimalne
  items.push({
    id: 'has_hero',
    label: 'Strona główna ma sekcję hero',
    category: 'layout',
    severity: 'blocker',
    passed: section_keys_set.includes('hero'),
  });
  items.push({
    id: 'has_services',
    label: 'Strona ma zdefiniowaną siatkę usług',
    category: 'content',
    severity: 'blocker',
    passed: section_keys_set.includes('services_grid'),
  });
  items.push({
    id: 'has_cta',
    label: 'Strona ma sekcję CTA',
    category: 'cta',
    severity: 'warning',
    passed: section_keys_set.includes('cta'),
  });
  items.push({
    id: 'has_contact',
    label: 'Strona ma blok kontaktowy',
    category: 'content',
    severity: 'blocker',
    passed: section_keys_set.includes('contact_block'),
  });
  items.push({
    id: 'has_reviews',
    label: 'Strona ma sekcję opinii',
    category: 'content',
    severity: 'warning',
    passed: section_keys_set.includes('reviews'),
  });

  return items;
}
