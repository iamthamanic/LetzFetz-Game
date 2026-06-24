# Feature: Add GamePresentationQueue for UI-only animation sequencing

<!-- seeded by ecc-runner from issue #3 on 2026-06-24 — @implement may refine -->

## Intent
UI-only Queue sequenziert Animationen (Deal, Draw, Play) ohne Engine-Logik zu duplizieren.

## Happy Path
- [ ] - [ ] Queue API dokumentiert in Modul
- [ ] - [ ] Unit-Tests für enqueue/flush/skip
- [ ] - [ ] Kein React in `src/game/`

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
- `src/components/game/presentation/` — pure reducer (`presentationQueue.ts`), `usePresentationQueue` hook, module docs in `index.ts`.
- Unit tests: FIFO order, enqueue while active, skip, flush, idle edge cases.
- `GameView` defers bot ticks and human `onDispatch` while `isInputLocked`; `flush()` on winner and new game.
- No React in `src/game/`.
