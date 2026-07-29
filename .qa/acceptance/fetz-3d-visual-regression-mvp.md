# Acceptance: fetz-3d-visual-regression-mvp

**Issue:** #192  
**Slug:** `fetz-3d-visual-regression-mvp`  
**Runtime:** Local (desktop) Playwright — WebGL required for pixel compare

## Intent

Stable screenshot/snapshot of the MVP trio assembly (Wasser-Träger + Schatten-Antrieb + Licht-Aufsatz) for visual regression (Brief §21 Rendering). Authors detect montage/material regressions against a committed baseline.

## Preconditions

- `#183` toon materials + `#185` MVP PNG/GLB pilot assets on `main`
- `MVP_DEMO_RECIPE` = water traeger / shadow antrieb / light aufsatz
- Fixed `EngineCamera` (no orbit)
- Playwright Chromium with WebGL (or explicit skip)

## Happy Path

1. Author runs `npm run test:e2e:visual-mvp` (or Playwright with update flag)
2. System opens Playtest → enables 3D-Assembler (MVP) → Live-3D board zone shows assembled trio
3. Harness compares canvas crop to baseline under `e2e/…-snapshots/` (or refreshes baseline)
4. Diff above threshold → fail; match → pass

## Acceptance Criteria

- [ ] Harness/docs for MVP-Trio Snapshot
- [ ] Baseline committed or Evidence path documented
- [ ] Fail conditions clear (diff / missing WebGL skip vs silent green)
- [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases

- Headless WebGL unavailable → `test.skip` with explicit note (not silent pass claiming green pixels)
- `ENGINE_RENDER_VERSION` bump → baseline refresh documented in `rendering.md`
- `prefers-reduced-motion` forced for deterministic assembled pose (no montage mid-frame)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — local screenshot harness |
| P-04 secrets in git | N/A — PNG baselines only |

## Implementation Notes

- Playwright harness + `engineMvpVisual` helpers (reduced-motion, Playtest MVP zone, warmup status wait)
- Baseline under `e2e/fetz-3d-visual-regression-mvp.spec.ts-snapshots/`; evidence PNG + notes under `.qa/evidence/fetz-3d-visual-regression-mvp/`
- Scripts: `test:e2e:visual-mvp` / `test:e2e:visual-mvp:update`
- Docs: `rendering.md` visual regression section (fail/skip/baseline refresh)
