# Feature: VFX: Effekseer preset node in asset pipeline + effectId on save

<!-- seeded by ecc-runner from issue #302 on 2026-07-30 — @implement may refine -->

## Intent
Add Effekseer preset node to Asset Pipeline graph; Save writes `effectId` on technique assets (stop hardcoding null).

## Happy Path
- [ ] - [ ] Default asset pipeline includes Effekseer preset node between Socket and Save.
- [ ] - [ ] Saving a technique persists non-null `effectId` when preset selected.
- [ ] - [ ] Unit tests for graph defaults + save payload.
- [ ] - [ ] `npm run checks` green.
- [ ] - [ ] Touched files: zero type escape hatches (`@typed-strict`).

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
- Default pipeline: Meshy→Normalize→Socket→Effekseer Preset→Save; save writes effectId from preset.
