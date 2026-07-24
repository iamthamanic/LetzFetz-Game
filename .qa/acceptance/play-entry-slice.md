# Feature: Play Entry Slice (Issue #65)

<!-- acceptance artifact before implementation — 2026-07-24 -->

## Intent

Complete the Play vertical slice by relocating the last `src/components/game/` modules into `features/play/` and shared `components/character/`, so `App.tsx` imports `PlayView` from the play slice and `components/game/` is deleted.

## Happy Path

- [ ] `GameView.tsx` → `src/features/play/PlayView.tsx`; export `PlayView` (or entry re-export); orchestration unchanged.
- [ ] `PlaytestCheatbox.tsx` → `src/features/play/PlaytestCheatbox.tsx` (play-owned dev tooling).
- [ ] `CharacterDetailPanel.tsx` → `src/components/character/CharacterDetailPanel.tsx` (Forge + Play setup shared; no feature→feature).
- [ ] `App.tsx` imports `PlayView` from `features/play/PlayView`.
- [ ] `src/components/game/` deleted entirely; no re-export stubs.
- [ ] Docs synced: `AGENTS.md`, `.cursor/rules/project-core.mdc`, `.cursor/rules/react-ui.mdc`, `docs/UI_STYLEGUIDE.md`, `DESIGN.md`.
- [ ] `src/game/` unchanged; no feature→feature imports introduced.
- [ ] `npm run checks` green.

## Edge Cases

- [ ] Relative imports in moved modules updated (`components/ui`, `game/`, play sub-slices).
- [ ] Playmat preview dev route (`?playmat-preview=1`) still renders via `App.tsx`.
- [ ] Playtest cheatbox still gated by `isPlaytestMode()`.

## Regression

- [ ] Main menu → Play → setup carousel → start match → playmat board renders.
- [ ] Forge card library hover still shows character detail panel.
- [ ] Match intro, presentation VFX, phase coach, bot turns unchanged.

## Security Coverage

- N/A — path relocation only.

## Assumptions

- Depends on #64 (board under `features/play/board/`).
- E2E specs use testids/routes, not legacy import paths.

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — path move only |

## Implementation Notes

- Moved via `git mv`: `GameView.tsx` → `features/play/PlayView.tsx`, `PlaytestCheatbox.tsx` → `features/play/`, `CharacterDetailPanel.tsx` → `components/character/`.
- Updated imports in `App.tsx`, `features/forge/CardLibrary.tsx`, `features/play/setup/CharacterPreviewWithDetails.tsx`.
- Deleted `src/components/game/`; docs synced (`AGENTS.md`, `.cursor/rules/*`, `UI_STYLEGUIDE.md`, `DESIGN.md`).
