# Feature: V6 Slice 1 engine plan/execute

## Intent
INTERNAL V6 `planFormulaActivation` → revalidate → execute; FORMULA_ACTIVATE under v6Formula; catalyst discard; TEK-only fetz; defense bands; post-formula lock.

## Happy Path
- [x] plan/execute exist; FORMULA_ACTIVATE under v6
- [x] catalyst discarded; TEK fetz max 1/turn; defense 5–6 = −2 + suppressible rider
- [x] Post-Formula-Action-Policy blocks attack/challenge
- [x] no V5 formulaCombinations import; V5 regression green; checks green

## Implementation Notes
- `src/game/engine/v6/*` lookup-only from generated recipes
- Meta: `v6FetzGainedThisTurn`, `v6PostFormulaActionLock` (cleared on END_TURN)
