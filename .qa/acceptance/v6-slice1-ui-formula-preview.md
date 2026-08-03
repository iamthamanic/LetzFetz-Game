# Feature: V6 Slice-1 UI formula preview

## Intent
Preview renders `planFormulaActivation` only (German); hard-gate preview ⊆ plan.

## Happy Path
- [x] formatV6FormulaPlanPreview + V6FormulaActivationPreview
- [x] PlayView shows preview when V6 + FORMULA_ACTIVATE legal
- [x] hard-gate unit test; Play-Default stays V5
