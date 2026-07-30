# Design — V5 full formula content (#231)

## Decision

Expand `V5_PACK` from MVP-9 formula cards to the full §12–14 set (12+12+12) plus existing 6 items. Keep BASE_PACK elements/glitches until a dedicated rematch; document concept deck size 106 vs shipped 112.

## Approach

- Single source: `formulaCards.ts` with full arrays; `V5_MVP_*` remains a filtered 3+3+3 alias for legacy callers
- Art: slug after `v5-{technik|essenz|katalysator}-` maps to `/cards/formula/{slug}.png`
- Effects: wire `formulaEffect` only where existing engine kinds apply; other cards ship `effectText` + visual stubs

## Non-goals

- Element mix rematch
- New FormulaEffect kinds beyond current resolve hooks
