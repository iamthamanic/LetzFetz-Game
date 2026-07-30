/**
 * Unit tests for vfx-worker HTTP client helpers.
 * Location: src/features/build/vfx/workerClient.test.ts
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  VfxWorkerError,
  createMeshyTextTo3d,
  normalizeMeshyTaskResponse,
  renderBatchHeroFrame,
} from './workerClient';

function parseCreateTaskBodyForTest(body: unknown) {
  const record =
    body !== null && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  const taskIdRaw = record.taskId ?? record.task_id ?? record.id;
  if (typeof taskIdRaw !== 'string' || taskIdRaw.trim().length === 0) {
    throw new VfxWorkerError('Ungültige Worker-Antwort (keine Task-ID).', 'INVALID_RESPONSE');
  }
  return { taskId: taskIdRaw, mock: record.mock === true };
}

describe('normalizeMeshyTaskResponse', () => {
  it('maps succeeded Meshy payload with model_urls.glb', () => {
    const result = normalizeMeshyTaskResponse({
      ok: true,
      meshy: {
        status: 'SUCCEEDED',
        progress: 100,
        model_urls: { glb: '/vfx/mock/demo-technique.glb' },
      },
    });
    expect(result.status).toBe('succeeded');
    expect(result.glbUrl).toBe('/vfx/mock/demo-technique.glb');
    expect(result.progress).toBe(100);
  });

  it('maps failed status with error message', () => {
    const result = normalizeMeshyTaskResponse({
      meshy: { status: 'FAILED', error: 'Quota exceeded' },
    });
    expect(result.status).toBe('failed');
    expect(result.error).toBe('Quota exceeded');
  });

  it('detects mock flag', () => {
    const result = normalizeMeshyTaskResponse({ mock: true, status: 'SUCCEEDED', glbUrl: '/x.glb' });
    expect(result.mock).toBe(true);
  });
});

describe('createMeshyTextTo3d', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws VfxWorkerError when worker is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(createMeshyTextTo3d('test prompt')).rejects.toMatchObject({
      code: 'WORKER_DOWN',
    });
  });

  it('throws on empty prompt without calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(createMeshyTextTo3d('   ')).rejects.toMatchObject({ code: 'API_ERROR' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns taskId from worker JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, taskId: 'mock-abc', mock: true }),
      }),
    );
    const result = await createMeshyTextTo3d('Feuerbohrer');
    expect(result.taskId).toBe('mock-abc');
    expect(result.mock).toBe(true);
  });

  it('throws API_ERROR on worker error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'MESHY_API_KEY missing' }),
      }),
    );
    await expect(createMeshyTextTo3d('x')).rejects.toMatchObject({ code: 'API_ERROR' });
  });
});

describe('parseCreateTaskBody', () => {
  it('accepts task_id alias', () => {
    expect(parseCreateTaskBodyForTest({ task_id: 'tid-1' }).taskId).toBe('tid-1');
  });
});

describe('renderBatchHeroFrame', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed batch render result on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          jobId: 'batch-1',
          status: 'SUCCEEDED',
          method: 'playwright',
          pngUrl: '/vfx/batch/kombi-1.png',
          renderOutput: {
            kind: 'renderOutput',
            id: 'render-1',
            url: '/vfx/batch/kombi-1.png',
            format: 'png',
            width: 960,
            height: 640,
            capturedAt: '2026-07-30T12:00:00.000Z',
          },
        }),
      }),
    );
    const result = await renderBatchHeroFrame('kombi-1');
    expect(result.status).toBe('SUCCEEDED');
    expect(result.pngUrl).toBe('/vfx/batch/kombi-1.png');
    expect(result.renderOutput?.width).toBe(960);
  });

  it('throws API_ERROR on worker failure response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Ungültige Rezept-ID' }),
      }),
    );
    await expect(renderBatchHeroFrame('bad')).rejects.toMatchObject({ code: 'API_ERROR' });
  });

  it('throws WORKER_DOWN when worker unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(renderBatchHeroFrame('kombi-1')).rejects.toMatchObject({ code: 'WORKER_DOWN' });
  });
});
