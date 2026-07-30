# Feature: V5 items: full effect parity + reaction items in combat UI

<!-- seeded for issue #282 — @implement -->

## Intent
All 6 V5 Gegenstände resolve with spielkonzept §21 effects (no text-only stubs). Reaction-timing items appear and are playable in the combat block window.

## Happy Path
- [ ] Each of the 6 `V5_ITEMS` has a resolving engine path (action or reaction).
- [ ] Kaputter Rückspiegel is offered as `PLAY_ITEM` while defender in combat; −1 Angriffswert; Vollblock → Verstrahlt (`erleuchtet`) on attacker.
- [ ] Combat UI shows reaction items with DE labels when legal.
- [ ] Unit tests cover each item kind; typed-strict clean.

## Edge Cases
- [ ] Reaction item illegal outside combat window / wrong timing.
- [ ] Action items only in action phase (existing gate).
- [ ] Halbe Dose Energy hangover: −1 HP at start of next own turn.
- [ ] Nasser Socken: next attack gets water impulse + Durchnässt if no reaction.

## Regression
- [ ] Existing PLAY_ITEM paths (Nagel, Pilz, Kabelbinder) still work.
- [ ] `npm run checks` green.

## Assumptions
- Verstrahlt = engine id `erleuchtet` (PRIMARY_MARK_LABEL_DE).
- Reaction item play does not replace block/pass — defender may still block after using item.
- Bot: may play Rückspiegel when legal (prefer if attackValue ≥ 2).

## Screenshots
| Step | Filename |
|------|----------|
| 1 | n/a (engine + combat affordance; verify-ui optional) |

## Security Coverage
- F-03 / B-01 / secrets: N/A — pure local rules engine + Play UI, no auth/network/UGC ingest.
- Engine remains authoritative; UI only dispatches legal `PLAY_ITEM`.

## Implementation Notes
- Action items: Nasser Socken (extraHitImpulse water + markIfNoReaction), Halbe Dose Energy (v5EnergyHangover at start), existing Nagel/Pilz/Kabelbinder kept.
- Reaction: Kaputter Rückspiegel via PLAY_ITEM in combat (−1 attackValue, rueckspiegelArmed → Verstrahlt/`erleuchtet` on Vollblock).
- UI: CombatStage shows Reaktions-Gegenstände buttons; bot prefers item when attackValue ≥ 2.
- Tests: `src/game/engine/v5Items.test.ts`
