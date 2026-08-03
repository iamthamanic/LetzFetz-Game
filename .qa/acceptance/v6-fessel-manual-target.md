# Feature: V6 Fessel / Kettenfessel manual target selection

<!-- follow-up after #342 / PR #357 — user chose manual Zielwahl -->

## Intent
When a V6 Fessel (e.g. Glutfessel / Kettenfessel) effect needs a target formula component, the attacker **picks** an occupied opponent slot via pending choice (Affinity-PICK style) — not auto Technik→Essenz→Katalysator.

## Preconditions
- Match with `v6Formula` / `meta.v6FormulaEnabled`
- Offensive Fessel primary with intensity ≥1 after Formelabwehr
- Opponent has ≥1 occupied formula slot (Technik / Essenz / Katalysator)

## Happy Path
- [ ] Fessel apply opens `pendingChoice.type === 'v6-fessel-target'` instead of auto T→E→K
- [ ] Legal actions: `PICK_V6_FESSEL_TARGET` only for **occupied** slots
- [ ] German UI modal lists only legal slots; empty slots omitted/disabled
- [ ] Pick applies intensity (max-merge) to chosen component; clears pending
- [ ] Bot picks heuristically (documented: Katalysator → Essenz → Technik)
- [ ] Affinity formula path still works: Affinity pick → execute → Fessel target pick
- [ ] Unit tests in `src/game/`; `npm run checks` green
- [ ] spielkonzept §99 / Fessel note: Zielwahl manuell

## Edge Cases
- [ ] Intensity 0 after defense → no pending, no apply
- [ ] Opponent board empty → no pending, no apply
- [ ] Single occupied slot → only that slot legal
- [ ] V5 matches unchanged

## Out of scope
- Recipe catalog (#343)
- Echo/Delay, Konstrukte, Play-Default cutover

## Security Coverage
- F-03: typed actions; engine validates occupied slot
- P-04: local-only

## Regression
- [ ] Existing Fessel tick / defense tests updated for pending target
- [ ] Affinity tests still pass
- [ ] `npm run checks` green

## Screenshots
| Step | Filename |
|------|----------|
| 1 | (verify-ui optional — modal) |

## Implementation Notes
- Engine: Fessel apply no longer auto T→E→K; `executeFormulaActivation` opens `pendingChoice: v6-fessel-target` when intensity ≥1 and opponent has occupied slots
- Action: `PICK_V6_FESSEL_TARGET` with `slot`; legal only for occupied slots via `occupiedFesselSlots`
- UI: German `PassiveChoiceModal` „Fessel-Ziel“ (Technik/Essenz/Katalysator, only occupied)
- Bot: prefers Katalysator → Essenz → Technik (`FESSEL_BOT_SLOT_PRIORITY`)
- Docs: spielkonzept intensity note + §99 locked + changelog
- Tests: `fessel.test.ts` pending/pick/bot/empty board; smoke clears fessel pending
