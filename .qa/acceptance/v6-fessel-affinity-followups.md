# Feature: V6 Fessel engine+UI + Affinity follow-ups

<!-- issues #342 + #356 — @implement -->

## Intent
1. Real V6 Fessel/intensity on formula components (§33.5 / §50.6 Slice 2) with Play UI + log.
2. Affinity spend also on Formelaktivierung (#356 / deferred from #341).
3. Affinity on Block only during own action turn — not when defending on opponent's turn.

No Play-Default flip. No V5 delete.

## Preconditions
- Match with `v6Formula` / `meta.v6FormulaEnabled`
- Fessel: opponent has at least one formula component
- Affinity: character affinity elements; budget once per own turn (`v6AffinityAvailable`)

## Happy Path
- [ ] Offensive Fessel primary applies intensity 1–3 to an enemy formula component
- [ ] Formelabwehr reduces Fessel intensity (stages); min 0 = no apply
- [ ] Own Startphase: Fessel effects (exhaust / activation lock / disturb) then intensity −1
- [ ] Play UI shows Fesselstufe on slot + German lastEvent / preview
- [ ] Formula activate offers Affinity when essence element matches; same PICK modes; spends budget
- [ ] Block Affinity only if `activePlayer ===` blocking player; defensive block on enemy turn does not offer
- [ ] Unit tests in `src/game/`; `npm run checks` green

## Edge Cases
- [ ] Intensity 0 after defense → no Fessel applied
- [ ] Affinity already spent → no formula offer
- [ ] V5 matches unchanged (no Fessel field effects; no V6 affinity)

## Out of scope
- Full Kettenfessel essence riders / target picker UI
- Echo/Delay, Konstrukte, recipe catalog (#343)
- Play-Default cutover; V5 delete

## Security Coverage
- F-03: typed actions; engine validates
- P-04: local-only

## Regression
- [ ] Existing V6 TEK damage / affinity attack tests still pass
- [ ] `npm run checks` green

## Screenshots
| Step | Filename |
|------|----------|
| 1 | (verify-ui optional — status chip) |

## Implementation Notes
- Engine Fessel: `src/game/engine/v6/fessel.ts` — intensity 1–3 on formula components; Startphase tick (exhaust / activation lock / disturb + decay); defense reduces intensity
- Playtest TE: Magiepanzer×Feuer → Glutfessel (`primary.kind: fessel`); generator regenerated
- UI: Formelplatz badge `⛓ Fessel N`, preview Intensität/Abwehr, lastEvent
- Affinity formula: pending `kind: 'formula'` after FORMULA_ACTIVATE when essence matches; same PICK modes
- Affinity block: `shouldOfferV6AffinityOnBlock` requires `activePlayer ===` blocker (no defense Affinity)
- Docs: spielkonzept §99 + changelog; issues #342 + #356
- Tests: `fessel.test.ts`, extended `affinity.test.ts`
