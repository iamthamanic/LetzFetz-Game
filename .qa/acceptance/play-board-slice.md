# Feature: Play Board Slice (Issue #64)

<!-- acceptance artifact before implementation — 2026-07-24 -->

## Intent

Relocate the Play board and playmat UI modules from `src/components/game/` into `src/features/play/board/` (with `playmat/` and `zones/` subdirs) without changing game behavior, layout, or VFX timing.

## Happy Path

- [ ] Board components (`PlaymatBoard`, `DndPlaymat`, `BoardCard`, phase bars, playmat, zones, etc.) live under `src/features/play/board/`.
- [ ] Board-owned helpers (`arenaTheme`, `buildGameViewModel`, `gameActionHelpers`, `phaseCoachHint`, `combatStageCopy`, `diceRollFeedback`, `phraseSlotLabels`) move with the board slice when only Play consumes them.
- [ ] Old paths under `src/components/game/` deleted; no re-export stubs.
- [ ] `GameView.tsx` stays in `components/game/` and imports board modules from `features/play/board/`.
- [ ] `App.tsx` imports `PlaymatZonePreview` from the play board slice.
- [ ] `features/play/presentation/*` and `features/play/setup/*` import board modules from the new slice path.
- [ ] `CharacterDetailPanel.tsx` stays in `components/game/` (Forge + Play setup share it).
- [ ] `PlaytestCheatbox.tsx` stays in `components/game/` (GameView orchestration).
- [ ] No `features/forge` ↔ `features/play` imports introduced.
- [ ] `npm run checks` green.

## Edge Cases

- [ ] Relative imports within moved modules updated for new nesting (`components/ui`, `components/cards`, `game/`, `services/`).
- [ ] Playmat preview dev route (`?playmat-preview=1`) still renders.
- [ ] V2 phrase slot labels and bound-card row unchanged.
- [ ] DnD playmat drag/drop and zone overlays unchanged.

## Regression

- [ ] Start match → playmat board renders with hand, bound row, combat stage, phase bars.
- [ ] Presentation VFX (draw, build snap, attack fly, combat resolve) still overlay on board.
- [ ] Match intro W6 die roll unchanged.
- [ ] Arena setup backdrop/center theming unchanged.

## Security Coverage

- N/A — path relocation only.

## Assumptions

- Depends on #63 (presentation already under `features/play/presentation/`).
- `GameView` orchestration stays in `components/game/` until #65.
- `CharacterDetailPanel` remains shared in `components/game/` to avoid feature→feature imports.

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — path move only |

## Implementation Notes

- Moved 48 board/playmat/zones modules + helpers to `src/features/play/board/` via `git mv`.
- Updated imports in `GameView.tsx`, `App.tsx`, `features/play/presentation/*`, `features/play/setup/*`.
- Intentionally left in `components/game/`: `GameView.tsx`, `CharacterDetailPanel.tsx`, `PlaytestCheatbox.tsx`.
- `npm run checks`: build + 246 tests green.
