# Feature: V6 Slice-1 match lifecycle

## Intent
Opening 7→keep 5/6; start phase T/E upright only (catalyst never restores).

## Happy Path
- [x] V6 openingDrawCount 7 → keep 5/6, remainder reshuffled
- [x] restoreOwnerFormulaAtStartV6: T/E upright, catalyst stays exhausted
- [x] V5 opening unchanged; checks green
