# Feature: V6 PLAYABLE-Prep — characters strip V5 passives/ultis + affinity scaffold

**Issue:** #333  
**Design:** `docs/letz-fetz-v6-spielkonzept.md` §28.1–28.2

## Intent
V6 pack ships dedicated character defs: no V5 passive copy, no ultimates, affinity = two character elements (scaffold only). Engine does not offer/apply PLAY_ULTIMATE under `v6Formula`. Play-Default stays V5.

## Preconditions
- Slice 0/1 on main (`V6_CORE_PACK`, `v6Formula` identity).
- Base character ids reused for setup continuity.

## Happy Path
- [ ] `V6_CORE_PACK.characters` are V6 defs (not raw BASE_PACK with V5 passive/ulti ids)
- [ ] Each character has two affinity elements (`elements` tuple); passiveText is V6 scaffold copy (no V5 passive wording)
- [ ] `V6_CORE_PACK.ultimates` empty; character `ultimateId` empty / unresolved
- [ ] `getLegalActions` under V6 never offers `PLAY_ULTIMATE`; apply throws if forced
- [ ] `createGame` V6: `ultimateAvailable === false`
- [ ] Unit tests in `src/game/packs/v6/` (+ engine smoke)
- [ ] `npm run checks` green

## Edge Cases
- [ ] V5 pack unchanged (passives/ultis intact)
- [ ] V6 character ids still match setup carousel ids

## Out of scope
- Affinity ±1 engine action
- Passive-Pool / Macken
- Play-Default cutover

## Security Coverage
| Item | Status |
|------|--------|
| F-03 content typed | Pack characters typed CharacterCardDef |
| P-04 local-only | No remote trust |
| B-01 secrets | N/A — no secrets |

## Implementation Notes
- Added `src/game/packs/v6/characters.ts` — V6 cast with affinity scaffold text, empty `ultimateId`
- `V6_CORE_PACK` uses `V6_CHARACTERS`; ultimates stay `[]`
- `createGame`: `ultimateAvailable=false` under v6Formula
- `getLegalActions` / `PLAY_ULTIMATE`: blocked under v6Formula
- Tests: pack + `v6NoUltimate.test.ts`
- Spielkonzept PLAYABLE-Prep tracking line for #333–#336

