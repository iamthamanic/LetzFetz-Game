# Feature: V6 SPIELANLEITUNG_V6_DRAFT + AGENTS Kurzreferenz

**Issue:** #352  
**Slug:** `spielanleitung-v6-draft`

## Intent

Author `docs/rules/SPIELANLEITUNG_V6_DRAFT.md` from finalized spielkonzept; update AGENTS.md / `.cursor/rules` Kurzreferenz.

## Happy Path

- [ ] Draft Anleitung exists and matches spielkonzept (no invented rules)
- [ ] AGENTS Kurzreferenz points to V6 draft as product-goal prose
- [ ] `.cursor/rules` updated; Play-Default still V5 until #353

## Edge Cases

- Do not flip Play-Default to V6 in this ticket (#353)
- V5 docs remain as Legacy/Regression pointers

## Regression

- Existing V5/V1 anleitung paths still linked

## Security Coverage

- Out of scope — documentation only

## Assumptions

- spielkonzept is source of truth for locked playtest defaults

## Screenshots

N/A

## Implementation Notes

- Added `docs/rules/SPIELANLEITUNG_V6_DRAFT.md`
- Updated `AGENTS.md` Regelquellen + Kurzreferenz + Referenzen
- Updated `.cursor/rules/project-core.mdc` + `game-engine.mdc`
- Spielkonzept §99 / changelog marked #352
