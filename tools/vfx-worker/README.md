# VFX Worker (local)

Local HTTP server for **VFX Studio** authoring jobs. **Not** part of the Vite frontend bundle and **not** deployed.

| Route | Role |
|-------|------|
| `GET /health` | Liveness — always `{ ok: true }` |
| `POST /meshy/text-to-3d` | Meshy text-to-3d preview proxy |
| `GET /meshy/tasks/:taskId` | Meshy task status proxy |
| `GET /jobs/:jobId` | Local job status placeholder |
| `POST /batch/render` | Headless hero-frame capture (Playwright → `public/vfx/batch/`) |
| `GET /batch/jobs/:jobId` | Batch job status + render metadata |

Design: `.qa/design/vfx-studio.md`

## Start

From repo root (`Letz-Fetz-Game/`):

```bash
npm run vfx-worker
```

Default: `http://127.0.0.1:8787`. Override with `VFX_WORKER_PORT`.

## Secrets

`MESHY_API_KEY` is read **only** from the worker process environment (local `.env`, shell export).  
**Never** put Meshy keys in `VITE_*` vars or client-side code — the browser must call this worker, not Meshy directly.

Without `MESHY_API_KEY`, `/health` and `/jobs/*` still work; `/meshy/*` returns 503 unless mock mode is on.

### Offline demo (no Meshy key)

```bash
VFX_WORKER_MOCK=1 npm run vfx-worker
```

Returns a fake task that completes with demo GLB URL `/vfx/mock/demo-technique.glb` (see `public/vfx/mock/README.md`). For CI and local UI tests without spending credits.

## Quick check

```bash
curl -s http://127.0.0.1:8787/health
curl -s http://127.0.0.1:8787/jobs/demo-job
curl -s -X POST http://127.0.0.1:8787/meshy/text-to-3d -H 'Content-Type: application/json' -d '{}'
```

### Batch hero frames

Requires **Vite dev server** (`npm run dev`, default `http://127.0.0.1:4789`) for Playwright to hit the batch preview route (`?vfx-batch-preview=1`).

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run vfx-worker

# Render one recipe (writes public/vfx/batch/<recipeId>.png + .json)
curl -s -X POST http://127.0.0.1:8787/batch/render \
  -H 'Content-Type: application/json' \
  -d '{"recipeId":"kombi-demo","presetId":"aura"}'
```

| Env | Effect |
|-----|--------|
| `VFX_BATCH_PREVIEW_URL` | Override dev URL (default `http://127.0.0.1:4789`) |
| `VFX_BATCH_PLACEHOLDER=1` | Skip Playwright; write placeholder PNG (CI / offline) |

If headless WebGL fails, the worker falls back to a placeholder PNG and records the Playwright error in metadata. Full headless WebGL tuning is a follow-up iteration.
