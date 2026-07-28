# Feature: V3 Träger Ladung-Spend Confirm UI

<!-- seeded by ecc-runner from issue #169 on 2026-07-28 — @implement may refine -->

## Intent
Add an explicit German Confirm UI when spending shared Fetzgerät Ladung via Träger activate paths, so charge spend is intentional (checklist: Confirm-UI für Träger-Spend fehlt).

## Happy Path
- [ ] - [ ] Human Träger charge-spend shows Confirm with cost + remaining
- [ ] - [ ] Confirm dispatches; cancel does not
- [ ] - [ ] Insufficient charge blocked with DE message
- [ ] - [ ] Gap checklist updated; Styleguide primitives; `npm run checks` green
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
