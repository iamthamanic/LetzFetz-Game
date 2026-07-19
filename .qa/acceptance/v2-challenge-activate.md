# Feature: V2 Challenge W1 + Passive + Activate

<!-- auto-generated for issue #46 on 2026-07-19 -->

## Intent

V2 challenge targets one phrase part using printed `resistance` (W1), not element `value`. Light passives `p_atk` / `p_block` add +1 per matching built phrase part. Activate A1: discard 1 hand + exhaust + `a_dmg` / `a_heal` / `a_exhaust`. Charge slot not challengeable. V1 element-bound activate unchanged.

## Happy Path

- [x] `phraseBonuses.ts` — resistance, passive counts, activate archetypes
- [x] Challenge uses `EnginePartCardDef.resistance` for phrase targets
- [x] Challenge excludes charge slot (legal actions + apply guard)
- [x] `p_atk` / `p_block` bonus on attack/block/challenge values (V2 only)
- [x] `ACTIVATE_BOUND` resolves `activateArchetype` for engine parts
- [x] `a_dmg` (2 dmg), `a_heal` (2 heal), `a_exhaust` (opponent phrase part)
- [x] Vitest in `phraseBonuses.test.ts`
- [x] `npm run checks` green

## Edge Cases

- [x] Challenge fails when attack ≤ printed resistance + block
- [x] Exhausted engine part cannot activate
- [x] V1 challenge still uses element card `value`
- [x] V1 `ACTIVATE_BOUND` still uses element effect path

## Deferred

- [ ] `p_draw` — per-turn post-build draw/discard tracking (SPIELANLEITUNG_V2 D31); commented in `phraseBonuses.ts`

## Regression

- [ ] V1 `challenge.test.ts` still passes
- [ ] V1 `actions.test.ts` bind/activate flows unchanged
