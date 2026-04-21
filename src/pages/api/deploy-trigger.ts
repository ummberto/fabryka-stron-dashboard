import type { APIRoute } from 'astro';
import {
  createSystemLog,
  triggerVercelDeploy,
  updateDeploymentStatus,
} from '../../lib/client-data';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const deploymentId = String(body.deploymentId ?? '');
    const clientId = String(body.clientId ?? '');
    const mode = String(body.mode ?? 'preview') as 'preview' | 'publish';

    if (!deploymentId || !clientId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Brak deploymentId lub clientId' }),
        { status: 400 }
      );
    }

    await updateDeploymentStatus(deploymentId, 'building');

    await createSystemLog({
      client_id: clientId,
      log_type: 'deploy_trigger_started',
      message: `Rozpoczęto trigger deploy typu ${mode}`,
      payload_json: {
        deployment_id: deploymentId,
        mode,
      },
    });

    const result = await triggerVercelDeploy({
      mode,
      deploymentId,
      clientId,
    });

    if (!result.ok) {
      await updateDeploymentStatus(deploymentId, 'failed');

      await createSystemLog({
        client_id: clientId,
        log_type: 'deploy_trigger_failed',
        message: `Trigger deploy typu ${mode} zakończył się błędem`,
        payload_json: {
          deployment_id: deploymentId,
          mode,
          status: result.status,
          body: result.body,
        },
      });

      return new Response(
        JSON.stringify({
          ok: false,
          deploymentId,
          mode,
          status: result.status,
          body: result.body,
        }),
        { status: 500 }
      );
    }

    await updateDeploymentStatus(
      deploymentId,
      mode === 'preview' ? 'preview_ready' : 'published'
    );

    await createSystemLog({
      client_id: clientId,
      log_type: 'deploy_trigger_completed',
      message: `Trigger deploy typu ${mode} zakończył się sukcesem`,
      payload_json: {
        deployment_id: deploymentId,
        mode,
        status: result.status,
        body: result.body,
      },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        deploymentId,
        mode,
        status: result.status,
        body: result.body,
      }),
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