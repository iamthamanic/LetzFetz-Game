# Acceptance: dice-roll-feedback (#13)

## Intent
W6 roll animates in combat with correct +0/+1/+2 bonus from engine rules.

## Criteria

- [x] `CombatDiceRoll` in `CombatStage` uses `combat.attackRoll` (authoritative)
- [x] CSS tumble animation; static reveal when `prefers-reduced-motion`
- [x] Bonus label matches `diceBonusFromRoll` / rulebook table
- [x] E2E block flow asserts `combat-dice-roll` + `combat-dice-bonus`

## Validation

```bash
cd Letzfetzprototype && npm run checks
npx playwright test e2e/game-duel-board-ui.spec.ts
```
