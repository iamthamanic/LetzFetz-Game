# Feature: Play Setup Slice (Issue #62)

<!-- acceptance artifact before implementation — 2026-07-24 -->

## Intent

Relocate the coherent pregame flow (mode select, character carousel, match intro, arena backdrop/center) into `src/features/play/setup/` without changing selection, AppHistory, match start, or intro timing/UX.

## Happy Path

- [ ] Nine setup/intro files live under `src/features/play/setup/` with unchanged filenames.
- [ ] Old paths under `src/components/game/` deleted; no re-export stubs.
- [ ] `GameView.tsx` imports `GameSetup` and `MatchIntro` from the new slice path.
- [ ] `GameBoard.tsx` imports `ArenaBackdrop` and `ArenaCenter` from the new slice path.
- [ ] Internal imports within moved modules and forge `CharacterDetailPanel` consumer updated directly.
- [ ] Shared layers unchanged: `services/history`, `components/ui`, `components/cards`, play audio at `features/play/services/audio/`.
- [ ] `npm run checks` green.

## Edge Cases

- [ ] Setup undo/redo via global AppHistory still works (phase + character selection).
- [ ] Intro skip, reduced motion, missing video/art, audio autoplay unchanged.
- [ ] Character detail tabs (Info/Ulti) and mobile carousel unchanged.
- [ ] Return to menu ends active session as before.

## Regression

- [ ] Bot mode → character carousel → start → Letz Fetz intro → board unchanged.
- [ ] Forge card library hover still shows CharacterDetailPanel info/ulti tabs.

## Security Coverage

- N/A — path relocation only.

## Assumptions

- Depends on #61 (play support services already under `features/play/services/`).
- Board/presentation modules remain in `components/game/` until a later slice.
- `CharacterDetailPanel` shared by forge library is updated to import from play setup (temporary cross-slice coupling until a neutral cards extraction).

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — path move only |

## Implementation Notes

- Pure relocation; update relative imports for deeper nesting (`../../../game`, `../../../components/ui`, etc.).
- `MatchIntro` keeps dependencies on `components/game/W6Die3D` and `presentation/prefersReducedMotion` until presentation slice move.
