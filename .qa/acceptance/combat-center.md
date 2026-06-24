# Acceptance: combat-center (#12)

## Intent
Attacks and blocks render in the playmat combat zone with card faces and values.

## Criteria

- [x] `CombatStage` anchored to playmat combat zone
- [x] Human defender: block cards + „Nicht blocken“
- [x] Bot defender: read-only stage, no input freeze elsewhere
- [x] Challenge mode shows target bound card
- [x] E2E block flow uses `combat-stage`

## Validation

```bash
cd Letzfetzprototype && npm run checks
npx playwright test e2e/game-duel-board-ui.spec.ts
```
