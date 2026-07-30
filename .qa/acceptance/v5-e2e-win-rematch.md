# Feature: V5 e2e: solo formula match through win/rematch

**Slug:** `v5-e2e-win-rematch`  
**Issue:** #289

## Intent

Optional E2E: Solo V5 formula match plays through win and rematch without crash. Prefer Vitest scenario over brittle browser marathon.

## Happy Path

- [x] Deterministic engine scenario reaches win under V5 ruleset
- [x] Rematch resets to playable V5 state
- [x] typed-strict clean
- [ ] Optional verify-ui evidence — deferred (smoke #233 already covers UI path)

## Implementation Notes

- `src/game/engine/v5WinRematch.test.ts`: lethal V5 attack → winner p1; rematch `createGame` → fresh V5 playable state
- No Meshy / no browser marathon (per issue note)
