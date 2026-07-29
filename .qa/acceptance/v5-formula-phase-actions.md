# Acceptance: v5-formula-phase-actions

## Intent
Under v5Formula, build phase is Formelphase with FORMULA_BUILD/REPLACE/ACTIVATE/SCHNELLMIX/SKIP.

## Happy Path
- [x] FORMULA_* actions legal under v5Formula
- [x] BUILD_CARD illegal under v5Formula
- [x] V1 BUILD_CARD regression without flag
- [x] Activate exhausts components (resolution stub for #221)
- [x] npm run checks
- [x] typed-strict

## Implementation Notes
- Actions + formulaSlots helper
- MatchMeta.v5FormulaEnabled + rulesetFromState
- Activate stub exhausts only — full effects in #221
