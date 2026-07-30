#!/usr/bin/env npx tsx
/**
 * Local VFX Studio worker — Meshy proxy, mock demo mode, job status placeholder.
 * Location: tools/vfx-worker/server.ts
 *
 * Local authoring only. MESHY_API_KEY must never reach the Vite client.
 */
import http from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getBatchJob, runBatchRender } from './batchRender';

const DEFAULT_PORT = 8787;
const MESHY_BASE = 'https://api.meshy.ai/openapi/v2/text-to-3d';
const MOCK_GLB_URL = '/vfx/mock/demo-technique.glb';

const MISSING_KEY_ERROR =
  'MESHY_API_KEY missing — set in local .env or use VFX_WORKER_MOCK=1 for offline demo';

interface MockTask {
  prompt: string;
  createdAt: number;
}

const mockTasks = new Map<string, MockTask>();

function portFromEnv(): number {
  const raw = process.env.VFX_WORKER_PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid VFX_WORKER_PORT: ${raw}`);
  }
  return parsed;
}

function isMockMode(): boolean {
  return process.env.VFX_WORKER_MOCK === '1';
}

function meshyApiKey(): string | null {
  const key = process.env.MESHY_API_KEY?.trim();
  return key ? key : null;
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parsePath(url: string | undefined): { pathname: string; searchParams: URLSearchParams } {
  const parsed = new URL(url ?? '/', 'http://localhost');
  return { pathname: parsed.pathname, searchParams: parsed.searchParams };
}

function meshyKeyGuard(res: ServerResponse): string | null {
  if (isMockMode()) return 'mock-key';
  const key = meshyApiKey();
  if (!key) {
    sendJson(res, 503, { ok: false, error: MISSING_KEY_ERROR });
    return null;
  }
  return key;
}

function parseJsonBody(raw: string): Record<string, unknown> {
  if (!raw.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* fall through */
  }
  return {};
}

function createMockTaskId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mockTaskStatus(taskId: string): Record<string, unknown> {
  const task = mockTasks.get(taskId);
  if (!task) {
    return { status: 'FAILED', error: 'Unknown mock task id' };
  }
  const elapsed = Date.now() - task.createdAt;
  if (elapsed < 800) {
    return { status: 'PENDING', progress: 10, mock: true };
  }
  if (elapsed < 1600) {
    return { status: 'IN_PROGRESS', progress: 55, mock: true };
  }
  return {
    status: 'SUCCEEDED',
    progress: 100,
    mock: true,
    model_urls: { glb: MOCK_GLB_URL },
    glbUrl: MOCK_GLB_URL,
  };
}

async function handleHealth(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  sendJson(res, 200, {
    ok: true,
    mock: isMockMode(),
    meshyKeyConfigured: Boolean(meshyApiKey()) || isMockMode(),
  });
}

async function handleMeshyTextTo3d(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const key = meshyKeyGuard(res);
  if (!key) return;

  const bodyRaw = await readBody(req);
  const body = parseJsonBody(bodyRaw);
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    sendJson(res, 400, { ok: false, error: 'prompt is required' });
    return;
  }

  if (isMockMode()) {
    const taskId = createMockTaskId();
    mockTasks.set(taskId, { prompt, createdAt: Date.now() });
    sendJson(res, 200, {
      ok: true,
      mock: true,
      taskId,
      message: `Mock text-to-3d queued — demo GLB at ${MOCK_GLB_URL}`,
    });
    return;
  }

  try {
    const meshyRes = await fetch(MESHY_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: typeof body.mode === 'string' ? body.mode : 'preview',
        prompt,
        art_style: typeof body.art_style === 'string' ? body.art_style : 'sculpture',
      }),
    });

    const meshyBody: unknown = await meshyRes.json().catch(() => ({}));
    const record =
      meshyBody !== null && typeof meshyBody === 'object' && !Array.isArray(meshyBody)
        ? (meshyBody as Record<string, unknown>)
        : {};

    const taskIdRaw = record.result ?? record.task_id ?? record.id;
    const taskId = typeof taskIdRaw === 'string' ? taskIdRaw : null;

    if (!meshyRes.ok || !taskId) {
      const error =
        typeof record.message === 'string'
          ? record.message
          : typeof record.error === 'string'
            ? record.error
            : 'Meshy text-to-3d request failed';
      sendJson(res, meshyRes.ok ? 502 : meshyRes.status, { ok: false, error, meshy: record });
      return;
    }

    sendJson(res, 200, { ok: true, taskId, meshy: record });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Meshy proxy request failed';
    sendJson(res, 502, { ok: false, error: message });
  }
}

async function handleMeshyTaskStatus(
  _req: IncomingMessage,
  res: ServerResponse,
  taskId: string,
): Promise<void> {
  const key = meshyKeyGuard(res);
  if (!key) return;

  if (!/^[a-zA-Z0-9-]{1,128}$/.test(taskId)) {
    sendJson(res, 400, { ok: false, error: 'Invalid Meshy task id' });
    return;
  }

  if (isMockMode() || taskId.startsWith('mock-')) {
    sendJson(res, 200, {
      ok: true,
      mock: true,
      meshy: mockTaskStatus(taskId),
    });
    return;
  }

  try {
    const meshyRes = await fetch(`${MESHY_BASE}/${taskId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const meshyBody: unknown = await meshyRes.json().catch(() => ({}));
    const record =
      meshyBody !== null && typeof meshyBody === 'object' && !Array.isArray(meshyBody)
        ? (meshyBody as Record<string, unknown>)
        : { raw: meshyBody };
    sendJson(res, meshyRes.ok ? 200 : meshyRes.status, { ok: meshyRes.ok, meshy: record });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Meshy proxy request failed';
    sendJson(res, 502, { ok: false, error: message });
  }
}

async function handleBatchRender(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const bodyRaw = await readBody(req);
  const body = parseJsonBody(bodyRaw);
  const recipeId = typeof body.recipeId === 'string' ? body.recipeId : '';
  const presetId = typeof body.presetId === 'string' ? body.presetId : undefined;
  const previewBaseUrl =
    typeof body.previewBaseUrl === 'string' ? body.previewBaseUrl : undefined;

  if (!recipeId.trim()) {
    sendJson(res, 400, { ok: false, error: 'recipeId is required' });
    return;
  }

  const result = await runBatchRender({ recipeId, presetId, previewBaseUrl });
  const status = result.ok ? 200 : 422;
  sendJson(res, status, {
    ok: result.ok,
    jobId: result.job.id,
    status: result.job.status,
    method: result.job.method,
    error: result.job.error,
    renderOutput: result.job.renderOutput,
    pngUrl: result.job.pngPath,
    metadataUrl: result.job.metadataPath,
  });
}

function handleBatchJobStatus(_req: IncomingMessage, res: ServerResponse, jobId: string): void {
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(jobId)) {
    sendJson(res, 400, { ok: false, error: 'Invalid batch job id' });
    return;
  }

  const job = getBatchJob(jobId);
  if (!job) {
    sendJson(res, 404, { ok: false, error: 'Batch job not found' });
    return;
  }

  sendJson(res, 200, {
    ok: job.status === 'SUCCEEDED',
    jobId: job.id,
    status: job.status,
    method: job.method,
    error: job.error,
    renderOutput: job.renderOutput,
    pngUrl: job.pngPath,
    metadataUrl: job.metadataPath,
  });
}

function handleJobStatus(_req: IncomingMessage, res: ServerResponse, jobId: string): void {
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(jobId)) {
    sendJson(res, 400, { ok: false, error: 'Invalid job id' });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    stub: true,
    id: jobId,
    status: 'unknown',
    message: 'Local job tracking not implemented yet',
  });
}

function handleOptions(_req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end();
}

function handleNotFound(res: ServerResponse): void {
  sendJson(res, 404, { ok: false, error: 'Not found' });
}

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const { pathname } = parsePath(req.url);
  const method = req.method ?? 'GET';

  if (method === 'OPTIONS') {
    handleOptions(req, res);
    return;
  }

  if (method === 'GET' && pathname === '/health') {
    await handleHealth(req, res);
    return;
  }

  if (method === 'POST' && pathname === '/meshy/text-to-3d') {
    await handleMeshyTextTo3d(req, res);
    return;
  }

  const meshyTaskMatch = pathname.match(/^\/meshy\/tasks\/([^/]+)$/);
  if (method === 'GET' && meshyTaskMatch) {
    await handleMeshyTaskStatus(req, res, meshyTaskMatch[1]);
    return;
  }

  if (method === 'POST' && pathname === '/batch/render') {
    await handleBatchRender(req, res);
    return;
  }

  const batchJobMatch = pathname.match(/^\/batch\/jobs\/([^/]+)$/);
  if (method === 'GET' && batchJobMatch) {
    handleBatchJobStatus(req, res, batchJobMatch[1]);
    return;
  }

  const jobMatch = pathname.match(/^\/jobs\/([^/]+)$/);
  if (method === 'GET' && jobMatch) {
    handleJobStatus(req, res, jobMatch[1]);
    return;
  }

  handleNotFound(res);
}

function main(): void {
  const port = portFromEnv();
  const server = http.createServer((req, res) => {
    route(req, res).catch((err) => {
      const message = err instanceof Error ? err.message : 'Internal server error';
      if (!res.headersSent) {
        sendJson(res, 500, { ok: false, error: message });
      }
    });
  });

  server.listen(port, '127.0.0.1', () => {
    console.error(
      `[vfx-worker] listening on http://127.0.0.1:${port} (local authoring only)`,
    );
    if (isMockMode()) {
      console.error(
        `[vfx-worker] VFX_WORKER_MOCK=1 — Meshy routes return demo GLB at ${MOCK_GLB_URL}`,
      );
    } else if (!meshyApiKey()) {
      console.error('[vfx-worker] MESHY_API_KEY unset — /meshy/* routes will return 503');
    }
  });
}

main();
