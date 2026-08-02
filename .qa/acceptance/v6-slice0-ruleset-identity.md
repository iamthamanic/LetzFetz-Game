# Feature: V6 Slice 0 — ruleset flag + MatchRulesetIdentity (INTERNAL)

**Issue:** #310  
**Slug:** `v6-slice0-ruleset-identity`

## Intent
Introduce an INTERNAL-only V6 ruleset identity (`v6Formula` / `V6_RULESET` / `isV6FormulaEnabled`) and wire it through matchMeta + `rulesetFromState` / `actionsContext`, with mutual exclusion vs `v5Formula`. No playable menu, no formula composer.

## Preconditions
- V5 ruleset path exists and is Play-Default.
- No UI/menu changes in this ticket.

## Happy Path
1. Tests construct a match with `V6_RULESET` / `meta.v6FormulaEnabled`.
2. `rulesetFromState` / `rulesetOf` resolve V6 identity.
3. `isV6FormulaEnabled` true; `isV5FormulaEnabled` false.
4. Play setup unchanged (V5 default).

## Edge Cases
- Both `v5Formula` and `v6Formula` true → hard throw.
- Default / V5 createGame must not set `v6FormulaEnabled`.

## Acceptance

- [ ] `RulesetConfig.v6Formula`, `V6_RULESET`, `isV6FormulaEnabled` exported
- [ ] Mutual exclusion enforced + unit-tested
- [ ] `matchMeta.v6FormulaEnabled` + `MatchRulesetIdentity` wired through `rulesetFromState` / `actionsContext`
- [ ] V5 regression green; no Play menu / formula composer changes
- [ ] `npm run checks` green; typed-strict on touched files

## Out of scope
- V6 playable menu, recipe generator, gameplay

## Security Coverage
- F/B/P checklist: N/A (engine types/flags only; no auth/UGC/network)

## Implementation Notes
- Added `v6Formula`, `V6_RULESET`, `isV6FormulaEnabled`, `MatchRulesetIdentity`, `assertExclusiveFormulaRuleset`, `matchRulesetIdentityFrom`.
- Wired `matchMeta.v6FormulaEnabled`, `rulesetFromState`, `createGame`, `rulesetOf` in `actions.ts`.
- Vitest: `src/game/engine/v6RulesetIdentity.test.ts` (7 cases). No UI/menu changes.
- `npm run checks` green after installing missing `@xyflow/react` locally (env only).
