# Effekseer Real Runtime Wiring

Design 2026-07-30. Extends `.qa/design/vfx-studio.md`. Confidence ~95%.

## Intent

Replace the stub Effekseer adapter with a **real WASM runtime** so VFX Studio / Combinate preview can load committed `.efkefc` presets, play them on the shared WebGL canvas, and bind them through the Asset Pipeline → VisualRecipe path for MVP-9 formula cards.

Authoring stays **Desktop-only** (Effekseer editor). The app only loads, previews, and binds presets.

## Roles

| Actor | Does | Does not |
|-------|------|----------|
| Human (Desktop) | Create/export `.efkefc` (+ textures) into `public/vfx/effects/` | Edit particles in-app |
| Studio | Load / preview / bind presets to sockets; save `effectId` on technique assets | Free particle graph |
| Combinate | Map T/E/K slots → VisualRecipe → preset layers in shared preview | Own Effekseer runtime |
| Play board | — | Effekseer V1 (out of scope) |

## Non-goals

- In-app particle / Effekseer node editor
- Effekseer on the Play-board match view (V1)
- Meshy MVP-9 batch (#286 `needs-human`) — skip; data/preset mapping only
- Multiple signaling / game backends
- Invented fake `.efkefc` binaries that crash WASM

## Runtime choice

| Option | Verdict |
|--------|---------|
| **`@zaniar/effekseer-webgl-wasm@1.62.5000`** (MIT, EffekseerForWebGL) | **P0 default** — npm package ships `effekseer.min.js` + `effekseer.wasm` + typings |
| Upstream CDN / vendored WASM | Fallback only if package breaks Vite resolve |

UI must **not** import Effekseer directly — only `src/features/build/vfx/preview/effekseerAdapter.ts`.

Vite: copy or `?url` import WASM so `initRuntime(wasmPath)` resolves in both dev and production builds.

## Sample `.efkefc` provenance (license-ok)

Source: [EffekseerForWebGL `tests/Resources`](https://github.com/effekseer/EffekseerForWebGL/tree/master/tests/Resources) — **MIT** (same Effekseer Project license).

| Preset id | Repo file | Upstream sample | Companion paths |
|-----------|-----------|-----------------|-----------------|
| `aura` | `public/vfx/effects/aura.efkefc` | `Light.efkefc` | `Parts/*` (Aura.png, Particle1.png, …) |
| `trail` | `trail.efkefc` | `Arrow1.efkefc` | `Texture/Line01.png`, `Particle01.png` |
| `impact` | `impact.efkefc` | `Blow1.efkefc` (or `ToonHit.efkefc`) | `Texture/Particle01.png` |
| `ambient` | `ambient.efkefc` | `Cure1.efkefc` | `Texture/Particle02.png`, `star.png` |

If only `aura` lands in P0: other preset registry entries may keep probing missing files → stand-in / Platzhalter. Prefer committing all four samples when size is acceptable (~hundreds of KB, not magma textures).

**Drop path (human):** export from Effekseer Desktop → copy `.efkefc` + relative texture folders next to the file under `public/vfx/effects/` → document in `public/vfx/effects/README.md`.

## Architecture

```
Desktop .efkefc
       │ commit
       ▼
public/vfx/effects/{aura,trail,impact,ambient}.efkefc
       + Parts/ | Texture/
       │
       ▼
effectPresets.ts ──► getEffekseerAdapter()
       │                    │
       │                    ├─ initRuntime(wasm)
       │                    ├─ loadEffect(path) → ready | missing | error
       │                    └─ createEffect(path, gl) → instance | null
       ▼
VfxSharedPreview / VfxPreviewScene
       ├─ effect ready → Effekseer draw + timeline seek
       └─ missing/error → AuraParticleStandIn (existing)
```

### Adapter contract (evolve stub)

Existing types stay:

- `loadEffect(path): Promise<EffekseerLoadState>`
- `createEffect(path, gl): EffekseerEffectInstance | null`
- `setPlayheadMs(ms)` / `dispose()`

New behavior:

1. Warm WASM once (singleton).
2. Fetch `.efkefc` as ArrayBuffer; load via context.
3. Bind to the **same** WebGL context as R3F (`gl.getContext()`).
4. On missing file, init failure, or load error → `missing`/`error` and `createEffect` returns `null` (stand-in).
5. Tests: inject mock adapter via `setEffekseerAdapterForTests`; unit-test load-state transitions without GPU when needed.

### Preview UX (German)

| State | Status chip |
|-------|-------------|
| loading | `… — wird geladen…` |
| ready + instance | `… — Effekseer aktiv` |
| ready file but create failed / not yet wired | fall back stand-in label |
| missing | `… — Platzhalter-Vorschau` |
| error | `… — Effekseer-Fehler (Stand-in)` |

Stand-in **only** when effect instance is unavailable — not when Effekseer is playing.

## P0 — WASM + aura + adapter

1. Add `@zaniar/effekseer-webgl-wasm` dependency.
2. Implement real adapter behind `getEffekseerAdapter()`.
3. Commit `aura.efkefc` (+ required `Parts/`) from MIT sample.
4. Vitest: adapter load missing → `missing`; mocked ready path; no fake binary.
5. `npm run checks` green.

## P1a — Shared preview plays Effekseer

1. `VfxPreviewScene` / `VfxSharedPreview`: when `loadState === 'ready'` and `createEffect` returns instance, drive playhead → `setPlayheadMs`; hide aura stand-in.
2. Timeline + hero scrub continue to work.
3. Context-lost still recovers via existing reload UI.

## P1b — Asset pipeline preset node + `effectId`

1. New React Flow node type `vfxEffekseerPreset` between Socket → Save (default graph): Meshy → Normalize → Socket → **Preset** → Save.
2. Node selects preset id from `VFX_EFFECT_PRESETS`.
3. Save writes `effectId` on technique asset (`types/assets.ts` already has the field — stop hardcoding `null`).
4. Studio preview reads selected preset / saved `effectId`.

## P1c — Combinate VisualRecipe → preset layers (MVP-9)

MVP-9 card ids (from `V5_MVP_*`):

| Role | Ids |
|------|-----|
| Technik | `durchschuss`, `notfallbarriere`, `rueckhandtechnik` |
| Essenz | `eingekochte-glut`, `ueberdrucktes-kondensat`, `kraeuterstaub` |
| Katalysator | `echo`, `ueberladung`, `spiegelung` |

Mapping (property-driven, not Meshy):

- Technik → primarily `trail` / `impact` by delivery (beam→trail, melee→impact, area/barrier→aura)
- Essenz → `aura` / `ambient` by element feel (fire→aura, water→ambient, …)
- Katalysator → `ambient` or layered second preset

`buildVisualRecipe` / Combinate preview builds a **preset layer list** `{ presetId, socket? }[]` fed into shared preview (multi-layer can start as first layer only if multi-instance is costly — document in acceptance).

No #286 Meshy GLBs required.

## Docs slice (optional P2)

- Refresh `public/vfx/effects/README.md` (provenance table, drop path, adapter pointer).
- Point `vfx-studio.md` Runtime section at this design.

## Slice order (GitHub)

| Order | Title | Priority |
|-------|-------|----------|
| 1 | Wire Effekseer WASM adapter + real `aura.efkefc` (stand-in fallback) | P0 |
| 2 | Shared preview plays Effekseer when effect ready (Timeline/Hero) | P0 |
| 3 | Effekseer preset node in asset pipeline + `effectId` on save | P1 |
| 4 | Combinate VisualRecipe → preset layers for MVP-9 (T/E/K) | P1 |
| 5 | Docs: effects README + vfx-studio pointer | P2 |

Depends-on chain: 1 → 2 → 3 → 4; 5 after 1 (can parallel after 1 merges).

## Validation

- `npm run checks` (build + Vitest)
- Touched files: `@typed-strict` (no `any` / `@ts-ignore`)
- German UI strings; English code
- Never regressively stash `src/features/build/` (#290 on main)

## Runner

`@ecc-runner-loop` — merge each issue before next. Skip #286.
