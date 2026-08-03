# Feature: Harden locked Slice-1 105-recipe catalog (#343 retarget)

**Issue:** #343 (full 60×K matrix deferred)

## Intent
Complete the existing Slice-1 catalog (3T×3E×4K → 105 recipes) with real German names, effect summaries, Fessel intensity wired to catalyst deltas, and clear Slice-1 markers. No new Techniken/Essenzen/Katalysatoren.

## Happy Path
- [x] Generated catalog count remains **105** (9 TE + 12 TK + 12 EK + 36 TEK + 36 Überformel)
- [x] Every recipe has German `name` + non-stub `effectSummary`
- [x] TK/EK bases use standalone German names (no `·` compounds)
- [x] Fessel recipes: `intensity === primary.value`; summaries mention manuelle Wahl
- [x] No recipe ships primary value 0 after Sofortzünder
- [x] `catalogSlice: 'slice1'` on all generated recipes + `V6_SLICE1_RECIPE_CATALOG` meta
- [x] Pack `v6-core` still lists only Slice-1 components; generator regenerates cleanly
- [x] `npm run checks` green

## Out of scope
- Full 60-TE / matrix expansion
- Echo/Delay (#344)
- New T/E/K cards beyond Slice-1

## Security Coverage
| Item | Status |
|------|--------|
| Content local typed | Authoring + fail-closed assert |
| No remote eval | Generator local only |
