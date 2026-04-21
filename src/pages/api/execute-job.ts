import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import {
  createDeployment,
  createDeploymentSnapshot,
  createJobStep,
  createPageDraftVersion,
  createServiceDraftVersion,
  createSystemLog,
  getAllClientLocations,
  getAllClientServices,
  getClientById,
  getClientLocations,
  getClientPages,
  getClientSiteConfig,
  getDesignProfileByClientId,
  getSectionVariantMapForClient,
  triggerVercelDeploy,
  updateJobStatus,
} from '../../lib/client-data';
import {
  generateAboutContent,
  generateHomeContent,
  generateServiceContent,
} from '../../lib/ai-content';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const jobId = String(body.jobId ?? '');

    if (!jobId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Brak jobId' }),
        { status: 400 }
      );
    }

    // Pobierz job z bazy
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Nie znaleziono joba' }),
        { status: 404 }
      );
    }

    const clientId = String(job.client_id);

    await updateJobStatus(jobId, 'running', 10);

    // ── instant_rebuild: snapshot + deploy, bez AI ─────────────────────────
    if (job.job_type === 'instant_rebuild') {
      await updateJobStatus(jobId, 'running', 25);

      const [client, siteConfig, services, pages, locations, designProfile, sectionVariants] =
        await Promise.all([
          getClientById(clientId),
          getClientSiteConfig(clientId),
          getAllClientServices(clientId),
          getClientPages(clientId),
          getClientLocations(clientId),
          getDesignProfileByClientId(clientId),
          getSectionVariantMapForClient(clientId),
        ]);

      const snapshotJson = {
        client,
        siteConfig,
        services,
        pages,
        locations,
        designProfile,
        sectionVariants,
        created_at: new Date().toISOString(),
      };

      await updateJobStatus(jobId, 'running', 40);

      const snapshot = await createDeploymentSnapshot({
        client_id: clientId,
        template_version: siteConfig.template_version ?? 'v1',
        snapshot_json: snapshotJson,
      });

      await createJobStep({
        job_id: jobId,
        step_name: 'snapshot_created',
        status: 'completed',
        output_json: { snapshot_id: snapshot.id },
      });

      await updateJobStatus(jobId, 'running', 60);

      const deployment = await createDeployment({
        client_id: clientId,
        snapshot_id: snapshot.id,
        type: 'publish',
        status: 'queued',
        deploy_url: null,
      });

      await updateJobStatus(jobId, 'running', 75);

      const triggerResult = await triggerVercelDeploy({
        mode: 'publish',
        deploymentId: deployment.id,
        clientId,
      });

      if (!triggerResult.ok) {
        await updateJobStatus(jobId, 'failed', 0);

        await createSystemLog({
          client_id: clientId,
          log_type: 'instant_rebuild_failed',
          message: 'Instant rebuild nie udał się — trigger Vercel zwrócił błąd',
          payload_json: {
            job_id: jobId,
            deployment_id: deployment.id,
            vercel_status: triggerResult.status,
            vercel_body: triggerResult.body,
          },
        });

        return new Response(
          JSON.stringify({
            ok: false,
            error: 'Deploy trigger failed',
            vercel_status: triggerResult.status,
          }),
          { status: 500 }
        );
      }

      await createJobStep({
        job_id: jobId,
        step_name: 'deploy_triggered',
        status: 'completed',
        output_json: { deployment_id: deployment.id },
      });

      await updateJobStatus(jobId, 'completed', 100);

      await createSystemLog({
        client_id: clientId,
        log_type: 'instant_rebuild_completed',
        message: 'Instant rebuild zakończony — snapshot + deploy triggered',
        payload_json: {
          job_id: jobId,
          snapshot_id: snapshot.id,
          deployment_id: deployment.id,
        },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          jobId,
          snapshotId: snapshot.id,
          deploymentId: deployment.id,
        }),
        { status: 200 }
      );
    }

    // ── Pomocnicze dane klienta (współdzielone przez content_edit handlery) ───
    async function buildBaseInput() {
      const [cl, sc, svcs, locs] = await Promise.all([
        getClientById(clientId),
        getClientSiteConfig(clientId),
        getAllClientServices(clientId),
        getAllClientLocations(clientId),
      ]);
      return {
        client: cl,
        siteConfig: sc,
        services: svcs,
        input: {
          company_name: cl.company_name,
          industry: cl.industry ?? 'usługi',
          city: sc.city ?? '',
          phone: sc.phone,
          email: sc.email,
          template_family: sc.template_family,
          services: svcs.map((s: { name: string }) => s.name),
          locations: locs.map((l: { city: string }) => l.city),
        },
      };
    }

    // ── rewrite_section / add_faq: wygeneruj drafty usług przez AI ────────────
    if (job.job_type === 'rewrite_section' || job.job_type === 'add_faq') {
      await updateJobStatus(jobId, 'running', 15);

      const { input, services } = await buildBaseInput();
      const targetServiceId = String(job.payload_json?.service_id ?? '');
      const targetServices = targetServiceId
        ? services.filter((s: { id: string }) => s.id === targetServiceId)
        : services;

      if (targetServices.length === 0) {
        await updateJobStatus(jobId, 'failed', 0);
        return new Response(
          JSON.stringify({ ok: false, error: 'Brak usług do wygenerowania' }),
          { status: 400 }
        );
      }

      const progressStep = Math.floor(70 / targetServices.length);
      let progress = 20;

      for (const svc of targetServices) {
        const content = await generateServiceContent({
          ...input,
          service_name: svc.name,
          service_slug: svc.slug,
        });

        const draft = await createServiceDraftVersion({
          service_id: svc.id,
          full_description: content.full_description,
          metadata: {
            meta_title: content.meta_title,
            meta_description: content.meta_description,
            h1: content.h1,
            faq: content.faq,
            key_facts: content.key_facts,
            query_variants: content.query_variants,
            generated_by: 'execute-job-worker',
            model: 'anthropic/claude-sonnet-4-5',
          },
          source: 'ai_worker',
        });

        await createJobStep({
          job_id: jobId,
          step_name: `draft_created_${svc.slug}`,
          status: 'completed',
          output_json: { service_id: svc.id, version_id: draft.id, service_name: svc.name },
        });

        progress = Math.min(progress + progressStep, 90);
        await updateJobStatus(jobId, 'running', progress);
      }

      await updateJobStatus(jobId, 'completed', 100);

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_content_generated',
        message: `AI wygenerował drafty dla ${targetServices.length} usług (job: ${job.job_type})`,
        payload_json: { job_id: jobId, services_count: targetServices.length, target_service_id: targetServiceId || null },
      });

      return new Response(
        JSON.stringify({ ok: true, jobId, draftsCreated: targetServices.length }),
        { status: 200 }
      );
    }

    // ── rewrite_about: wygeneruj draft strony O nas ────────────────────────────
    if (job.job_type === 'rewrite_about') {
      await updateJobStatus(jobId, 'running', 20);

      const { input } = await buildBaseInput();
      const pages = await getClientPages(clientId);
      const aboutPage = pages.find((p: { slug: string }) => p.slug === 'about' || p.slug === 'o-nas');

      if (!aboutPage) {
        await updateJobStatus(jobId, 'failed', 0);
        return new Response(
          JSON.stringify({ ok: false, error: 'Brak strony about/o-nas w bazie' }),
          { status: 400 }
        );
      }

      await updateJobStatus(jobId, 'running', 50);

      const content = await generateAboutContent(input);
      const bodyMarkdown = content.body_paragraphs.join('\n\n');

      const draft = await createPageDraftVersion({
        page_id: aboutPage.id,
        body_markdown: bodyMarkdown,
        metadata: {
          meta_title: content.meta_title,
          meta_description: content.meta_description,
          h1: content.h1,
          credentials: content.credentials,
          generated_by: 'execute-job-worker',
        },
        source: 'ai_worker',
      });

      await createJobStep({
        job_id: jobId,
        step_name: 'about_draft_created',
        status: 'completed',
        output_json: { page_id: aboutPage.id, version_id: draft.id },
      });

      await updateJobStatus(jobId, 'completed', 100);

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_content_generated',
        message: 'AI wygenerował draft strony O nas',
        payload_json: { job_id: jobId, page_id: aboutPage.id, version_id: draft.id },
      });

      return new Response(
        JSON.stringify({ ok: true, jobId, pageId: aboutPage.id, versionId: draft.id }),
        { status: 200 }
      );
    }

    // ── rewrite_contact: wygeneruj draft strony Kontakt ────────────────────────
    if (job.job_type === 'rewrite_contact') {
      await updateJobStatus(jobId, 'running', 20);

      const { input } = await buildBaseInput();
      const pages = await getClientPages(clientId);
      const contactPage = pages.find(
        (p: { slug: string }) => p.slug === 'contact' || p.slug === 'kontakt'
      );

      if (!contactPage) {
        await updateJobStatus(jobId, 'failed', 0);
        return new Response(
          JSON.stringify({ ok: false, error: 'Brak strony contact/kontakt w bazie' }),
          { status: 400 }
        );
      }

      await updateJobStatus(jobId, 'running', 50);

      // Generujemy treść home jako bazę dla CTA/opisu kontaktu
      const content = await generateHomeContent(input);
      const bodyMarkdown = `## Kontakt\n\n${content.hero_subtitle}\n\n${content.about_short}`;

      const draft = await createPageDraftVersion({
        page_id: contactPage.id,
        body_markdown: bodyMarkdown,
        metadata: {
          meta_title: content.meta_title,
          meta_description: content.meta_description,
          cta_primary: content.cta_primary,
          generated_by: 'execute-job-worker',
        },
        source: 'ai_worker',
      });

      await createJobStep({
        job_id: jobId,
        step_name: 'contact_draft_created',
        status: 'completed',
        output_json: { page_id: contactPage.id, version_id: draft.id },
      });

      await updateJobStatus(jobId, 'completed', 100);

      await createSystemLog({
        client_id: clientId,
        log_type: 'ai_content_generated',
        message: 'AI wygenerował draft strony Kontakt',
        payload_json: { job_id: jobId, page_id: contactPage.id, version_id: draft.id },
      });

      return new Response(
        JSON.stringify({ ok: true, jobId, pageId: contactPage.id, versionId: draft.id }),
        { status: 200 }
      );
    }

    // ── Fallback: inne typy jobów — oznacz jako wykonane ręcznie ─────────────
    await createJobStep({
      job_id: jobId,
      step_name: 'manual_step',
      status: 'completed',
      output_json: {
        note: `Job typu ${job.job_type} wykonany ręcznie przez operatora`,
      },
    });

    await updateJobStatus(jobId, 'completed', 100);

    await createSystemLog({
      client_id: clientId,
      log_type: 'job_completed_manually',
      message: `Job ${job.job_type} oznaczony jako wykonany ręcznie`,
      payload_json: { job_id: jobId, job_type: job.job_type },
    });

    return new Response(
      JSON.stringify({ ok: true, jobId, note: 'Wykonano ręcznie' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd',
      }),
      { status: 500 }
    );
  }
};
