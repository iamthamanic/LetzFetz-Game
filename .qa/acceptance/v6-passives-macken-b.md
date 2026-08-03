# Feature: V6 Passives / Macken — Option B feste Charakter-Macken

<!-- issue #349 — @implement -->

## Intent
Lock **Option B** (feste Mikro-Passive pro Charakter) per spielkonzept §28 / §99 for first playable V6. No shared pre-match pool UI. No Play-Default flip. No V5 delete.

## Preconditions
- Match with `ruleset.v6Formula === true` / `meta.v6FormulaEnabled`
- V6 character has `mackeId` + `mackeName` + Macke `passiveText`
- Affinity scaffold (#341) already present on `elements`

## Happy Path
- [ ] Each V6 character ships exactly one feste Macke (grill Alt-B texts)
- [ ] Engine hooks fire 1×/own turn cycle under budget (§28.4); tracked via `meta.v6MackeUsed`
- [ ] German UI shows Macke on character detail; match plate shows Macke name; Spielregeln updated
- [ ] §99 records decision **B** (+ reason: simpler first playable)
- [ ] Unit tests in `src/game/`; `npm run checks` green
- [ ] No Default-Flip; V5 passives unchanged

## Edge Cases
- [ ] Macke already used this cycle → no second trigger
- [ ] Empty deck → scry no-ops safely
- [ ] Empty hand → Stiernacken / Pillendoktora degrade gracefully
- [ ] V5 ruleset → V6 Macke hooks no-op
- [ ] Falsche Farbe expands Affinity eligibility once; Affinity ±1 still the spend (not a second ±1 stack)

## Out of scope
- Option A Passive-Pool draft UI / pre-match pick
- 2. Formeländerung Abwurf-Kosten (engine may still lack cost; Resteverwertung fires on 2nd change count)
- Play-Default cutover; V5 delete
- Hybrid A+B

## Assumptions
- Prefer B over A for ship despite §28.3 “bevorzugt A” — user + first-playable YAGNI (no pool UI)
- Scry: pending `v6-macke-scry` with keep / bottom / swap
- Same-action mutex: trigger-Macken after resolution; Falsche Farbe enables Affinity rather than stacking a second combat modifier

## Security Coverage
- F-03: typed actions; engine validates Macke spend / pending
- P-04: local-only

## Regression
- [ ] V5 character passives still work under `v5Formula`
- [ ] Affinity (#341) unchanged except Falsche Farbe eligibility expand
- [ ] `npm run checks` green

## Screenshots
| Step | Filename |
|------|----------|
| 1 | (verify-ui if Play modal) |

## Implementation Notes
- Option B locked in `docs/letz-fetz-v6-spielkonzept.md` §28.3 / §99
- Data: `src/game/packs/v6/mackes.ts` + `mackeId`/`mackeName` on `CharacterCardDef`
- Engine: `src/game/engine/v6/mackes.ts` — hooks + `v6-macke-scry` pending; Affinity expand via Falsche Farbe
- UI: Character detail label „Macke“, plate badge, Scry modal, Spielregeln V6 text
- Tests: `mackes.test.ts` + updated `v6-pack.test.ts`
- No Default-Flip; V5 passives untouched
