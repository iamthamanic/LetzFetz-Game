# Acceptance — V1 Arena effects + playable Glitches

## Intent
Rules Engine enforces Letz Fetz V1 arena rules and playable glitch cards so chat/UI playtests match the rulebook for those layers (not only card text).

## Preconditions
- Base pack loaded; `createGame` with any arena
- Match uses `src/game/` applyAction / getLegalActions

## Happy Path
1. Späti: playing a boost **must** draw-then-discard once per turn (not skippable); 3rd boost per player **must** immediately bind; fire boost damage capped at 3
2. Playable glitch on own turn (e.g. Kurzschluss) is a legal main-action alternative and resolves its effect
3. Sofort-Glitch on draw phase (and opening deal) resolves immediately and does not stay in hand
4. Sumpf challenge margin and Vulkan end-of-turn / roll hooks apply when that arena is active; Sumpf full-block draw/discard is mandatory
5. Arena effects that grant draw/discard or extra bind cannot be skipped via PASS_PENDING

## Edge Cases
- Nein, Bruder: opponent may cancel a boost before its effect; boost still counts as “played” for Späti 3rd-boost tracking
- Rückkopplung: only vs attack damage, not boost/ulti/glitch
- Schlechter Empfang: blocks voluntary extra draws until end of opponent’s next turn; Sofort-Glitch draws still resolve
- Arena swap (Riss): old arena effects end; new W6 arena rolls variant

## Out of Scope (this ticket)
- Full character passives / element synergies (separate follow-up unless already trivial)
- Full Game UI affordances for every new action (engine + legal actions first; chat-match driver updated)

## Validation
```bash
cd Letzfetzprototype && npm run checks
```

## Implementation Notes
- `GameState.meta` + `pendingChoice` for arena timers and interrupt windows
- `src/game/engine/arena.ts` — Späti/Kristall/Vulkan/Sumpf/Club/Basar hooks
- `src/game/engine/playableGlitches.ts` — own-turn + Nein Bruder / Rückkopplung reactions
- Opening Sofort-Glitches resolved in `createGame`
- Wired via `actions.ts` getLegalActions/applyAction; bot passes pending with PASS_PENDING
- Out of scope still: character passives, element synergies (2/3 bound)
- Validation: `npm test` 161 passed; `npm run build` OK
