# Feature: Add deck and discard pile visuals on playmat

<!-- seeded by ecc-runner from issue #6 on 2026-06-24 — @implement may refine -->

## Intent
Gemeinsamer Nachzieh- und Ablagestapel sichtbar auf dem Playmat (nicht nur Zahlen).

## Happy Path
- [ ] - [ ] Stapel an Playmat-Positionen
- [ ] - [ ] Counts korrekt
- [ ] - [ ] verify-ui Screenshot

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
- `DeckPile` / `DiscardPile` in `src/components/game/zones/` — card-back stack + count badge; discard shows top card face-up.
- Positioned via `playmatZonePercentStyle` on playmat deck/discard zones.
- `CharacterPlate` hides inline pile counts when playmat piles are shown.
- E2E: `duel-board-tableau` + `game-duel-board-ui` assert pile testids.
