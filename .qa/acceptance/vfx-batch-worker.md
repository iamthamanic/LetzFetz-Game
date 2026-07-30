# Acceptance — vfx-batch-worker

<!-- seeded from issue #261 — local VFX batch hero-frame render -->

## Intent

Local batch path for formula hero frames: vfx-worker renders ≥1 recipe via headless Chromium (same preview scene as Studio) and Batch UI in VFX Studio lists pending jobs with German status.

## User Journey

1. User saves a Kombination in Combinate (registry has ≥1 `formulaRecipe`).
2. Build → Development → VFX Studio → **Batch** lists recipes ohne Hero-Frame als **Ausstehend**.
3. User clicks **Batch starten** → UI calls `POST /batch/render` on local worker (`npm run vfx-worker`).
4. Worker captures preview (`?vfx-batch-preview=1`) with Playwright; writes PNG + metadata under `public/vfx/batch/`.
5. On success UI shows **Fertig** and registry hero frame updates; on failure **Fehlgeschlagen**.

## Problem

No batch path for hero frames at Combinate / Studio scale.

## Solution

- `POST /batch/render` + `GET /batch/jobs/:id` on `tools/vfx-worker/`
- Dev-only batch preview route reusing `VfxSharedPreview`
- `VfxBatchPanel` in Studio Batch mode
- Playwright preferred; placeholder PNG fallback when headless WebGL fails

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes — requires `npm run dev` + `npm run vfx-worker` |

## Edge Cases

- Worker timeout → job status **FAILED** per recipe.
- Dev server down → German worker-down error in UI.
- No recipes → empty state with hint to Combinate.
- Playwright/WebGL flaky → placeholder PNG + metadata notes `method: placeholder`.

## Acceptance

- [ ] `POST /batch/render` produces ≥1 hero frame PNG + metadata JSON under `public/vfx/batch/`.
- [ ] Batch preview uses same `VfxSharedPreview` scene contract as Formeln mode.
- [ ] Batch UI: pending list, Run, German status labels, FAILED on errors.
- [ ] `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md`

## Blockers

Depends on #253, #258

## Feature slug

`vfx-batch-worker`
