# Feature: V6 Play-Default cutover (v6Formula)

**Issue:** #353  
**Slug:** `v6-play-default-cutover`

## Intent

Flip Play-Default from V5 to V6 when PLAYABLE gate is green. Keep V5 reachable as Legacy/Regression.

## Happy Path

- [ ] New matches default to `v6Formula` (`defaultPackChoice` → `v6`)
- [ ] V5 still startable as Legacy tile
- [ ] Docs/AGENTS updated; `VITE_V6_PLAYABLE` no longer required
- [ ] `npm run checks` green

## Edge Cases

- Test override can still force-disable V6 resolve for isolation
- No V5 hard-delete (#354 later)

## Regression

- V5 pack/ruleset path still works when selected
- V1/V2/V3 legacy packs unchanged under toggle

## Security Coverage

- Out of scope — local setup flag only

## Assumptions

- Explicit human go via `@ecc-runner-loop` for #353

## Screenshots

N/A (unit + e2e specs updated)

## Implementation Notes

- `defaultPackChoice` → `v6`; Setup shows V6 Standard + V5 Legacy
- `isV6PlayableEnabled()` defaults true; flag keys relaxed
- AGENTS + spielkonzept + SPIELANLEITUNG status + project-core updated
