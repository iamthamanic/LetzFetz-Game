# Feature: V6 Affinität ±1 Engine (spend + legal + UI)

<!-- issue #341 — @implement -->

## Intent
Implement real V6 Affinity ±1 spend/bonus per `docs/letz-fetz-v6-spielkonzept.md` §28.1 (scaffold from #333). Engine-authoritative; German UI. No Play-Default flip. No V5 delete.

## Preconditions
- Match with `ruleset.v6Formula === true` / `meta.v6FormulaEnabled`
- Character has two affinity elements (`CharacterCardDef.elements`)
- Affinity available this own turn cycle (reset in own Startphase)

## Happy Path
- [ ] Under `v6Formula`, after playing a matching-element attack/block/challenge and rolling W6, player may spend Affinity once
- [ ] Modes: Wert +1 **or** own W6 ±1 (after roll); skip allowed
- [ ] Second spend same cycle rejected; resets on own Startphase (`resetTurnMeta`)
- [ ] Automatic V1/V5 `characterElementBonus` (+1 every match) is **off** under `v6Formula`
- [ ] Legal actions expose `PICK_V6_AFFINITY`; German UI modal
- [ ] Unit tests in `src/game/`; `npm run checks` green
- [ ] No Default-Flip; V5 matches unchanged

## Edge Cases
- [ ] Wrong element → no affinity offer
- [ ] Affinity already spent → no offer
- [ ] Dice ±1 clamped 1–6 via `modifyDieRoll`; value recomputed from dice-bonus delta
- [ ] V5 ruleset: auto element bonus still applies; no V6 affinity pending

## Out of scope
- Formula-activate affinity (card combat first; formula follow-up)
- Passive/Macke same-action exclusion (no passives in V6 yet)
- Play-Default cutover; V5 delete

## Assumptions
- **§99:** „pro Runde“ = einmal pro eigenem Zug/Durchlauf — Affinity resets at own Startphase and may be spent on own attack/challenge **or** own block while defending before next own start
- Formula Affinity deferred

## Security Coverage
- F-03: typed actions; engine validates spend
- P-04: local-only

## Regression
- [ ] V5 combat still gets automatic character element +1
- [ ] `npm run checks` green

## Screenshots
| Step | Filename |
|------|----------|
| 1 | (verify-ui if Play modal) |

## Implementation Notes
- Engine: `src/game/engine/v6/affinity.ts` + pending `v6-affinity` / `PICK_V6_AFFINITY`
- Auto `characterElementBonus` off under `v6Formula`; spend after W6 on attack/block/challenge
- Reset: `resetTurnMeta` sets `v6AffinityAvailable[active]=true`
- UI: Affinity modal in `PlayView.tsx` (German)
- Tests: `src/game/engine/v6/affinity.test.ts`
- Formula-activate Affinity deferred
