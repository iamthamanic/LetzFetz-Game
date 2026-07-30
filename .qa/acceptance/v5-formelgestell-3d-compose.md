# Feature: V5 visual: Formelgestell 3D compose pipeline (replace soft-retired Fetz-3D)

**Slug:** `v5-formelgestell-3d-compose`  
**Issue:** #287  
**Design:** `.qa/design/v5-post-cutover-parity.md` (slice 8)

## Intent

Compose Formelgestell from VisualRecipe (Technik core + Essenz vessel + Katalysator ring) as the V5 default visual path, replacing soft-retired Fetz-3D Bound display. Prefer CSS/placeholder compose when Meshy GLBs are missing.

## Preconditions

- `buildVisualRecipe` + FormulaRig chips already exist (#226)
- `shouldShowBoardEngineLiveZone(true) === false` (soft-retire)

## Happy Path

- [ ] V5 Play default uses formula compose path (composed vessel/core/ring, not Bound/Fetz-3D)
- [ ] Soft-retired Fetz-3D not shown for V5 matches
- [ ] Smoke test covers compose layers from VisualRecipe
- [ ] typed-strict clean; placeholders OK without Meshy

## Edge Cases

- [ ] Empty formula → empty gestell message, no crash
- [ ] Technik-only → core layer only, vessel/ring idle
- [ ] prefers-reduced-motion: no required motion

## Regression

- [ ] Base / V3 matches still may show BoardEngineLiveZone
- [ ] FormulaRig challenge targeting still works
- [ ] `npm run checks` green

## Security Coverage

| Item | Status |
|------|--------|
| F-03 XSS | Out of scope — static DE labels from pack defs / enums |
| P-04 secrets | Out of scope — no network / Meshy |

## Assumptions

- Full Meshy GLB Formelgestell deferred (#286 needs-human); this slice ships property-driven compose UI + gate
- Compose lives in play/board (no Feature→Feature)

## Implementation Notes

<!-- filled after coding -->
