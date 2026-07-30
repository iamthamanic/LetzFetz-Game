# Acceptance: engine-two-slot-formula

**Issue:** #260  
**Slug:** `engine-two-slot-formula`

## Intent

Rules engine: formula with **≥2 of 3** roles filled is legal to activate/resolve; missing role contributes no effect. **1-slot** formula resolve remains illegal (authoring preview only).

## Happy Path

1. Technik + Essenz on board → `FORMULA_ACTIVATE` legal; Katalysator effects skipped.
2. Full Technik + Essenz + Katalysator → still legal; +1 Fetzladung on full upright activation.
3. Only Technik on board → `FORMULA_ACTIVATE` not offered; direct apply throws.

## Edge Cases

- Two filled slots but only one upright → resolve legal if ≥2 filled and ≥1 activatable.
- Exhausted/disturbed slots count as filled but not activatable.
- Fetzladung still requires all three upright non-disturbed (`isFullFormulaActivatable`).

## Acceptance Criteria

- [ ] `isFormulaResolvable` + gate in `listFormulaPhaseActions` / `applyFormulaActivate` / `resolveFormulaActivate`
- [ ] Vitest: 2-slot legal, 1-slot rejected, 3-slot unchanged
- [ ] `SPIELANLEITUNG_V5_DRAFT.md` + `letz-fetz-v5-spielkonzept.md` updated
- [ ] `npm run checks` green
- [ ] Touched files: zero type escape hatches

## Implementation Notes

- `formulaCharge.ts`: `countFilledFormulaSlots`, `isFormulaResolvable`
- Existing `isFullFormulaActivatable` unchanged for Fetzladung / Großformel
