# Feature: VFX: Combinate VisualRecipe → preset layers for MVP-9 (T/E/K)

<!-- seeded by ecc-runner from issue #303 on 2026-07-30 — @implement may refine -->

## Intent
Map Combinate T/E/K slots (MVP-9) through VisualRecipe properties to Effekseer preset layers for shared preview — without Meshy #286.

## Happy Path
- [ ] - [ ] Mapper covers all 9 MVP card ids with deterministic preset ids.
- [ ] - [ ] Combinate preview uses mapper (not hardcoded aura-only) when slots filled.
- [ ] - [ ] Unit tests for mapper; `npm run checks` green.
- [ ] - [ ] Touched files: zero type escape hatches (`@typed-strict`).
- [ ] - [ ] Does **not** require Meshy #286.

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

## Implementation Notes
- Mapper + MVP-9 table; Combinate preview uses primaryPresetId.
