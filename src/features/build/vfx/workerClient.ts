/**
 * HTTP client for local vfx-worker (Meshy proxy, health).
 * Location: src/features/build/vfx/workerClient.ts
 *
 * MESHY_API_KEY must never reach this module's consumers via Vite env —
 * all Meshy calls go through the worker on 127.0.0.1:8787.
 */
import { assertObject } from './types/parseHelpers';

export const VFX_WORKER_DEFAULT_URL = 'http://127.0.0.1:8787';
export const MESHY_PREVIEW_CREDITS_ESTIMATE = 5;

export type VfxWorkerErrorCode = 'WORKER_DOWN' | 'API_ERROR' | 'INVALID_RESPONSE';

export class VfxWorkerError extends Error {
  readonly code: VfxWorkerErrorCode;

  constructor(message: string, code: VfxWorkerErrorCode) {
    super(message);
    this.name = 'VfxWorkerError';
    this.code = code;
  }
}

export type MeshyPollStatus = 'pending' | 'in_progress' | 'succeeded' | 'failed';

export interface MeshyTaskPollResult {
  status: MeshyPollStatus;
  progress: number;
  glbUrl: string | null;
  error: string | null;
  mock: boolean;
}

export interface MeshyCreateTaskResult {
  taskId: string;
  mock: boolean;
}

function workerBaseUrl(baseUrl?: string): string {
  const url = baseUrl?.trim() || VFX_WORKER_DEFAULT_URL;
  return url.replace(/\/$/, '');
}

async function workerFetch(
  path: string,
  init?: RequestInit,
  baseUrl?: string,
): Promise<Response> {
  const url = `${workerBaseUrl(baseUrl)}${path}`;
  try {
    return await fetch(url, init);
  } catch {
    throw new VfxWorkerError(
      'VFX-Worker nicht erreichbar — bitte npm run vfx-worker starten.',
      'WORKER_DOWN',
    );
  }
}

/** Returns true when GET /health responds with ok:true. */
export async function checkVfxWorkerHealth(baseUrl?: string): Promise<boolean> {
  try {
    const res = await workerFetch('/health', undefined, baseUrl);
    if (!res.ok) return false;
    const body: unknown = await res.json().catch(() => null);
    const record = body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : null;
    return record?.ok === true;
  } catch (err) {
    if (err instanceof VfxWorkerError && err.code === 'WORKER_DOWN') return false;
    return false;
  }
}

function parseCreateTaskBody(body: unknown): MeshyCreateTaskResult {
  const record = assertObject(body, 'MeshyCreateResponse');
  const taskIdRaw = record.taskId ?? record.task_id ?? record.id;
  if (typeof taskIdRaw !== 'string' || taskIdRaw.trim().length === 0) {
    throw new VfxWorkerError('Ungültige Worker-Antwort (keine Task-ID).', 'INVALID_RESPONSE');
  }
  return {
    taskId: taskIdRaw,
    mock: record.mock === true,
  };
}

/** Start Meshy text-to-3d preview via local worker. */
export async function createMeshyTextTo3d(
  prompt: string,
  baseUrl?: string,
): Promise<MeshyCreateTaskResult> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new VfxWorkerError('Prompt darf nicht leer sein.', 'API_ERROR');
  }

  const res = await workerFetch(
    '/meshy/text-to-3d',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed, mode: 'preview' }),
    },
    baseUrl,
  );

  const body: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const record =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const message =
      typeof record.error === 'string'
        ? record.error
        : 'Meshy-Anfrage fehlgeschlagen.';
    throw new VfxWorkerError(message, 'API_ERROR');
  }

  return parseCreateTaskBody(body);
}

function meshyStatusToPoll(raw: unknown): MeshyPollStatus {
  if (typeof raw !== 'string') return 'pending';
  const normalized = raw.toUpperCase();
  if (normalized === 'SUCCEEDED' || normalized === 'SUCCESS') return 'succeeded';
  if (normalized === 'FAILED' || normalized === 'EXPIRED' || normalized === 'CANCELED') {
    return 'failed';
  }
  if (normalized === 'IN_PROGRESS' || normalized === 'PROCESSING') return 'in_progress';
  if (normalized === 'PENDING' || normalized === 'QUEUED') return 'pending';
  return 'pending';
}

function extractGlbUrl(record: Record<string, unknown>): string | null {
  const modelUrls = record.model_urls;
  if (modelUrls !== null && typeof modelUrls === 'object' && !Array.isArray(modelUrls)) {
    const glb = (modelUrls as Record<string, unknown>).glb;
    if (typeof glb === 'string' && glb.trim().length > 0) return glb;
  }
  const glbUrl = record.glbUrl ?? record.glb_url;
  if (typeof glbUrl === 'string' && glbUrl.trim().length > 0) return glbUrl;

  const meshy = record.meshy;
  if (meshy !== null && typeof meshy === 'object' && !Array.isArray(meshy)) {
    return extractGlbUrl(meshy as Record<string, unknown>);
  }
  return null;
}

/** Normalize worker Meshy task poll JSON into a stable client shape. */
export function normalizeMeshyTaskResponse(body: unknown): MeshyTaskPollResult {
  const record = assertObject(body, 'MeshyTaskResponse');
  const meshyRaw = record.meshy;
  const meshyRecord =
    meshyRaw !== null && typeof meshyRaw === 'object' && !Array.isArray(meshyRaw)
      ? (meshyRaw as Record<string, unknown>)
      : record;

  const status = meshyStatusToPoll(meshyRecord.status ?? record.status);
  const progressRaw = meshyRecord.progress ?? record.progress;
  const progress =
    typeof progressRaw === 'number' && Number.isFinite(progressRaw)
      ? Math.min(100, Math.max(0, Math.round(progressRaw)))
      : status === 'succeeded'
        ? 100
        : 0;

  const errorRaw = meshyRecord.error ?? meshyRecord.message ?? record.error;
  const error = typeof errorRaw === 'string' && errorRaw.trim().length > 0 ? errorRaw : null;

  return {
    status,
    progress,
    glbUrl: extractGlbUrl(meshyRecord) ?? extractGlbUrl(record),
    error,
    mock: record.mock === true || meshyRecord.mock === true,
  };
}

/** Poll Meshy task status via local worker. */
export async function getMeshyTaskStatus(
  taskId: string,
  baseUrl?: string,
): Promise<MeshyTaskPollResult> {
  const trimmed = taskId.trim();
  if (!trimmed) {
    throw new VfxWorkerError('Task-ID fehlt.', 'API_ERROR');
  }

  const res = await workerFetch(`/meshy/tasks/${encodeURIComponent(trimmed)}`, undefined, baseUrl);
  const body: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const record =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const message =
      typeof record.error === 'string'
        ? record.error
        : 'Meshy-Status konnte nicht geladen werden.';
    throw new VfxWorkerError(message, 'API_ERROR');
  }

  return normalizeMeshyTaskResponse(body);
}

/** Poll until succeeded/failed or timeoutMs elapsed. */
export async function pollMeshyTaskUntilDone(
  taskId: string,
  options?: { baseUrl?: string; intervalMs?: number; timeoutMs?: number },
): Promise<MeshyTaskPollResult> {
  const intervalMs = options?.intervalMs ?? 1200;
  const timeoutMs = options?.timeoutMs ?? 120_000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const result = await getMeshyTaskStatus(taskId, options?.baseUrl);
    if (result.status === 'succeeded' || result.status === 'failed') {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return {
    status: 'failed',
    progress: 0,
    glbUrl: null,
    error: 'Zeitüberschreitung bei Meshy-Generierung.',
    mock: false,
  };
}

export type BatchRenderClientStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';

export interface BatchRenderClientResult {
  jobId: string;
  status: BatchRenderClientStatus;
  method: 'playwright' | 'placeholder' | null;
  error: string | null;
  pngUrl: string | null;
  metadataUrl: string | null;
  renderOutput: {
    kind: 'renderOutput';
    id: string;
    url: string;
    format: 'png';
    width: number;
    height: number;
    capturedAt: string;
  } | null;
}

function batchStatusFromWorker(raw: unknown): BatchRenderClientStatus {
  if (typeof raw !== 'string') return 'FAILED';
  const normalized = raw.toUpperCase();
  if (normalized === 'SUCCEEDED') return 'SUCCEEDED';
  if (normalized === 'FAILED') return 'FAILED';
  if (normalized === 'IN_PROGRESS') return 'IN_PROGRESS';
  if (normalized === 'PENDING') return 'PENDING';
  return 'FAILED';
}

function parseBatchRenderBody(body: unknown): BatchRenderClientResult {
  const record = assertObject(body, 'BatchRenderResponse');
  const jobIdRaw = record.jobId ?? record.id;
  const jobId = typeof jobIdRaw === 'string' ? jobIdRaw : '';

  const renderOutputRaw = record.renderOutput;
  let renderOutput: BatchRenderClientResult['renderOutput'] = null;
  if (renderOutputRaw !== null && typeof renderOutputRaw === 'object' && !Array.isArray(renderOutputRaw)) {
    const ro = renderOutputRaw as Record<string, unknown>;
    const url = ro.url;
    const id = ro.id;
    const width = ro.width;
    const height = ro.height;
    const capturedAt = ro.capturedAt;
    if (
      typeof url === 'string' &&
      typeof id === 'string' &&
      typeof width === 'number' &&
      typeof height === 'number' &&
      typeof capturedAt === 'string'
    ) {
      renderOutput = {
        kind: 'renderOutput',
        id,
        url,
        format: 'png',
        width,
        height,
        capturedAt,
      };
    }
  }

  const pngUrlRaw = record.pngUrl ?? renderOutput?.url ?? null;
  const metadataUrlRaw = record.metadataUrl ?? null;
  const errorRaw = record.error;

  return {
    jobId,
    status: batchStatusFromWorker(record.status),
    method:
      record.method === 'playwright' || record.method === 'placeholder'
        ? record.method
        : null,
    error: typeof errorRaw === 'string' && errorRaw.trim().length > 0 ? errorRaw : null,
    pngUrl: typeof pngUrlRaw === 'string' ? pngUrlRaw : null,
    metadataUrl: typeof metadataUrlRaw === 'string' ? metadataUrlRaw : null,
    renderOutput,
  };
}

/** Render one formula hero frame via local vfx-worker batch endpoint. */
export async function renderBatchHeroFrame(
  recipeId: string,
  options?: { presetId?: string; previewBaseUrl?: string; baseUrl?: string },
): Promise<BatchRenderClientResult> {
  const trimmed = recipeId.trim();
  if (!trimmed) {
    throw new VfxWorkerError('Rezept-ID fehlt.', 'API_ERROR');
  }

  const res = await workerFetch(
    '/batch/render',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId: trimmed,
        presetId: options?.presetId,
        previewBaseUrl: options?.previewBaseUrl,
      }),
    },
    options?.baseUrl,
  );

  const body: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const record =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const message =
      typeof record.error === 'string'
        ? record.error
        : 'Batch-Render fehlgeschlagen.';
    throw new VfxWorkerError(message, 'API_ERROR');
  }

  return parseBatchRenderBody(body);
}

/** Poll batch job status from worker (after async jobs). */
export async function getBatchJobStatus(
  jobId: string,
  baseUrl?: string,
): Promise<BatchRenderClientResult> {
  const trimmed = jobId.trim();
  if (!trimmed) {
    throw new VfxWorkerError('Job-ID fehlt.', 'API_ERROR');
  }

  const res = await workerFetch(`/batch/jobs/${encodeURIComponent(trimmed)}`, undefined, baseUrl);
  const body: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const record =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const message =
      typeof record.error === 'string'
        ? record.error
        : 'Batch-Job-Status konnte nicht geladen werden.';
    throw new VfxWorkerError(message, 'API_ERROR');
  }

  return parseBatchRenderBody(body);
}
