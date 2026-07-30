# Feature: V5 docs: refresh SPIELUEBERSICHT + living docs for V5 default

**Slug:** `v5-docs-overview-refresh`  
**Issue:** #288

## Intent

Human-facing overview and living docs describe V5 as Play default (Formel, Charge 3, Soft-retire Legacy).

## Happy Path

- [x] Overview docs say V5 is default; Base = regression
- [x] Living doc / project-memory reflects post-cutover parity epic
- [x] Links to spielkonzept + SPIELANLEITUNG_V5_DRAFT valid

## Implementation Notes

- Updated `docs/SPIELUEBERSICHT_AKTUELL.md` (date, §3 V5 basics, links, Fazit)
- Updated `.project-memory/current-state.json` + change event
- Updated `docs/en/PROJECT-STATUS.md`
- No invented features; Meshy #286 remains gap
