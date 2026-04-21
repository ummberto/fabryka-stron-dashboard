import type { APIRoute } from 'astro';
import {
  generateAllClientContent,
  generateServiceContent,
  generateAboutContent,
  generateHomeContent,
  generateLocationContent,
} from '../../lib/ai-content';
import {
  createSystemLog,
  createServiceDraftVersion,
  createPageDraftVersion,
  getClientById,
  getClientSiteConfig,
  getAllClientServices,
  getClientPages,
  getAllClientLocations,
} from '../../lib/client-data';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, clientId } = body;

    if (!clientId) {
      return json({ ok: false, error: 'Brak clientId' }, 400);
    }

    // Pobierz dane klienta
    const [client, siteConfig, services, pages, locations] = await Promise.all([
      getClientById(clientId),
      getClientSiteConfig(clientId),
      getAllClientServices(clientId),
      getClientPages(clientId),
      getAllClientLocations(clientId),
    ]);

    const baseInput = {
      company_name: client.company_name,
      industry: client.industry ?? 'usługi',
      city: siteConfig.city ?? '',
      phone: siteConfig.phone,
      email: siteConfig.email,
      template_family: siteConfig.template_family,
      services: services.map((s) => s.name),
      locations: locations.map((l) => l.city),
    };

    // ── Generuj jedną usługę ─────────────────────────────────────────────────
    if (action === 'generate-service') {
      const { serviceId, serviceName, serviceSlug } = body;

      const content = await generateServiceContent({
        ...baseInput,
        service_name: serviceName,
        service_slug: serviceSlug,
      });

      // Zapisz jako draft version
      const draft = await createServiceDraftVersion({
        service_id: serviceId,
        full_description: content.full_description,
        metadata: {
          meta_title: content.meta_title,
          meta_description: content.meta_description,
          faq: content.faq,
          generated_by: 'openrouter',
          model: 'anthropic/claude-sonnet-4-5',
        },
      });

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_content_generated',
        message: `AI wygenerował treść usługi: ${serviceName}`,
        payload_json: { service_id: serviceId, version_id: draft.id, model: 'claude-sonnet-4-5' },
      });

      return json({ ok: true, version: draft, content });
    }

    // ── Generuj stronę (home/about/contact) ─────────────────────────────────
    if (action === 'generate-page') {
      const { pageId, pageSlug } = body;

      let content: { title?: string; body?: string; meta_title: string; meta_description: string };

      if (pageSlug === 'about') {
        const r = await generateAboutContent(baseInput);
        content = { title: r.title, body: r.body, meta_title: r.meta_title, meta_description: r.meta_description };
      } else {
        const r = await generateHomeContent(baseInput);
        content = {
          title: r.hero_title,
          body: `${r.hero_subtitle}\n\n${r.about_short}`,
          meta_title: r.meta_title,
          meta_description: r.meta_description,
        };
      }

      const draft = await createPageDraftVersion({
        page_id: pageId,
        body_markdown: content.body ?? '',
        metadata: {
          meta_title: content.meta_title,
          meta_description: content.meta_description,
          title: content.title,
          generated_by: 'openrouter',
        },
      });

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_content_generated',
        message: `AI wygenerował treść strony: ${pageSlug}`,
        payload_json: { page_id: pageId, version_id: draft.id },
      });

      return json({ ok: true, version: draft, content });
    }

    // ── Generuj wszystko naraz (bulk) ────────────────────────────────────────
    if (action === 'generate-all') {
      const result = await generateAllClientContent({
        input: baseInput,
        serviceNames: services.map((s) => s.name),
        serviceSlugs: services.map((s) => s.slug),
        locationCities: locations.map((l) => l.city),
        locationRegions: locations.map((l) => l.region ?? null),
      });

      const saved: Record<string, string> = {};

      // Zapisz home page
      const homePage = pages.find((p) => p.slug === 'home');
      if (homePage && result.home?.meta_title) {
        const d = await createPageDraftVersion({
          page_id: homePage.id,
          body_markdown: `${result.home.hero_subtitle}\n\n${result.home.about_short}`,
          metadata: {
            title: result.home.hero_title,
            meta_title: result.home.meta_title,
            meta_description: result.home.meta_description,
            generated_by: 'openrouter',
          },
        });
        saved['home'] = d.id;
      }

      // Zapisz about page
      const aboutPage = pages.find((p) => p.slug === 'about');
      if (aboutPage && result.about?.body) {
        const d = await createPageDraftVersion({
          page_id: aboutPage.id,
          body_markdown: result.about.body,
          metadata: {
            title: result.about.title,
            meta_title: result.about.meta_title,
            meta_description: result.about.meta_description,
            generated_by: 'openrouter',
          },
        });
        saved['about'] = d.id;
      }

      // Zapisz usługi
      for (const service of services) {
        const sc = result.services[service.slug];
        if (sc?.full_description) {
          const d = await createServiceDraftVersion({
            service_id: service.id,
            full_description: sc.full_description,
            metadata: {
              meta_title: sc.meta_title,
              meta_description: sc.meta_description,
              faq: sc.faq,
              generated_by: 'openrouter',
            },
          });
          saved[`service_${service.slug}`] = d.id;
        }
      }

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_bulk_generated',
        message: `AI bulk: wygenerowano treści dla ${Object.keys(saved).length} elementów`,
        payload_json: { saved, errors: result.errors },
      });

      return json({ ok: true, saved, errors: result.errors, result });
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
