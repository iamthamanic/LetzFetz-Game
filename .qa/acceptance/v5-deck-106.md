# Feature: V5 pack: rematch main deck to concept 106

<!-- issue #284 -->

## Intent
Bring V5 main deck size to spielkonzept §3.1 target **106** (54 elements: 24+24+6).

## Happy Path
- [ ] `V5_PACK_MAIN_DECK_SIZE === 106` and equals built deck length.
- [ ] Element composition 24 attack + 24 block + 6 boost.
- [ ] Base/V1 pack still 60 elements.
- [ ] typed-strict clean.

## Edge Cases
- [ ] Deterministic shuffle under seeded RNG unchanged.

## Regression
- [ ] `npm run checks` green; BASE_PACK tests untouched.

## Assumptions
- V5 uses dedicated element defs (values 2/3/4/6 combat + one boost-3 per element), not BASE_PACK list.

## Screenshots
| Step | Filename |
|------|----------|
| 1 | n/a |

## Implementation Notes
- `src/game/packs/v5/elementCards.ts` — 54-card mix
- `v5-pack.ts` uses V5_ELEMENT_CARDS; version 0.3.0
