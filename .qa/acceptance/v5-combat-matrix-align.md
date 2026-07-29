# Feature: V5 combat: align marks/reactions/shield copy to spielkonzept §17–20

<!-- seeded by ecc-runner from issue #224 on 2026-07-29 — @implement may refine -->

## Intent
Kampflayer-Namen und Kern-Outcomes an V5-Matrix anpassen (Verwirbelt/Verstrahlt, Vollblock-Impuls, Nebenstatus).

## Happy Path
- [ ] - [ ] Primärmarken-Namen/Effekte matchen V5 §18 Kernverhalten.
- [ ] - [ ] Reaktionsmatrix §19 Kernpfade (mind. Mono + Dampf) aligned oder explizit gemappt.
- [ ] - [ ] Vollblock kann Impuls auslösen wo V5 es verlangt.
- [ ] - [ ] Vitest grün; typed-strict clean.
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
- V5 primary mark labels (Verwirbelt/Verstrahlt) via PRIMARY_MARK_LABEL_DE
- Side statuses: nebelbank, toxisch, heilblockade, katalysatorausfall, stabilitaetsbruch
- statusEffectCopy + StatusChips aligned to V5 §18/§20 prose
- Engine ids unchanged for compat; Vollblock impulse already in actions.ts
