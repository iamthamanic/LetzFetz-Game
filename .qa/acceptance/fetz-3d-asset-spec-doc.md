# Acceptance: fetz-3d-asset-spec-doc

**Issue:** #182  
**Slug:** `fetz-3d-asset-spec-doc`  
**Runtime:** Local docs only

## Intent

Document the binding Fetzgerät 3D asset specification (sockets, budgets, material names, preview contract) as `docs/engine-system/asset-specification.md`, derived from the brief and existing spec JSONs — so authors and CLI share one human-readable truth.

## Preconditions

- ADR `docs/engine-system/architecture.md` exists (D1–D5)
- `SOCKETS_BY_SLOT` in `src/services/engineAssets/slotSockets.ts` is authoritative
- Spec stubs under `docs/engine-system/specs/*.json` exist for 36 parts

## Happy Path

1. Technical artist opens `docs/engine-system/asset-specification.md`
2. Doc lists slot sockets, budgets, naming, preview paths, pilot vs placeholder
3. Cross-links from architecture / adding-a-new-part / asset-pipeline resolve

## Acceptance Criteria

- [ ] `docs/engine-system/asset-specification.md` exists with sockets, budgets, material/preview contract
- [ ] Links from architecture / adding-a-new-part / asset-pipeline updated
- [ ] No contradiction with ADR D1–D5 / `slotSockets.ts` (no invented socket names)
- [ ] Touched files: zero type escape hatches

## Edge Cases

- Do not invent socket names beyond `SOCKETS_BY_SLOT`
- Pilot vs placeholder clearly separated (#165)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets in client | N/A — docs only |
| B-01 / B-04 auth | N/A |
| P-04 secrets in git | N/A — no secrets |

## Implementation Notes

- Added `docs/engine-system/asset-specification.md` (sockets from `SOCKETS_BY_SLOT`, budgets from validate defaults + specs, materials, preview/`ENGINE_PART_PNG_ART_SHIPPED`, pilot vs placeholder).
- Cross-links in `architecture.md`, `asset-pipeline.md`, `adding-a-new-part.md`.
