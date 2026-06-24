# Acceptance: Card Play Zone Snap and Highlight (#15)

## Issue
Add card play zone snap and highlight.

## Acceptance criteria
- [x] Snap in Engine/Kampf sichtbar
- [x] Spielbare Karten in Hand gehoben (bestehend via `ring-emerald` + `hover:scale-105`)
- [x] `npm run checks` grün

## Implementation
- `buildBindSnapStep.ts` — presentation step for newly bound cards (360ms, no input lock)
- `findNewlyBoundCardIds()` — diff prev/current state for bound card changes
- GameView: detects newly bound cards for both players, enqueues snap steps
- `BoundCardSlot` — `snap` prop triggers `card-bind-snap` CSS class
- CSS: `cardBindSnap` keyframes (scale 0.6 → 1.12 → 1, brightness flash)
- `prefers-reduced-motion` disables snap animation

## Tests
- Unit: `buildBindSnapStep.test.ts` (3 tests)
- E2E: existing bind test still green