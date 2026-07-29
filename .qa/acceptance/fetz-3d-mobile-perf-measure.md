# Acceptance: fetz-3d-mobile-perf-measure

**Issue:** #193  
**Slug:** `fetz-3d-mobile-perf-measure`  
**Runtime:** Local (desktop) + mobile viewport emulation

## Intent

Measure framerate / load time of the Engine preview on mobile (or mobile emulation) and document results plus budget adjustments (Brief §22 / §30.13).

## Preconditions

- Board Live-3D zone (#187) + MVP recipe available via Playtest
- Max one R3F canvas per view

## Happy Path

1. Tester opens Engine-Zone on mobile/emulation (`npm run test:e2e:mobile-perf` or `?enginePerf=1`)
2. Report includes FPS, load ms, canvas count
3. Team uses numbers for outline / particle cut decisions

## Acceptance Criteria

- [ ] Evidence/report with measurements and recommendations
- [ ] Budgets in asset-specification or rendering.md adjusted if needed
- [ ] No second canvas introduced
- [ ] Touched files: zero type escape hatches

## Edge Cases

- WebGL missing → document fallback path
- Reduced motion noted (outline off)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — local perf flag / report |
| P-04 secrets in git | N/A |

## Implementation Notes

- `EnginePerfHud` + `?enginePerf=1` / `lf-engine-perf` flag
- E2E `test:e2e:mobile-perf` writes `mobile-perf-metrics.json`
- Report: `docs/engine-system/mobile-perf-report.md`; budgets noted in `rendering.md` + `asset-specification.md`
- No second canvas; outline gates unchanged (already low-end aware)
