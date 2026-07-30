#!/usr/bin/env npx tsx
/**
 * Local VFX Studio worker — Meshy proxy stub, job status placeholder.
 * Location: tools/vfx-worker/server.ts
 *
 * Local authoring only. MESHY_API_KEY must never reach the Vite client.
 */
import http from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_PORT = 8787;
const MESHY_BASE = 'https://api.meshy.ai/openapi/v2/text-to-3d';

const MISSING_KEY_ERROR =
  'MESHY_API_KEY missing — set in local .env (never in Vite client or browser bundles)';

function portFromEnv(): number {
  const raw = process.env.VFX_WORKER_PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid VFX_WORKER_PORT: ${raw}`);
  }
  return parsed;
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
  const key = meshyApiKey();
  if (!key) {
    sendJson(res, 503, { ok: false, error: MISSING_KEY_ERROR });
    return null;
  }
  return key;
}

async function handleHealth(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  sendJson(res, 200, { ok: true });
}

async function handleMeshyTextTo3d(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const key = meshyKeyGuard(res);
  if (!key) return;

  await readBody(req);

  sendJson(res, 501, {
    ok: false,
    stub: true,
    error: 'Meshy text-to-3d not implemented yet — proxy skeleton only (#256)',
  });
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

  try {
    const meshyRes = await fetch(`${MESHY_BASE}/${taskId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const body: unknown = await meshyRes.json().catch(() => ({}));
    const record =
      typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : { raw: body };
    sendJson(res, meshyRes.status, { ok: meshyRes.ok, stub: true, meshy: record });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Meshy proxy request failed';
    sendJson(res, 502, { ok: false, error: message });
  }
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
    if (!meshyApiKey()) {
      console.error('[vfx-worker] MESHY_API_KEY unset — /meshy/* routes will return 503');
    }
  });
}

main();
