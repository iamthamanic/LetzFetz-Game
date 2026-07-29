# Acceptance: v5-formula-resolution

## Intent
Formelaktivierung resolves Technik→Essenz→Katalysator with prep hooks.

## Implementation Notes
- formulaResolve.ts + formulaEffects types
- PlayerState.formulaPrep; ignoreShield on PendingCombat
- rulesetOf reads MatchMeta v5Formula
- Vitest: tech-only, tech+essenz, full formula
