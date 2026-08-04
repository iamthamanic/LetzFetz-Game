# Feature: V6 Passive-Skill naming + hand card type display

## Goal
1. Replace player-facing / docs term **Macke** with **Passive-Skill** (DE UI label `Passive-Skill` / plural `Passive-Skills`). Rename practical code ids (`macke*` → `passiveSkill*`, files `mackes.ts` → `passiveSkills.ts`).
2. Fix hand BoardCard mislabel: items and formula components must not render as **GLITCH**.

## Acceptance
### Naming
- [ ] Zero user-visible "Macke"/"Macken" in `src/features/`, `src/components/`, play rules, V6 spielkonzept + SPIELANLEITUNG
- [ ] Preferred term **Passive-Skill**; spielkonzept may note grill history "Macke" once
- [ ] Code: rename pack/engine modules + practical identifiers; remaining `macke` only if unavoidable and commented
- [ ] Changelog line in spielkonzept

### Card types
- [ ] Hand lookup resolves element → item → formula → glitch (no false glitch fallback)
- [ ] Items show type **Gegenstand** + correct name
- [ ] Katalysatoren/Techniken/Essenzen show **Katalysator** / Technik / Essenz (not GLITCH)
- [ ] Real glitches still show **Glitch**
- [ ] Regression test for hand view model / BoardCard presentation

### Gate
- [ ] `npm run checks` green
- [ ] PR opened (+ merge if green)

## Out of scope
- Changing V1 Bound vs V6 ruleset selection (Bau-Phase in screenshot may be Bound; type fix is independent)
- Heldenmodus / Passive-Pool A UI (#384)
