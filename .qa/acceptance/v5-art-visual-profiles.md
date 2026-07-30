# Feature: V5 art: item PNGs + visual profiles for all 36 formula cards

**Slug:** `v5-art-visual-profiles`  
**Issue:** #285  
**Design:** `.qa/design/v5-post-cutover-parity.md` (slice 6)

## Intent

Ship item card art PNGs and complete visual profiles (Technique/Essence/Catalyst visual contracts) for all 36 formula cards so Forge/Play/Build show dedicated art (no empty art path where a profile/PNG exists).

## Preconditions

- V5 pack exports 12+12+12 formula + 6 items
- Formula PNGs already under `public/cards/formula/`
- No Meshy API calls / credit spend in this slice

## Happy Path

- [ ] 6 item PNGs present under `public/cards/item/` and referenced via `resolveCardArtPath`
- [ ] All 36 formula cards have non-empty `visual` profile fields
- [ ] Play/Forge pack presentation includes items with art paths; no runtime errors on resolve
- [ ] typed-strict clean on touched files; no Meshy API calls required

## Edge Cases

- [ ] Missing PNG → empty art path or browser 404 fallback; UI does not crash
- [ ] VisualRecipe still composes without GLB (profiles are data-only)

## Regression

- [ ] Existing formula art paths unchanged
- [ ] Base-pack illustration paths unchanged
- [ ] `npm run checks` green

## Security Coverage

| Item | Status |
|------|--------|
| F-03 XSS via UGC | Out of scope — static committed PNGs + pack defs, no user HTML |
| P-04 secrets | Out of scope — no API keys; no Meshy/Higgsfield calls in shipped code |

## Assumptions

- Item art filenames match slug after `v5-item-` (e.g. `nasser-socken.png`)
- Visual profiles for formula cards may already be filled; this slice asserts + fills gaps
- Procedural or offline-generated PNGs are acceptable when AI connectors are unavailable (no Meshy spend)

## Screenshots

| Step | Filename |
|------|----------|
| 1 | (optional) Forge item card with art |

## Implementation Notes

<!-- filled after coding -->
