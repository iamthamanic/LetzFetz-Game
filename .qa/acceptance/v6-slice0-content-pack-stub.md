# Feature: V6 Slice 0 — content/generated layout + V6_CORE_PACK stub

**Issue:** #311  
**Slug:** `v6-slice0-content-pack-stub`

## Intent
Add V6 content/generated skeleton and stub `V6_CORE_PACK` behind INTERNAL. No playable default; no V5 formulaCombinations imports from V6 paths.

## Acceptance

- [ ] `src/content/v6/` skeleton + schemas
- [ ] `src/generated/v6/` placeholder (never hand-edit)
- [ ] `src/game/packs/v6/v6-pack.ts` exports `V6_CORE_PACK`
- [ ] No V6 path imports `packs/v5/formulaCombinations`
- [ ] Not playable default / no setup menu
- [ ] `npm run checks` green

## Out of scope
- Generator CI, playable menu, formula composer, full recipes

## Security Coverage
- N/A (content layout + stub pack; no auth/UGC/network)

## Implementation Notes
- Added `src/content/v6/` schemas + stub authoring catalog
- Added `src/generated/v6/` placeholder (DO NOT HAND-EDIT)
- Added `V6_CORE_PACK` / `V6_PACK_RULESET` under `src/game/packs/v6/`
- Exported from `src/game/packs/index.ts`; no V5 formulaCombinations imports
- Vitest `v6-pack.test.ts`; not wired as Play default
