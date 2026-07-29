# Mobile WebGL performance report (Fetzgerät 3D)

**Issue:** #193  
**Date:** 2026-07-29  
**Protocol:** `npm run test:e2e:mobile-perf` → `docs/engine-system/mobile-perf-metrics.json`  
**Overlay:** `?enginePerf=1` or `localStorage lf-engine-perf=1` → `EnginePerfHud` (FPS + canvas count)

## Measurement protocol

1. Chromium Playwright, viewport **390×844**, `isMobile` + touch
2. Playtest match → enable **3D-Assembler (MVP)** → board Live-3D only
3. `prefers-reduced-motion: reduce` (assembled pose; outline off)
4. Sample **2s** of `requestAnimationFrame` timestamps after snapshot warmup
5. Record: `fpsAvg`, `fpsMin`, `loadMs` (toggle → warmup), `canvasCount`, WebGL yes/no

**Limitation:** Emulation uses the host desktop GPU. Numbers are a **relative budget signal**, not iPhone silicon ground truth. Re-run on a real device before shipping particle/outline-heavy looks.

## Latest run (committed metrics)

| Metric | Value |
|--------|-------|
| WebGL | yes |
| Canvas count | **1** |
| Load (MVP enable → snapshot warmup) | ~450 ms |
| FPS avg (2s window) | ~120 (desktop GPU under mobile viewport) |
| FPS min | ~58 |
| Reduced motion | yes |
| Recipe | `MVP_DEMO_RECIPE` |

Source: [`mobile-perf-metrics.json`](./mobile-perf-metrics.json).

## Fail / fallback paths

| Case | Behavior |
|------|----------|
| WebGL missing | German fallback in `EnginePreviewCanvas`; metrics JSON notes `webgl: false`; e2e **skips** FPS (not a silent green) |
| Second canvas | Assert `canvasCount ≤ 1` in e2e — board zone owns the only Live-3D surface |
| Reduced motion | Outline off via `shouldEnableEngineOutline`; montage assembled pose |

## Recommendations (Brief §22 / §30.13)

| Topic | Decision |
|-------|----------|
| Canvas | Keep **max one** Live-3D canvas (already enforced in Play) |
| Outline | Keep current gate: off when reduced-motion **or** `hardwareConcurrency ≤ 2` **or** `deviceMemory ≤ 2` — no further cut needed from this emulation pass |
| Particles / heavy VFX | **Do not add** until a real-device pass shows ≥30 FPS avg with outline on |
| DPR | Keep `dpr={[1, 1.5]}` — avoid uncapped retina DPR on mobile |
| Asset budgets | No change to triangle/byte caps from this pass; pilots already tiny |
| Target budget (doc) | Interactive floor **≥30 FPS** on real mid-tier phones; load-to-first-useful-frame **≤2 s** on 3G-class caches after GLBs warm |

## How to re-measure

```bash
npm run test:e2e:mobile-perf
# optional HUD while developing:
# open /?playtest=1&enginePerf=1 → enable 3D-Assembler (MVP)
```

Update this report’s table when metrics JSON changes materially (new materials, particles, second canvas regressions).
