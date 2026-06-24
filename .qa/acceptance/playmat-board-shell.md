# Feature: Replace GameBoard tableau with PlaymatBoard shell

<!-- seeded by ecc-runner from issue #5 on 2026-06-24 — @implement may refine -->

## Intent
Arena als Full-Bleed-Playmat statt vertikalem Tableau + Arena-Sidebar.

## Happy Path
- [ ] - [ ] Playmat im Spiel-Tab (nicht nur Preview)
- [ ] - [ ] Arena-Sidebar entfernt oder Badge
- [ ] - [ ] E2E `game-duel-board-ui` angepasst/grün

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
- `PlaymatBoard.tsx` replaces `GameBoard` in `GameView`; full-bleed `ArenaPlaymat` + compact `ArenaPlaymatBadge`.
- Späti uses top-down texture; other arenas fall back via `getPlaymatLayoutForArena`.
- E2E updated: `arena-playmat`, `arena-playmat-badge`, `playmat-board`.
