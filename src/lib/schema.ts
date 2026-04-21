// Schema.org JSON-LD generator
// Per seo-local: correct LocalBusiness subtype, geo 5 decimal places, areaServed, NAP
// Per seo-audit: Service, FAQPage, BreadcrumbList schemas
// Per seo-content-writer: FAQPage from generated FAQ content

// ─── Industry subtypes per seo-local/references/local-schema-types.md ────────

export const INDUSTRY_SCHEMA_TYPE: Record<string, string> = {
  trade:     'HomeAndConstructionBusiness',
  hydraulik: 'Plumber',
  elektryk:  'Electrician',
  medical:   'MedicalClinic',
  dental:    'Dentist',
  fizjo:     'Physiotherapist',
  legal:     'LegalService',
  beauty:    'HairSalon',
  spa:       'SpaOrHealthClub',
  nail:      'NailSalon',
  universal: 'LocalBusiness',
  other:     'LocalBusiness',
};

function getSchemaType(industry: string): string {
  return INDUSTRY_SCHEMA_TYPE[industry.toLowerCase()] ?? 'LocalBusiness';
}

// ─── Typy ─────────────────────────────────────────────────────────────────────

export type LocalBusinessSchemaParams = {
  name: string;
  type?: string;
  industry?: string;
  url: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string;
  postalCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  priceRange?: string;
  openingHours?: OpeningHour[];
  serviceAreas?: string[];    // dla SAB (service area business)
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
};

export type OpeningHour = {
  days: string[];  // np. ['Monday','Tuesday','Wednesday','Thursday','Friday']
  opens: string;   // np. '08:00'
  closes: string;  // np. '18:00'
};

export type ServiceSchemaParams = {
  name: string;
  description: string;
  url: string;
  provider: string;
  areaServed?: string;
  imageUrl?: string | null;
};

export type FAQSchemaParams = {
  items: { question: string; answer: string }[];
};

export type BreadcrumbSchemaParams = {
  items: { name: string; url: string }[];
};

// ─── LocalBusiness ─────────────────────────────────────────────────────────────

export function buildLocalBusinessSchema(params: LocalBusinessSchemaParams): object {
  const schemaType = params.type ?? getSchemaType(params.industry ?? 'universal');

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${params.url}#localbusiness`,
    name: params.name,
    url: params.url,
  };

  // Telefon — click-to-call (seo-local: must use tel: link)
  if (params.phone) schema.telephone = params.phone;
  if (params.email) schema.email = params.email;

  // Adres (NAP — seo-local: visible in page HTML and schema)
  if (params.address || params.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: params.address ?? undefined,
      addressLocality: params.city ?? undefined,
      addressCountry: params.country ?? 'PL',
      postalCode: params.postalCode ?? undefined,
    };
  }

  // Geo — minimum 5 decimal places (seo-local: Confirmed best practice)
  if (params.lat && params.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(params.lat.toFixed(5)),
      longitude: Number(params.lng.toFixed(5)),
    };
  }

  // Opis
  if (params.description) schema.description = params.description;

  // Logo
  if (params.logoUrl) {
    schema.logo = {
      '@type': 'ImageObject',
      url: params.logoUrl,
    };
  }

  // Zdjęcie
  if (params.imageUrl) {
    schema.image = params.imageUrl;
  }

  // Zakres cen
  if (params.priceRange) schema.priceRange = params.priceRange;

  // Godziny otwarcia (seo-local: businesses open at search time rank higher)
  if (params.openingHours && params.openingHours.length > 0) {
    schema.openingHoursSpecification = params.openingHours.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.days.map((d) => `https://schema.org/${d}`),
      opens: oh.opens,
      closes: oh.closes,
    }));
  }

  // Service area (SAB — areaServed)
  if (params.serviceAreas && params.serviceAreas.length > 0) {
    schema.areaServed = params.serviceAreas.map((city) => ({
      '@type': 'City',
      name: city,
    }));
  }

  // Oceny (aggregateRating — seo-local: aggregateRating in schema)
  if (params.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: params.aggregateRating.ratingValue,
      reviewCount: params.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

// ─── Service ───────────────────────────────────────────────────────────────────

export function buildServiceSchema(params: ServiceSchemaParams): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      '@type': 'LocalBusiness',
      name: params.provider,
    },
  };

  if (params.areaServed) {
    schema.areaServed = {
      '@type': 'City',
      name: params.areaServed,
    };
  }

  if (params.imageUrl) {
    schema.image = params.imageUrl;
  }

  return schema;
}

// ─── FAQPage ───────────────────────────────────────────────────────────────────
// seo-content-writer: FAQ answers 40-60 words for featured snippet opportunity

export function buildFAQSchema(params: FAQSchemaParams): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: params.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// ─── BreadcrumbList ────────────────────────────────────────────────────────────

export function buildBreadcrumbSchema(params: BreadcrumbSchemaParams): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: params.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── WebPage ───────────────────────────────────────────────────────────────────

export function buildWebPageSchema(params: {
  url: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  datePublished?: string;
  dateModified?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: params.url,
    name: params.title,
    description: params.description,
    image: params.imageUrl ?? undefined,
    datePublished: params.datePublished ?? new Date().toISOString().split('T')[0],
    dateModified: params.dateModified ?? new Date().toISOString().split('T')[0],
  };
}

// ─── Helper: serializuj do <script> tag ──────────────────────────────────────

export function toSchemaScriptTag(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`;
}

// ─── Composite: wszystkie schema dla strony głównej ──────────────────────────

export function buildHomePageSchemas(params: {
  siteConfig: {
    site_name?: string | null;
    domain?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    template_family?: string | null;
  };
  client: {
    company_name: string;
    industry?: string | null;
  };
  services: { name: string; slug: string; short_description?: string | null }[];
  locations: { city: string }[];
  logoUrl?: string | null;
  heroUrl?: string | null;
  description?: string;
}): object[] {
  const domain = params.siteConfig.domain
    ? `https://${params.siteConfig.domain.replace(/^https?:\/\//, '')}`
    : 'https://example.com';

  const schemas: object[] = [];

  // LocalBusiness
  schemas.push(buildLocalBusinessSchema({
    name: params.siteConfig.site_name ?? params.client.company_name,
    industry: params.client.industry ?? 'universal',
    url: domain,
    phone: params.siteConfig.phone,
    email: params.siteConfig.email,
    address: params.siteConfig.address,
    city: params.siteConfig.city,
    description: params.description,
    logoUrl: params.logoUrl,
    imageUrl: params.heroUrl,
    serviceAreas: params.locations.map((l) => l.city),
  }));

  // Breadcrumb (homepage = jedna pozycja)
  schemas.push(buildBreadcrumbSchema({
    items: [{ name: 'Strona główna', url: domain }],
  }));

  return schemas;
}

// ─── Composite: schema dla strony usługi ─────────────────────────────────────

export function buildServicePageSchemas(params: {
  service: { name: string; slug: string };
  siteConfig: {
    site_name?: string | null;
    domain?: string | null;
    city?: string | null;
  };
  client: { company_name: string; industry?: string | null };
  description: string;
  imageUrl?: string | null;
  faq?: { question: string; answer: string }[];
}): object[] {
  const domain = params.siteConfig.domain
    ? `https://${params.siteConfig.domain.replace(/^https?:\/\//, '')}`
    : 'https://example.com';

  const serviceUrl = `${domain}/uslugi/${params.service.slug}`;
  const schemas: object[] = [];

  // Service schema
  schemas.push(buildServiceSchema({
    name: params.service.name,
    description: params.description,
    url: serviceUrl,
    provider: params.siteConfig.site_name ?? params.client.company_name,
    areaServed: params.siteConfig.city ?? undefined,
    imageUrl: params.imageUrl,
  }));

  // Breadcrumb
  schemas.push(buildBreadcrumbSchema({
    items: [
      { name: 'Strona główna', url: domain },
      { name: 'Usługi', url: `${domain}/uslugi` },
      { name: params.service.name, url: serviceUrl },
    ],
  }));

  // FAQ schema jeśli dostępne
  if (params.faq && params.faq.length > 0) {
    schemas.push(buildFAQSchema({ items: params.faq }));
  }

  return schemas;
}

// ─── Composite: schema dla strony lokalizacji ─────────────────────────────────

export function buildLocationPageSchemas(params: {
  location: { city: string; slug: string; region?: string | null };
  siteConfig: {
    site_name?: string | null;
    domain?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  };
  client: { company_name: string; industry?: string | null };
  services: { name: string }[];
}): object[] {
  const domain = params.siteConfig.domain
    ? `https://${params.siteConfig.domain.replace(/^https?:\/\//, '')}`
    : 'https://example.com';

  const locationUrl = `${domain}/lokalizacje/${params.location.slug}`;
  const schemas: object[] = [];

  // LocalBusiness dla tej lokalizacji
  schemas.push(buildLocalBusinessSchema({
    name: `${params.siteConfig.site_name ?? params.client.company_name} — ${params.location.city}`,
    industry: params.client.industry ?? 'universal',
    url: locationUrl,
    phone: params.siteConfig.phone,
    email: params.siteConfig.email,
    address: params.siteConfig.address,
    city: params.location.city,
    serviceAreas: params.location.region ? [params.location.city, params.location.region] : [params.location.city],
  }));

  // Breadcrumb
  schemas.push(buildBreadcrumbSchema({
    items: [
      { name: 'Strona główna', url: domain },
      { name: 'Lokalizacje', url: `${domain}/lokalizacje` },
      { name: params.location.city, url: locationUrl },
    ],
  }));

  return schemas;
}
