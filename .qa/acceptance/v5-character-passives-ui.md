# Feature: V5 characters: implement deferred passives + choice UIs (§25)

## Intent
Wire remaining V5 §25 character passives beyond copy + the minimal Knusper/Schluck/Stiernacken hooks — including passives that need pending-choice UI.

## Happy Path
- [x] All 7 §25 passives have an engine hook (or documented N/A with test proving gate).
- [x] Choice UIs for Pillendoktora + Mysterium (DE labels).
- [x] Unit tests for ≥5 character passive paths.
- [x] typed-strict clean on touched files

## Edge Cases
- [x] Once-per-turn gates via `v5PassiveUsed`
- [x] Pending choice blocks illegal actions
- [x] Bot auto-picks Pillendoktora / Mysterium

## Regression
- [x] Existing Knusper/Schluck/Stiernacken tests still pass

## Assumptions
- Knusper remains auto discard/draw (no optional UI) — documented as playtest KISS
- Mysterium: pick before attack (replay attack after pick); override lasts until next start

## Screenshots
| Step | Filename |
|------|----------|
| 1 | n/a (engine + modal; verify-ui optional) |

## Implementation Notes
- New pending: `pillendoktora-boost`, `mysterium-element`
- Actions: `PICK_PILLENDOKTORA`, `PICK_MYSTERIUM_ELEMENT`
- UI: `PassiveChoiceModal` in PlayView
- Kokabell / Dripministerin engine-auto; Drip uses `must-discard` source `dripministerin`
