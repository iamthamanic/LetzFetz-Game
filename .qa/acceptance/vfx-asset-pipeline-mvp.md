# Acceptance — vfx-asset-pipeline-mvp

<!-- seeded from issue #256 — Asset pipeline Prompt + Meshy + Technique save -->

## Intent

First executable **Asset Pipeline** path in VFX Studio: Prompt → Meshy (via local vfx-worker) → stub Normalize/Socket → save **TechniqueAsset** to local registry. Material Formeln or Studio library shows saved entries.

## User Journey

1. Open Build → VFX Studio → **Assets** mode.
2. Add **Prompt** and **Meshy 3D** nodes on the React Flow graph (via Node-Bibliothek).
3. Enter a German/English prompt on the Prompt node; connect Prompt → Meshy.
4. Click **Generieren** on Meshy — credit confirm modal (German) before spend.
5. Worker runs text-to-3d (mock when `VFX_WORKER_MOCK=1` on worker); node status uses `VfxAssetStatus`.
6. On success, Normalize (identity stub) and Save node produce a **TechniqueAsset** in local registry.
7. Saved technique appears in Studio library and Material → Formeln (custom entries).

## Problem

Studio shell (#252) has graph UI but no executable Meshy pipeline or Technique persistence.

## Solution

React Flow custom nodes + `workerClient` → `http://127.0.0.1:8787`. Registry in `services/storage/vfxRegistry.ts` (localStorage). Worker extended for Meshy proxy + mock demo path. Meshy key never in Vite bundle.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes — vfx-worker required for generate |

## Edge Cases

- Worker down → node status **FAILED** with German message.
- Missing `MESHY_API_KEY` without `VFX_WORKER_MOCK=1` → worker 503; client shows FAILED.
- `VFX_WORKER_MOCK=1` → offline demo GLB at `/vfx/mock/demo-technique.glb` (documented in worker README).
- Normalize/Socket are identity stubs (default coords) — no Blender this slice.

## Acceptance

- [ ] Prompt + Meshy React Flow nodes wired to vfx-worker.
- [ ] German credit confirm modal before Meshy spend.
- [ ] Technique save → local registry entry + Studio library + Material Formeln visibility.
- [ ] Node status uses `VfxAssetStatus` enums from `types/status.ts`.
- [ ] Unit tests for registry parse + worker client helpers.
- [ ] `MESHY_API_KEY` never in client bundle.
- [ ] `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md`

## Blockers

Depends on #252, #253, #254

## Feature slug

`vfx-asset-pipeline-mvp`
