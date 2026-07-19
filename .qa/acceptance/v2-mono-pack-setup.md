# Feature: Mono MB1 + P100 Pack Opt-in Setup

<!-- auto-generated for issue #47 on 2026-07-19 -->

## Intent

V2 Mono MB1 (+1 Angriff/+1 Block) when all three phrase slots share one element (Ladung ignored). GameSetup lets players opt into V2 P100 (100 cards, 30 LP). BASE_PACK default stays 20 LP. Cheatbox can still override LP/Mono.

## Happy Path

- [x] `phraseBonuses.ts` — `isMonoPhrase`, `monoAttackBonus`, `monoBlockBonus` (MB1 default)
- [x] V2 combat adds mono bonus on attack and block (`actions.ts`)
- [x] GameSetup: choose Basis-Pack (V1) vs V2 P100 Playtest (German labels)
- [x] P100 match starts with `P100_RULESET` (30 HP, 100-card deck)
- [x] BASE_PACK match unchanged (20 HP, 70-card deck)
- [x] Vitest for mono bonus helpers in `phraseBonuses.test.ts`
- [x] `npm run checks` green

## Edge Cases

- [x] Incomplete phrase (missing core/mode/tool) → no mono bonus
- [x] Mixed elements across phrase slots → no mono bonus
- [x] Charge slot ignored for mono detection
- [x] Pack choice only before match start (Setup → GameView state)
- [x] `playtest.monoBonusMode` mb2–mb4: MVP falls back to MB1 (+ comment in code)

## Regression

- [ ] V1 BASE_PACK solo still 20 LP, no mono bonus
- [ ] V2 passives/challenge/activate from #46 unchanged
- [ ] Cheatbox LP/Mono overrides still work in playtest mode

## Assumptions

- MB2–MB4 distinct combat effects deferred; stored mode still applies MB1 in MVP
- Default Setup selection = Basis-Pack (V1)
