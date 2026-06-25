# Acceptance: Activate-Bound Discard Fly VFX (#19)

## Issue
Add activate-bound discard fly VFX — activated bound card flies to discard pile with animation.

## Acceptance criteria
- [x] Fly-to-discard sichtbar
- [x] State korrekt nach Animation
- [x] prefers-reduced-motion disables animation

## Implementation
- `src/components/game/presentation/buildActivateDiscardStep.ts` — new presentation step (420ms, non-locking)
  - `findActivatedDiscardCardId()` — detects hand cards removed by ACTIVATE_BOUND
- `GameView.tsx` — state-diff useEffect detects activate-discard, enqueues step
  - `onStepComplete` clears `activateDiscardId` after timeout
- `PlaymatBoard.tsx` — renders `activate-discard-fly` overlay when active
- `src/index.css` — `activateDiscardFly` keyframes (scale + translate + rotate toward discard)

## Tests
- 149 unit tests pass (2 new activate-discard tests)
- E2E tests pass (flaky block prompt re-confirmed)