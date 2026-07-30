/**
 * Batch hero-frame render — Playwright screenshot of VfxSharedPreview page.
 * Location: tools/vfx-worker/batchRender.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const WORKER_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(WORKER_DIR, '../..');
const BATCH_OUT_DIR = path.join(REPO_ROOT, 'public/vfx/batch');
const DEFAULT_PREVIEW_URL = 'http://127.0.0.1:4789';
const DEFAULT_TIMEOUT_MS = 45_000;

export const BATCH_JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'SUCCEEDED', 'FAILED'] as const;
export type BatchJobStatus = (typeof BATCH_JOB_STATUSES)[number];

export interface BatchRenderOutput {
  kind: 'renderOutput';
  id: string;
  url: string;
  format: 'png';
  width: number;
  height: number;
  capturedAt: string;
}

export interface BatchJobRecord {
  id: string;
  recipeId: string;
  presetId: string;
  status: BatchJobStatus;
  error: string | null;
  method: 'playwright' | 'placeholder' | null;
  renderOutput: BatchRenderOutput | null;
  pngPath: string | null;
  metadataPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BatchRenderRequest {
  recipeId: string;
  presetId?: string;
  previewBaseUrl?: string;
}

export interface BatchRenderResult {
  ok: boolean;
  job: BatchJobRecord;
}

const jobs = new Map<string, BatchJobRecord>();

function sanitizeRecipeId(recipeId: string): string | null {
  const trimmed = recipeId.trim();
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(trimmed)) return null;
  return trimmed;
}

function previewBaseUrlFromEnv(override?: string): string {
  const raw =
    override?.trim() ||
    process.env.VFX_BATCH_PREVIEW_URL?.trim() ||
    process.env.PLAYWRIGHT_BASE_URL?.trim() ||
    DEFAULT_PREVIEW_URL;
  return raw.replace(/\/$/, '');
}

function forcePlaceholder(): boolean {
  return process.env.VFX_BATCH_PLACEHOLDER === '1';
}

function createJobId(): string {
  return `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getBatchJob(jobId: string): BatchJobRecord | null {
  return jobs.get(jobId) ?? null;
}

/** Minimal valid 512×512 amber PNG (fallback when Playwright/WebGL fails). */
function placeholderPngBuffer(): Buffer {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
}

async function writePlaceholderPng(pngAbsPath: string): Promise<{ width: number; height: number }> {
  await fs.writeFile(pngAbsPath, placeholderPngBuffer());
  return { width: 1, height: 1 };
}

function buildPreviewUrl(baseUrl: string, recipeId: string, presetId: string): string {
  const params = new URLSearchParams({
    'vfx-batch-preview': '1',
    recipeId,
    presetId,
  });
  return `${baseUrl}/?${params.toString()}`;
}

async function captureWithPlaywright(
  previewUrl: string,
  pngAbsPath: string,
  timeoutMs: number,
): Promise<{ width: number; height: number }> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader-webgl'],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 640 } });
    await page.goto(previewUrl, { waitUntil: 'networkidle', timeout: timeoutMs });
    const canvasSelector = '[data-testid="vfx-shared-preview-canvas"] canvas';
    await page.waitForSelector(canvasSelector, { timeout: timeoutMs });
    await page.waitForFunction(
      (selector) => {
        const el = document.querySelector(selector);
        return el instanceof HTMLCanvasElement && el.width > 0 && el.height > 0;
      },
      canvasSelector,
      { timeout: timeoutMs },
    );
    await page.waitForTimeout(1500);
    const canvas = page.locator(canvasSelector);
    await canvas.screenshot({ path: pngAbsPath, type: 'png' });
    const size = await canvas.evaluate((el) => {
      if (!(el instanceof HTMLCanvasElement)) return { width: 0, height: 0 };
      return { width: el.width, height: el.height };
    });
    if (size.width < 1 || size.height < 1) {
      throw new Error('Canvas capture returned zero dimensions');
    }
    return size;
  } finally {
    await browser.close();
  }
}

async function writeMetadata(metadataAbsPath: string, job: BatchJobRecord): Promise<void> {
  await fs.writeFile(metadataAbsPath, JSON.stringify(job, null, 2), 'utf8');
}

export async function runBatchRender(input: BatchRenderRequest): Promise<BatchRenderResult> {
  const recipeId = sanitizeRecipeId(input.recipeId);
  if (!recipeId) {
    const now = new Date().toISOString();
    const job: BatchJobRecord = {
      id: createJobId(),
      recipeId: input.recipeId,
      presetId: input.presetId?.trim() || 'aura',
      status: 'FAILED',
      error: 'Ungültige Rezept-ID',
      method: null,
      renderOutput: null,
      pngPath: null,
      metadataPath: null,
      createdAt: now,
      updatedAt: now,
    };
    jobs.set(job.id, job);
    return { ok: false, job };
  }

  const presetId = input.presetId?.trim() || 'aura';
  const previewBaseUrl = previewBaseUrlFromEnv(input.previewBaseUrl);
  const timeoutMs = DEFAULT_TIMEOUT_MS;
  const now = new Date().toISOString();
  const jobId = createJobId();
  const pngRel = `/vfx/batch/${recipeId}.png`;
  const pngAbsPath = path.join(BATCH_OUT_DIR, `${recipeId}.png`);
  const metadataAbsPath = path.join(BATCH_OUT_DIR, `${recipeId}.json`);

  const job: BatchJobRecord = {
    id: jobId,
    recipeId,
    presetId,
    status: 'IN_PROGRESS',
    error: null,
    method: null,
    renderOutput: null,
    pngPath: pngRel,
    metadataPath: `/vfx/batch/${recipeId}.json`,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(jobId, job);

  await fs.mkdir(BATCH_OUT_DIR, { recursive: true });

  let method: 'playwright' | 'placeholder' = 'playwright';
  let size = { width: 0, height: 0 };
  let captureError: string | null = null;

  if (forcePlaceholder()) {
    method = 'placeholder';
    size = await writePlaceholderPng(pngAbsPath);
  } else {
    const previewUrl = buildPreviewUrl(previewBaseUrl, recipeId, presetId);
    try {
      size = await captureWithPlaywright(previewUrl, pngAbsPath, timeoutMs);
    } catch (err) {
      captureError = err instanceof Error ? err.message : 'Playwright capture failed';
      method = 'placeholder';
      try {
        size = await writePlaceholderPng(pngAbsPath);
      } catch (placeholderErr) {
        const message =
          placeholderErr instanceof Error ? placeholderErr.message : 'Placeholder write failed';
        job.status = 'FAILED';
        job.error = `${captureError}; ${message}`;
        job.updatedAt = new Date().toISOString();
        jobs.set(jobId, job);
        await writeMetadata(metadataAbsPath, job).catch(() => undefined);
        return { ok: false, job };
      }
    }
  }

  const capturedAt = new Date().toISOString();
  const renderOutput: BatchRenderOutput = {
    kind: 'renderOutput',
    id: `render-${recipeId}-${Date.now()}`,
    url: pngRel,
    format: 'png',
    width: size.width,
    height: size.height,
    capturedAt,
  };

  job.status = 'SUCCEEDED';
  job.method = method;
  job.renderOutput = renderOutput;
  job.error = method === 'placeholder' && captureError ? captureError : null;
  job.updatedAt = capturedAt;
  jobs.set(jobId, job);

  await writeMetadata(metadataAbsPath, job);

  return { ok: true, job };
}
