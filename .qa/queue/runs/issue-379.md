# Issue #379 — V6: Riss in der Realität (Arena-Swap Hauptaktion)

**phase:** ship
**branch:** feat/379-v6-riss-arena-swap
**acceptance:** `.qa/acceptance/v6-riss-arena-swap.md`

## Research
- `glitch-riss` already in V6 Standard-Glitches (#378) + `PLAY_GLITCH` → `switchArena`
- Gap: `switchArena` wiped match meta via `createEmptyMeta()` (lost `v6FormulaEnabled`, queues, affinity, …)
- Gap: lastEvent used raw arena id; docs/UI thin on „alte Trigger nicht rückgängig“
- No dedicated V6 Riss unit tests

## Done
- Fixed `switchArena` meta preservation + DE lastEvent with arena name
- Glitch effectText + Spielregeln + SPIELANLEITUNG_V6 §11 + spielkonzept
- Tests: `rissArenaSwap.test.ts` (4) + Spielregeln smoke
- `npm run checks` PASS
- Review: ACCEPT (scoped) — meta wipe was real bug; no DaisyUI/Next; engine authority intact
- UI guidelines: DE copy-only Spielregeln/card text; no new ad-hoc styles
- ecc-check: READY

## Pipeline
- verify: PASS
- review: PASS
- ecc-check: READY
