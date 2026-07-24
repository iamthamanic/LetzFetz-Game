# Feature: Play Presentation Slice (Issue #63)

<!-- acceptance artifact before implementation — 2026-07-24 -->

## Intent

Relocate the entire game presentation queue and VFX layer from `src/components/game/presentation/` into `src/features/play/presentation/` without changing timing, queue semantics, or animation behavior.

## Happy Path

- [ ] All 30 presentation modules (builders, hooks, components, tests) live under `src/features/play/presentation/` with unchanged filenames.
- [ ] Old `src/components/game/presentation/` deleted; no re-export stubs.
- [ ] `GameView.tsx` imports presentation API from `features/play/presentation`.
- [ ] `PlaymatBoard.tsx` imports presentation types/components from `features/play/presentation`.
- [ ] `MatchIntro.tsx` imports `prefersReducedMotion` from the play slice path.
- [ ] Legacy game UI helpers (`W6Die3D`, `TurnStartAnnounce`, `PhaseCoachFooter`, `CombatDiceRoll`) import `prefersReducedMotion` from the new slice path.
- [ ] Internal imports within moved modules updated for new nesting (`components/cards`, `components/ui`, `components/game/BoardCard`, `game/`, `services/`).
- [ ] No `features/forge` ↔ `features/play` imports introduced.
- [ ] `npm run checks` green.

## Edge Cases

- [ ] Presentation queue lock/skip/flush behavior unchanged.
- [ ] Reduced-motion fast-path unchanged.
- [ ] Opening deal, draw, build snap, attack fly, instant glitch, damage hit, combat resolve steps unchanged.
- [ ] Bot deferral during `isInputLocked` unchanged in `GameView`.

## Regression

- [ ] Start match → opening deal animation → draw/build/attack/combat VFX unchanged.
- [ ] Match intro reduced-motion skip unchanged.
- [ ] Playmat board overlays render active presentation steps as before.

## Security Coverage

- N/A — path relocation only.

## Assumptions

- Depends on #62 (play setup already under `features/play/setup/`).
- Board shell (`PlaymatBoard`, `GameView`) remains in `components/game/` until a later slice.
- `prefersReducedMotion` stays play-owned (not extracted to shared) to avoid premature shared-layer churn.

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — path move only |

## Implementation Notes

- Pure relocation; update relative imports only.
- Do not alter `presentationQueue.ts` reducer logic or step durations.
- Update Location header comments in moved files to reflect new path.
