# Feature: Add CharacterDock with idle loop on playmat

<!-- seeded by ecc-runner from issue #7 on 2026-06-24 — @implement may refine -->

## Intent
Spieler-Charakter unten links mit Idle-Loop; Gegner oben rechts (statisch oder Idle).

## Happy Path
- [ ] - [ ] Du-Dock mit Idle (wenn Asset da)
- [ ] - [ ] Gegner-Dock positioniert
- [ ] - [ ] LP/Name sichtbar

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
- `CharacterDock` in `zones/` — `CardIllustrationLoop` idle variant, LP/name overlay.
- Positioned on playmat `player-character` / `opponent-character` zones; replaces `CharacterPlate` in `PlaymatBoard`.
- Keeps `human-plate` / `opponent-plate` testids for E2E; `character-dock-idle-{id}` on media.
