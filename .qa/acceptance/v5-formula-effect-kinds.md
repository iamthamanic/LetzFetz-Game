# Feature: V5 engine: resolve remaining formulaEffect kinds (no more stubs)

<!-- seeded by ecc-runner from issue #280 on 2026-07-30 — @implement refined -->

## Intent
Every shipped V5 `formulaEffect.kind` on technique/essence/catalyst cards must resolve in the engine — no silent no-ops or pack stubs that only carry `effectText`.

## Happy Path
- [x] Inventory of all `formulaEffect.kind` values used in V5 pack; each has resolve + at least one unit test.
- [x] No card ships `formulaEffect` that is ignored by `resolveFormulaActivate` / combat consume helpers.
- [x] `npm run checks` green; touched files typed-strict clean.
- [x] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases
- [x] Disturbed/exhausted components skip (existing resolve guards)
- [x] Teilformel (2 slots) vs Vollformel
- [x] Prep consume: impulseOnTie, prep_boost, chain_same_action, reactionDamageBonus, w6 on block

## Regression
- [x] Existing formulaResolve + pack + effects tests still pass (`npm run checks`)

## Assumptions
- Optional player choices for invert/offer remain auto-heuristic (KISS); effects still apply
- Safety valve cancels pending self-damage / clears mark; formula card discard for Sofortzünder deferred

## Screenshots
| Step | Filename |
|------|----------|
| 1 | n/a (engine-only) |

## Implementation Notes
- Extended consume path in `actions.ts` / `effects.ts` / `reactionOutcomes.ts`
- Helpers: `takeBoostPrepBonus`, `armChainSameAction`, `takeChainSameActionBonus`, `takeReactionDamageBonus`
- Meta: `v5ChainSameAction`; prep: `preparedActionType`
- Spiegelung instant shield-gain deals mirror thorns immediately
- Vitest coverage expanded in `formulaResolve.test.ts`
