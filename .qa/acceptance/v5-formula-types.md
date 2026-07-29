# Feature: V5 types: formula slots, card kinds, visual contracts, ruleset flag

<!-- seeded by ecc-runner from issue #219 on 2026-07-29 — @implement may refine -->

## Intent
Typen und Ruleset-Flag für Formelplätze, neue Kartenarten und Visual-Vertrag ohne Gameplay-Verhalten.

## Happy Path
- [ ] - [ ] Card kinds: technique | essence | catalyst | item (oder gleichwertig) typisiert.
- [ ] - [ ] RulesetConfig.v5Formula (oder äquivalent) + Helper.
- [ ] - [ ] TechniqueVisual / EssenceVisual / CatalystVisual exportiert.
- [ ] - [ ] Vitest kompiliert; typed-strict clean auf touched files.
- [ ] - [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases
- [ ] (from .qa/edge-cases.md + @implement)

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
- Added formulaVisual.ts contracts + VisualRecipe
- Card kinds technique/essence/catalyst/item + FormulaComponentInstance + FormulaBoard on PlayerState
- Ruleset: v5Formula, V5_RULESET, maxFetzChargeFor (3 vs legacy 6)
- createGame initializes empty formula board
