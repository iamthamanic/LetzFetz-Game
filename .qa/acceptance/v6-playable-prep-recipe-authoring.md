# Feature: V6 PLAYABLE-Prep — harden Slice-1 recipe authoring

**Issue:** #334

## Intent
Replace stub/placeholder player-facing copy in Slice-1 authoring; keep fail-closed generator. No full-catalog expansion.

## Happy Path
- [ ] No authoring `summary`/`name` contains `stub` (case-insensitive)
- [ ] TK/EK bases have German display names (not `TK tech+cat` machine labels)
- [ ] Wasser rider summary is playable DE copy (no stub note)
- [ ] Validation rejects stub wording; completeness gate unchanged
- [ ] Regenerated `formulaRecipes.generated.ts` matches authoring
- [ ] `npm run checks` green

## Out of scope
- Full recipe catalog beyond Slice-1
- Echo/Delay/Konstrukte
- Bot

## Security Coverage
| Item | Status |
|------|--------|
| Content local typed | Authoring schemas + fail-closed assert |
| No remote eval | Generator local only |

## Implementation Notes
- German TK/EK display names; Wasser rider + catalyst transform summaries without stub
- `assertPlayableCopy` rejects stub / `TK `|`EK ` labels in validate
- Regenerated `formulaRecipes.generated.ts` (105 recipes)
