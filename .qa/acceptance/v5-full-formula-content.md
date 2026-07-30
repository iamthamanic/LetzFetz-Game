# Acceptance — V5 full formula content (#231)

## Intent

Ship the full V5 Formelkomponenten set in `V5_PACK`: 12 Techniken, 12 Essenzen, 12 Katalysatoren, and 6 Gegenstände (§12–14, §21), with shuffle/createMatch smoke and formula art paths.

## In scope

- Card defs in `src/game/packs/v5/formulaCards.ts`
- Pack mix / `mainDeckSize` wired in `v5-pack.ts`
- Public art under `public/cards/formula/*.png` + `resolveFormulaCardArtPath`
- Unit tests for counts, deck build, createGame formula build

## Out of scope

- Rematching BASE_PACK element counts to 24/24/6 (concept 106 vs actual 112)
- Full engine resolve for every effect text (stubs OK where hooks missing)
- Item art PNGs

## Acceptance criteria

1. `V5_PACK` has 12 techniques, 12 essences, 12 catalysts, 6 items
2. `buildMainDeckInstances(V5_PACK)` length equals `V5_PACK_MAIN_DECK_SIZE` (112 with current BASE elements)
3. `V5_TARGET_MAIN_DECK_SIZE` documents concept target 106
4. `createGame` + `FORMULA_BUILD` smoke still passes
5. `resolveCardArtPath('v5-technik-…')` → `/cards/formula/{slug}.png`
6. `npm run checks` green; typed-strict on touched files

## Evidence

- Vitest: `src/game/packs/v5/v5-pack.test.ts`, `src/services/cardArt/manifest.test.ts`
