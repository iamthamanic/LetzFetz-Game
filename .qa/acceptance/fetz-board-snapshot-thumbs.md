# Feature: Board thumbs: prefer engine snapshot cache

<!-- seeded by ecc-runner from issue #166 on 2026-07-28 — @implement may refine -->

## Intent
Cut over Play board / bound engine-part thumbs from static registry `previewUrl` to prefer `#146` in-memory snapshot cache (`getEngineSnapshot` / `requestEngineSnapshot`), with PNG `previewUrl` fallback when cache misses.

## Happy Path
- [ ] - [ ] Bound engine-part thumbs prefer cached snapshot when `renderKey` hit
- [ ] - [ ] Miss → registry/card-art PNG (no broken image)
- [ ] - [ ] Vitest for resolver helper; `npm run checks` green
- [ ] - [ ] Docs/`V3` or engine-system note: board cutover done
- [ ] - [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases
- [ ] (from .qa/edge-cases.md + @implement)

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
<!-- filled after coding -->
