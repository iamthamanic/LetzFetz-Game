# Feature: V6 PLAYABLE-Prep — Spielregeln + Kartenkatalog

**Issue:** #335

## Intent
When active match is `v6Formula`, Spielregeln modal shows V6 rule sections + V6 pack catalog (DE). V5 unchanged outside V6 matches.

## Happy Path
- [ ] `variant="v6"` → V6 sections + V6 catalog; title Spielregeln (V6)
- [ ] `variant="v5"` (default) → existing V5 behavior
- [ ] PlayView reports variant from match state to App
- [ ] Tests for V6 sections + catalog builder
- [ ] `npm run checks` green

## Security Coverage
| Item | Status |
|------|--------|
| Comments localStorage | unchanged |
| No secrets | n/a |

## Implementation Notes
- `playRulesSectionsV6.ts`, catalog `v6` branch, `PlayRulesModal.variant`, App wiring
