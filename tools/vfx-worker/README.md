# VFX Worker (local)

Local HTTP server for **VFX Studio** authoring jobs. **Not** part of the Vite frontend bundle and **not** deployed.

| Route | Role |
|-------|------|
| `GET /health` | Liveness — always `{ ok: true }` |
| `POST /meshy/text-to-3d` | Meshy proxy stub (501 until #256) |
| `GET /meshy/tasks/:taskId` | Meshy task status proxy (requires key) |
| `GET /jobs/:jobId` | Local job status placeholder |

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

Without `MESHY_API_KEY`, `/health` and `/jobs/*` still work; `/meshy/*` returns a clear 503 error.

## Quick check

```bash
curl -s http://127.0.0.1:8787/health
curl -s http://127.0.0.1:8787/jobs/demo-job
curl -s -X POST http://127.0.0.1:8787/meshy/text-to-3d -H 'Content-Type: application/json' -d '{}'
```
