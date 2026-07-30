# Design: v5-character-grossformel

**Issue:** #229  
**Epic:** `.qa/design/v5-formula-migration.md`

## Intent
V5 pack ships §25 DE Passive + Großformel copy for all 7 characters; engine hooks passives/ultis for formula board where needed.

## Decision (Ponytail)
- Override characters/ultimates only in `V5_PACK` (Base texts stay for V1).
- Reuse ultimate IDs; branch `applyUltimateEffect` on `v5Formula` for formula-aware aftermath (build/upright/disturb).
- Implement 3 engine-tested passives: Schluckspecht Vollblock-Heal, Knuspergnom Formel-Filter (auto once/turn), Stiernacken Revenge-Bonus (+1, max +2).
- Other passives: DE copy only this slice (hooks deferred).

## Non-goals
Pillendoktora choice UI, Mysterium element rewrite, Dripministerin discard-draw UI, Kokabell heal-stability UI.
