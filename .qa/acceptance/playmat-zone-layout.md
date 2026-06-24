# Feature: Generalize playmat zone layout from Späti preview

<!-- seeded by ecc-runner from issue #4 on 2026-06-24 — @implement may refine -->

## Intent
Ein arena-agnostisches Zonen-Layout (Engine, Kampf, Stapel, Char-Docks, Hand) aus dem Späti-Preview extrahieren.

## Happy Path
- [ ] - [ ] Generisches Layout-Modul (nicht nur spaeti-*)
- [ ] - [ ] Preview weiter unter `?playmat-preview=1`
- [ ] - [ ] Legende zeigt skalierte Koordinaten

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
- `playmatLayout.ts` — generic scaling, theme CSS vars, `ResolvedPlaymatLayout`.
- `arenaPlaymatLayouts.ts` — Späti spec + fallback for unknown arenas.
- `PlaymatZoneOverlay.tsx` replaces spaeti-specific overlay; preview at `?playmat-preview=1`.
- Unit tests for rect/path scaling and arena fallback.
