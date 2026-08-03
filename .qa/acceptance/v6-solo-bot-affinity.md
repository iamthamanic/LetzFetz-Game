# Feature: V6 Solo-Bot Affinity / V6 priorities

**Issue:** #351  
**Slug:** `v6-solo-bot-affinity`

## Intent

Update heuristic + LLM bot digest so Solo Bot spends Affinity when beneficial and follows V6 priorities (playbook digest).

## Happy Path

- [ ] Bot picks `PICK_V6_AFFINITY` with a mode that increases combat/formula value when offered
- [ ] Bot chooses `none` when no mode increases value (e.g. dice-plus at roll 6 with only wasteful options filtered via apply)
- [ ] LLM system prompt includes `V6_BOT_PLAYBOOK_DIGEST` when V6 match
- [ ] Unit tests cover affinity choice path; `npm run checks` green

## Edge Cases

- Block Affinity: spend only if it reduces incoming damage (or saves from lethal)
- Formula Affinity: prefer `value-plus` when delta > 0
- V6 build phase uses formula heuristics (not V1 `BUILD_CARD` only)

## Regression

- V5 formula bot heuristics still pass (`bot.formula.test.ts`)
- Affinity engine tests unchanged (`affinity.test.ts`)

## Security Coverage

- Out of scope: F-*/B-*/P-* — pure local heuristic / no network secrets in engine

## Assumptions

- Affinity engine (#341) already exposes legal `PICK_V6_AFFINITY` actions
- Bot is always `p2` in solo

## Screenshots

N/A (engine-only)

## Implementation Notes

- Added `docs/rules/V6_BOT_PLAYBOOK.md` + `src/game/engine/v6BotPlaybook.ts` (`V6_BOT_PLAYBOOK_DIGEST`, `pickBeneficialV6AffinityMode`)
- `chooseBotAction` uses beneficial Affinity picker; V6 build/challenge use formula heuristics; no PLAY_ULTIMATE under V6
- LLM: `buildLlmBotSystemPrompt(state)` appends digest under `v6Formula`
- Tests: `src/game/engine/bot.affinity.test.ts`