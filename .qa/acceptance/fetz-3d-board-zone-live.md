# Acceptance: fetz-3d-board-zone-live

**Issue:** #187  
**Slug:** `fetz-3d-board-zone-live`  
**Runtime:** Local browser (R3F)

## Intent

Make the Play board Engine-Zone the primary Live-3D surface (one canvas) and auto-warm snapshots so thumbs fill without a mandatory “Snapshot cachen” click.

## Preconditions

- `EnginePreviewCanvas` + `requestEngineSnapshot` exist
- Human bound recipe via `boundToRecipe` / `validateRecipe`
- Montage animation (#186) available

## Happy Path

1. Player builds Träger+Antrieb(+Aufsatz) on the board
2. System shows Live-3D in the human Engine-Zone (not only Cheatbox panel)
3. Snapshot cache warms automatically; thumbs can prefer cache

## Acceptance Criteria

- [ ] Engine-Zone shows Live-3D for active player recipe
- [ ] Auto snapshot warmup without required click
- [ ] Only one canvas; evidence + `npm run checks` green
- [ ] Touched files: zero type escape hatches; no `three` under `src/game/`

## Edge Cases

- WebGL fail → DE fallback; zone stays playable 2D
- Bot/opponent: no second canvas; Snapshot/PNG thumbs only
- Unbound / ineligible → empty zone placeholder copy
- MVP cheatbox reuses the same board canvas (not a second R3F root)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — client preview only |
| P-04 secrets in git | N/A |

## Implementation Notes

- `BoardEngineLiveZone` under human `BoundCardRow` in `PlaymatBoard`; PlayView passes `liveEngineRecipe` (bound or MVP)
- Auto warmup via `boardEngineWarmupDelayMs` + `requestEngineSnapshot`; thumb refresh via `liveSnapshotEpoch` on human row only
- Floating bound **Fetzgerät 3D** panel removed — board zone is primary; one canvas
- Docs: `rendering.md` surfaces / Play integration; evidence `.qa/evidence/fetz-3d-board-zone-live.md`
