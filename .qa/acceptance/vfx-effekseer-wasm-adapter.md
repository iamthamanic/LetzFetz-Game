# Feature: vfx-effekseer-wasm-adapter

Issue: #300  
Design: `.qa/design/effekseer-runtime-wiring.md`

## Intent

Wire real Effekseer WebGL WASM behind `effekseerAdapter.ts` and ship a license-ok `aura.efkefc` so `loadEffect` / `createEffect` work. Stand-in particles only on missing/error.

## Preconditions

- Build VFX preview + stub adapter exist on main (#257 / #290).
- No inventing fake `.efkefc` binaries.

## Happy Path

1. `@zaniar/effekseer-webgl-wasm` is a dependency; only `effekseerAdapter.ts` (and its tests) load it.
2. `loadEffect('/vfx/effects/aura.efkefc')` → `ready` when file exists; `createEffect` returns non-null with injected/mock runtime + GL in unit tests.
3. Real `public/vfx/effects/aura.efkefc` (EFKE magic) + `Parts/` + LICENSE notice committed.
4. Missing path → `missing`; createEffect returns null (stand-in path).
5. `npm run checks` green; `@typed-strict` on touched files.

## Edge Cases

- WASM / script init failure → `error`, createEffect null.
- Fetch/network failure → `error`.
- Repeated `loadEffect` uses cache (no re-init storm).

## Security Coverage

| Item | Status |
|------|--------|
| F-01 XSS | N/A — no user HTML; paths from preset registry |
| F-03 secrets | N/A — no secrets |
| P-04 UGC | Preset paths are allowlisted registry URLs under `/vfx/effects/` |
| B-* | N/A — no backend |

## Regression

- Existing stand-in preview still works when effect missing.
- `effectPresets` registry unchanged.

## Implementation Notes

- Added `@zaniar/effekseer-webgl-wasm@1.62.5000`; runtime loaded via classic script + WASM under `public/vfx/effekseer/` (copied from package).
- `WasmEffekseerAdapter` replaces stub: EFKE magic probe, injectable `EffekseerRuntimeLoader`, `createEffect` returns live instance with mock GL in tests.
- MIT samples: `aura`/`trail`/`impact`/`ambient` `.efkefc` + `Parts/` + `Texture/` + `EFFEKSEER_SAMPLE_LICENSE.txt`.
- Preview play wiring deferred to #301 (stand-in still default until createEffect is hooked in scene).
