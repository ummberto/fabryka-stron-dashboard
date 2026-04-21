// Design token system — Fabryka Stron v3
//
// Wytyczne:
//   awwwards-ui-skills: #E4E4E4 bg, dark cards #2F2E30, 127px headings, 7px radius, 4px grid
//   frontend-design: OKLCH colors, clamp() fluid type, asymmetry, no generic AI slop
//   ui-ux-pro-max: 4.5:1 contrast, 44px touch targets, semantic tokens, 150-300ms transitions
//   polish: all interactive states, WCAG AA, consistent spacing rhythm

export type TemplateFamilyKey = 'trade' | 'medical' | 'legal' | 'beauty' | 'universal';

export type DesignTokens = {
  // OKLCH colors — perceptually uniform (frontend-design)
  colorScheme:     'light' | 'dark';
  bgPage:          string;   // page background
  bgSurface:       string;   // cards, panels
  bgSurfaceHover:  string;
  bgSurfaceAlt:    string;   // alternate surface
  accent:          string;   // primary accent
  accentHover:     string;
  accentText:      string;   // text on accent bg
  accentSubtle:    string;   // light tint of accent
  textPrimary:     string;
  textSecondary:   string;
  textMuted:       string;
  borderDefault:   string;
  borderSubtle:    string;

  // Typography
  fontDisplay:     string;   // display/heading font stack
  fontBody:        string;   // body font stack
  googleFonts:     string;   // Google Fonts query string

  // Layout (awwwards: 7px radius, 4px grid)
  radiusSm:        string;
  radiusMd:        string;
  radiusLg:        string;
  radiusXl:        string;

  // Spacing — 4pt grid (ui-ux-pro-max)
  sectionPy:       string;
  heroPy:          string;
  containerPx:     string;

  // CTA
  ctaBg:           string;
  ctaColor:        string;
  ctaBorder:       string;
  ctaStyle:        'soft' | 'urgent' | 'premium';

  // Motion (ui-ux-pro-max: 150-300ms, ease-out)
  transitionBase:  string;
  transitionFast:  string;
};

// ─── Token presets per family ─────────────────────────────────────────────────
// awwwards: light bg + dark cards aesthetic
// frontend-design: OKLCH, distinctive, memorable

const TOKENS: Record<TemplateFamilyKey, DesignTokens> = {

  // TRADE: ciemny industrial, ostry pomarańczowy
  // "Emergency Utility" — hydraulicy, elektrycy, budowlanka
  trade: {
    colorScheme:    'dark',
    bgPage:         'oklch(0.12 0.008 50)',      // very dark warm
    bgSurface:      'oklch(0.18 0.008 50)',      // dark card
    bgSurfaceHover: 'oklch(0.22 0.008 50)',
    bgSurfaceAlt:   'oklch(0.15 0.008 50)',
    accent:         'oklch(0.68 0.19 48)',       // aggressive orange
    accentHover:    'oklch(0.75 0.19 48)',
    accentText:     'oklch(0.98 0 0)',
    accentSubtle:   'oklch(0.18 0.04 48)',
    textPrimary:    'oklch(0.93 0.008 60)',
    textSecondary:  'oklch(0.65 0.008 60)',
    textMuted:      'oklch(0.42 0.008 60)',
    borderDefault:  'oklch(0.28 0.008 50)',
    borderSubtle:   'oklch(0.22 0.008 50)',
    fontDisplay:    "'Barlow Condensed', 'Roboto Condensed', sans-serif",
    fontBody:       "'Barlow', 'Inter', system-ui, sans-serif",
    googleFonts:    'family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:ital,wght@0,400;0,500;0,600;1,400',
    radiusSm:       '2px',
    radiusMd:       '4px',
    radiusLg:       '6px',
    radiusXl:       '8px',
    sectionPy:      'clamp(40px, 5vw, 56px)',
    heroPy:         'clamp(48px, 6vw, 72px)',
    containerPx:    'clamp(16px, 4vw, 24px)',
    ctaBg:          'oklch(0.68 0.19 48)',
    ctaColor:       'oklch(0.98 0 0)',
    ctaBorder:      'transparent',
    ctaStyle:       'urgent',
    transitionBase: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionFast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // MEDICAL: jasny, kliniczny, spokojny
  // Zaufanie i spokój — lekarze, fizjoterapeuci, dentyści
  medical: {
    colorScheme:    'light',
    bgPage:         'oklch(0.97 0.008 220)',     // zimny biały z odcieniem
    bgSurface:      'oklch(1 0 0)',              // czysta biel kart
    bgSurfaceHover: 'oklch(0.97 0.008 220)',
    bgSurfaceAlt:   'oklch(0.94 0.01 220)',
    accent:         'oklch(0.52 0.14 220)',      // profesjonalny teal
    accentHover:    'oklch(0.45 0.14 220)',
    accentText:     'oklch(0.98 0 0)',
    accentSubtle:   'oklch(0.94 0.04 220)',
    textPrimary:    'oklch(0.18 0.01 220)',
    textSecondary:  'oklch(0.42 0.01 220)',
    textMuted:      'oklch(0.62 0.01 220)',
    borderDefault:  'oklch(0.88 0.01 220)',
    borderSubtle:   'oklch(0.93 0.01 220)',
    fontDisplay:    "'DM Serif Display', Georgia, serif",
    fontBody:       "'DM Sans', system-ui, sans-serif",
    googleFonts:    'family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400',
    radiusSm:       '6px',
    radiusMd:       '10px',
    radiusLg:       '16px',
    radiusXl:       '20px',
    sectionPy:      'clamp(56px, 7vw, 88px)',
    heroPy:         'clamp(72px, 8vw, 104px)',
    containerPx:    'clamp(16px, 4vw, 24px)',
    ctaBg:          'oklch(0.52 0.14 220)',
    ctaColor:       'oklch(0.98 0 0)',
    ctaBorder:      'transparent',
    ctaStyle:       'soft',
    transitionBase: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionFast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // LEGAL: editorial premium, granat + złoto
  // Powaga i precyzja — prawnicy, notariusze
  legal: {
    colorScheme:    'light',
    bgPage:         'oklch(0.97 0.012 85)',      // ciepły kremowy
    bgSurface:      'oklch(0.99 0.006 85)',
    bgSurfaceHover: 'oklch(0.95 0.01 85)',
    bgSurfaceAlt:   'oklch(0.94 0.015 85)',
    accent:         'oklch(0.28 0.06 265)',      // navy
    accentHover:    'oklch(0.22 0.06 265)',
    accentText:     'oklch(0.98 0 0)',
    accentSubtle:   'oklch(0.93 0.02 265)',
    textPrimary:    'oklch(0.16 0.01 85)',
    textSecondary:  'oklch(0.38 0.01 85)',
    textMuted:      'oklch(0.58 0.01 85)',
    borderDefault:  'oklch(0.85 0.012 85)',
    borderSubtle:   'oklch(0.91 0.008 85)',
    fontDisplay:    "'Playfair Display', 'Garamond', Georgia, serif",
    fontBody:       "'Source Sans 3', system-ui, sans-serif",
    googleFonts:    'family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,300;1,400',
    radiusSm:       '0px',
    radiusMd:       '2px',
    radiusLg:       '4px',
    radiusXl:       '4px',
    sectionPy:      'clamp(64px, 8vw, 96px)',
    heroPy:         'clamp(80px, 9vw, 112px)',
    containerPx:    'clamp(16px, 4vw, 24px)',
    ctaBg:          'oklch(0.28 0.06 265)',
    ctaColor:       'oklch(0.98 0 0)',
    ctaBorder:      'transparent',
    ctaStyle:       'premium',
    transitionBase: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionFast: '130ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // BEAUTY: warm luxury, róż + złoto
  // Estetyka i emocje — fryzjerzy, kosmetyczki, SPA
  beauty: {
    colorScheme:    'light',
    bgPage:         'oklch(0.97 0.015 30)',      // ciepły kremowy z różowym
    bgSurface:      'oklch(0.99 0.008 30)',
    bgSurfaceHover: 'oklch(0.96 0.015 30)',
    bgSurfaceAlt:   'oklch(0.94 0.02 30)',
    accent:         'oklch(0.58 0.12 10)',       // głęboki róż
    accentHover:    'oklch(0.65 0.12 10)',
    accentText:     'oklch(0.98 0 0)',
    accentSubtle:   'oklch(0.94 0.04 10)',
    textPrimary:    'oklch(0.18 0.015 30)',
    textSecondary:  'oklch(0.42 0.012 30)',
    textMuted:      'oklch(0.62 0.01 30)',
    borderDefault:  'oklch(0.87 0.015 30)',
    borderSubtle:   'oklch(0.93 0.01 30)',
    fontDisplay:    "'Cormorant Garamond', 'Didot', Georgia, serif",
    fontBody:       "'Lato', system-ui, sans-serif",
    googleFonts:    'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400',
    radiusSm:       '12px',
    radiusMd:       '20px',
    radiusLg:       '28px',
    radiusXl:       '40px',
    sectionPy:      'clamp(64px, 8vw, 96px)',
    heroPy:         'clamp(80px, 10vw, 120px)',
    containerPx:    'clamp(16px, 4vw, 24px)',
    ctaBg:          'oklch(0.58 0.12 10)',
    ctaColor:       'oklch(0.98 0 0)',
    ctaBorder:      'transparent',
    ctaStyle:       'soft',
    transitionBase: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionFast: '180ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // UNIVERSAL: czysty, nowoczesny, indigo
  universal: {
    colorScheme:    'light',
    bgPage:         'oklch(0.97 0.008 260)',     // bardzo jasny indigo
    bgSurface:      'oklch(1 0 0)',
    bgSurfaceHover: 'oklch(0.97 0.008 260)',
    bgSurfaceAlt:   'oklch(0.94 0.01 260)',
    accent:         'oklch(0.5 0.18 265)',       // indigo
    accentHover:    'oklch(0.44 0.18 265)',
    accentText:     'oklch(0.98 0 0)',
    accentSubtle:   'oklch(0.93 0.05 265)',
    textPrimary:    'oklch(0.16 0.008 260)',
    textSecondary:  'oklch(0.42 0.008 260)',
    textMuted:      'oklch(0.62 0.008 260)',
    borderDefault:  'oklch(0.88 0.008 260)',
    borderSubtle:   'oklch(0.93 0.005 260)',
    fontDisplay:    "'Plus Jakarta Sans', system-ui, sans-serif",
    fontBody:       "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFonts:    'family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400',
    radiusSm:       '4px',
    radiusMd:       '8px',
    radiusLg:       '12px',
    radiusXl:       '16px',
    sectionPy:      'clamp(56px, 7vw, 80px)',
    heroPy:         'clamp(64px, 8vw, 96px)',
    containerPx:    'clamp(16px, 4vw, 24px)',
    ctaBg:          'oklch(0.5 0.18 265)',
    ctaColor:       'oklch(0.98 0 0)',
    ctaBorder:      'transparent',
    ctaStyle:       'soft',
    transitionBase: '200ms cubic-bezier(0.16, 1, 0.3, 1)',
    transitionFast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getDesignTokens(profile: {
  template_family?: string | null;
  radius_style?: string | null;
  section_rhythm?: string | null;
  cta_style?: string | null;
} | null): DesignTokens {
  const family = (profile?.template_family ?? 'universal') as TemplateFamilyKey;
  const base = { ...(TOKENS[family] ?? TOKENS.universal) };

  // Radius override (zachowaj skalę, tylko zmień skrót)
  if (profile?.radius_style === 'squared') {
    base.radiusSm = '0px'; base.radiusMd = '2px';
    base.radiusLg = '4px'; base.radiusXl = '4px';
  } else if (profile?.radius_style === 'soft') {
    base.radiusSm = '8px'; base.radiusMd = '14px';
    base.radiusLg = '20px'; base.radiusXl = '28px';
  }

  // Rhythm override
  if (profile?.section_rhythm === 'compact') {
    base.sectionPy = 'clamp(32px, 4vw, 48px)';
    base.heroPy    = 'clamp(40px, 5vw, 60px)';
  } else if (profile?.section_rhythm === 'airy') {
    base.sectionPy = 'clamp(64px, 8vw, 96px)';
    base.heroPy    = 'clamp(80px, 10vw, 120px)';
  }

  // CTA style override
  if (profile?.cta_style) {
    base.ctaStyle = profile.cta_style as 'soft' | 'urgent' | 'premium';
    if (profile.cta_style === 'urgent') {
      base.ctaBg = 'oklch(0.6 0.2 25)';  // red-orange
      base.ctaColor = 'oklch(0.98 0 0)';
    } else if (profile.cta_style === 'premium') {
      base.ctaBg = 'transparent';
      base.ctaBorder = base.accent;
      base.ctaColor = base.accent;
    }
  }

  return base;
}

export function tokensToCssVars(t: DesignTokens): Record<string, string> {
  return {
    'bg-page':           t.bgPage,
    'bg-surface':        t.bgSurface,
    'bg-surface-hover':  t.bgSurfaceHover,
    'bg-surface-alt':    t.bgSurfaceAlt,
    'accent':            t.accent,
    'accent-hover':      t.accentHover,
    'accent-text':       t.accentText,
    'accent-subtle':     t.accentSubtle,
    'text-primary':      t.textPrimary,
    'text-secondary':    t.textSecondary,
    'text-muted':        t.textMuted,
    'border-default':    t.borderDefault,
    'border-subtle':     t.borderSubtle,
    'font-display':      t.fontDisplay,
    'font-body':         t.fontBody,
    'radius-sm':         t.radiusSm,
    'radius-md':         t.radiusMd,
    'radius-lg':         t.radiusLg,
    'radius-xl':         t.radiusXl,
    'section-py':        t.sectionPy,
    'hero-py':           t.heroPy,
    'container-px':      t.containerPx,
    'cta-bg':            t.ctaBg,
    'cta-color':         t.ctaColor,
    'cta-border':        t.ctaBorder,
    'transition-base':   t.transitionBase,
    'transition-fast':   t.transitionFast,
  };
}
