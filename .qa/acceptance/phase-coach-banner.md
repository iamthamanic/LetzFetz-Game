# Feature: Add phase coach banner with legal hints

<!-- seeded by ecc-runner from issue #8 on 2026-06-24 — @implement may refine -->

## Intent
Deutschsprachiger Coach: aktuelle Phase + erlaubte Aktion in einem Banner.

## Happy Path
- [ ] - [ ] Banner deutsch, phase-spezifisch
- [ ] - [ ] Keine falschen Aktionen suggeriert
- [ ] - [ ] Mobile lesbar

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
- `phaseCoachHint.ts` derives hints from `legalActions` + pending/combat/bot state.
- `PhaseCoachBanner` merges `PhaseBar`, round badge, and hint (`data-testid="phase-coach-hint"`).
- `GameView` uses banner instead of separate phase label row.
