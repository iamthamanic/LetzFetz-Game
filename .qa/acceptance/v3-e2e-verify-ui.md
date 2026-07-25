# Acceptance — v3-e2e-verify-ui

## Checks
- [x] Playtest can enable V3 via cheatbox (`v3CombatEnabled` → `rulesetFromState`)
- [x] Status chips visible for Brennen (V3 Demo)
- [x] Reaction modal for Inferno/Dampf; Escape does **not** dismiss (mandatory)
- [x] Engine smoke: mono Inferno + mixed Dampf
- [x] Evidence under `.qa/evidence/v3-e2e-verify-ui/`
- [x] `npm run checks` green
- [x] No type escape hatches

## Modal Escape / Cancel policy
`ReactionPickModal` uses empty `onClose` — backdrop/Escape must not cancel. Player must pick a reaction button.
