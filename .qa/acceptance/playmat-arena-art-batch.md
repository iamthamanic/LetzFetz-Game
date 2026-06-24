# Acceptance: playmat-arena-art-batch (#11)

## Intent
All six base-pack arenas resolve a playmat background (shipped top-down or card-art fallback).

## Criteria

- [x] `playmatAssets.ts` manifest covers all 6 `BASE_PACK` arena ids
- [x] `getPlaymatLayoutForArena` registers per-arena theme tints
- [x] `ArenaPlaymat` exposes `data-arena-id` and `data-playmat-source`
- [x] Späti keeps `arena-spaeti-topdown.png` as primary
- [x] Missing top-down → `/cards/arena/{id}.png` without crash
- [x] `docs/PLAYMAT_ASSETS.md` documents paths and authoring pipeline

## Validation

```bash
cd Letzfetzprototype && npm run checks
npx playwright test e2e/duel-board-tableau.spec.ts
```
