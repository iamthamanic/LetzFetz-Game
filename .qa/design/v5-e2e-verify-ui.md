# Design — V5 E2E / verify-ui (#233)

## Decision

Add a focused Playwright smoke mirroring the V3 verify-ui pattern. Seed Formel + Angriff via playtest patch that **moves** instances from deck (invariant-safe). Fix MatchIntro initiative rebuild so V5 ruleset is not dropped.

## Approach

- Spec under `e2e/v5-e2e-verify-ui.spec.ts` + evidence dir
- `demoV5FormulaReady` playtest button on V5 matches
- Preserve `V5_PACK_RULESET` in `onInitiativeResolved`

## Non-goals

- Broader e2e suite / CI gate change beyond documenting the command
