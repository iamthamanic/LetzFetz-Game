# Acceptance — vfx-worker-stub

<!-- seeded from issue #253 — local VFX worker HTTP stub -->

## Intent

Add `tools/vfx-worker/` local HTTP server on port **8787** for VFX Studio authoring jobs. Meshy API key stays server-side only; health works without secrets.

## User Journey

1. `npm run vfx-worker` starts listener on `8787` (override via `VFX_WORKER_PORT`).
2. `GET /health` → `{ "ok": true }`.
3. Meshy routes require `MESHY_API_KEY` in process env (local `.env`, never Vite client).
4. `GET /jobs/:id` returns placeholder job status for future local job tracking.

## Problem

No local backend island for VFX authoring (Meshy proxy, job status, future Effekseer/batch).

## Solution

Minimal Node HTTP worker (`node:http`, no Express). Meshy proxy skeleton only — no full generate flow this slice.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Missing `MESHY_API_KEY` → clear JSON error on `/meshy/*` routes; `/health` and `/jobs/*` still respond.
- Worker crash does not affect `npm run checks` (app bundle unchanged).

## Acceptance

- [ ] `tools/vfx-worker/` + `npm run vfx-worker` script.
- [ ] `GET /health` → `{ ok: true }`.
- [ ] Meshy stub routes; key read only from `process.env.MESHY_API_KEY`.
- [ ] `GET /jobs/:id` placeholder status endpoint.
- [ ] README note: local authoring only; never expose Meshy key to browser.
- [ ] `npm run checks` green (app).
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md`

## Blockers

Depends on #251

## Feature slug

`vfx-worker-stub`
