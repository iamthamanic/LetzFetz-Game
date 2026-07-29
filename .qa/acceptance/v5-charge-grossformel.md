# Acceptance: v5-charge-grossformel

**Issue:** #223  
**Slug:** `v5-charge-grossformel`  
**Design:** `.qa/design/v5-formula-migration.md`

## Intent

Unter `v5Formula`: volle erfolgreiche Formelaktivierung gibt +1 Fetzladung (max 3). Großformel (`PLAY_ULTIMATE`) nur bei charge===3; danach Ladung 0, Katalysator abgelegt, Tech/Essenz erschöpft, einmalig verbraucht.

## Preconditions

- Match with `v5Formula`; Formelboard with Technik+Essenz+Katalysator upright/non-disturbed for charge gain.
- For Großformel: `fetzCharge === 3` and `ultimateAvailable`.

## Happy Path

1. FORMULA_ACTIVATE on full formula → `fetzCharge` +1 (capped at 3).
2. Partial activate (tech only) → no charge gain.
3. PLAY_ULTIMATE legal only at charge 3; after: charge 0, katalysator discarded, tech/essenz exhausted, ultimateAvailable false.
4. Second PLAY_ULTIMATE illegal.

## Edge Cases

- Cap at 3 (gain when already 3 stays 3).
- V3/V1 without v5Formula: ultimate still without charge gate; charge pool max 6.
- Prevented activation (throw / nothing usable) → no charge.

## Acceptance Criteria

- [ ] MAX charge 3 unter v5Formula.
- [ ] Ladung nur bei voller erfolgreicher Formelaktivierung.
- [ ] Großformel legal nur bei charge===3 und noch nicht verbraucht.
- [ ] Vitest für Cap, Gain, Gate, Nachwirkung.
- [ ] Touched files: zero type escape hatches

## Security Coverage

Engine-only — Secure-by-Default checklist OOS (no auth/UGC/network).

## Screenshots

N/A — engine-only.

## Implementation Notes

## Implementation Notes

- `formulaCharge.ts`: isFullFormulaActivatable + applyGrossformelAftermath
- `fetzCharge.ts`: optional maxCharge (default 6; V5 uses 3 via maxFetzChargeFor)
- FORMULA_ACTIVATE full → +1 charge; PLAY_ULTIMATE gated at charge===3 under v5Formula
- Vitest: formulaCharge.test.ts (+ V1 ultimate regression)
