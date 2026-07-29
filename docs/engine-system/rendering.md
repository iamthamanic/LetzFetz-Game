# Rendering (Fetzgerät 3D)

**Status:** Live detail canvas in Play (#133); in-memory snapshot cache + asset CLI stubs (#134); real canvas `toDataURL` capture (#146)  
**See also:** [architecture.md](./architecture.md), [asset-specification.md](./asset-specification.md), [asset-pipeline.md](./asset-pipeline.md), [adding-a-new-part.md](./adding-a-new-part.md)

## Surfaces

| UI | Tech |
|----|------|
| Cards / board thumbs | Snapshot cache hit (`resolveEnginePartThumb`) → else static PNG for ids in `ENGINE_PART_PNG_SHIPPED_IDS` (MVP trio #185) when `ENGINE_PART_PNG_ART_SHIPPED`, else empty (no broken img) |
| **Board Engine-Zone (primary Live-3D, #187)** | One `EnginePreviewCanvas` in `BoardEngineLiveZone` under human bound row; auto `requestEngineSnapshot` after montage warmup |
| Detail / Forge part preview | Shared `EnginePreviewCanvas` (Forge library); Playtest MVP reuses **board** Live-3D (no second canvas) |
| Cached engine art | Snapshot keyed by `createRenderKey` (#134 / #146) |

## Snapshot cache (#134 / #146 / #188)

| Piece | Location |
|-------|----------|
| L1 Cache `get` / `set` / `invalidate` | `src/features/play/engine3d/rendering/engine-snapshot-cache.ts` |
| L2 IndexedDB write-through + hydrate | `engine-snapshot-idb.ts` / `hydrateEngineSnapshots.ts` |
| Best-effort request | `requestEngineSnapshot(recipe, options?)` |
| Key | `createRenderKey(recipe)` — includes `renderVersion` + `cosmeticSeed` + part ids |
| Invalidation | Bump `ENGINE_RENDER_VERSION` or call `invalidateEngineSnapshot(key?)` (clears L1 + L2) |
| Live capture | `EnginePreviewCanvas` → `onGlCanvasReady(canvas)` → board auto-warmup / panel **Snapshot cachen** |
| R3F note | `preserveDrawingBuffer: true` so the buffer survives composite for capture |
| CI / headless | Without canvas: **placeholder** 1×1 PNG data URL. Stub only as fallback. |
| Reload | `PlayView` mounts → `hydrateEngineSnapshotCache()` fills L1 from IDB; corrupt/stale/`rv*` mismatch dropped |
| Play UI | Board zone auto-warmup; optional panel **Snapshot cachen** still available for Forge-style debug |

Capture path (open preview):

1. R3F `Canvas` `onCreated` → `gl.domElement` via `onGlCanvasReady`
2. User clicks **Snapshot cachen** → `requestEngineSnapshot(recipe, { canvas, force: true })`
3. Cache stores data URL by `createRenderKey`; later calls without force → source `cache`
4. No canvas / capture fail → placeholder stub (default)

Board / bound engine-part thumbs prefer the in-memory snapshot cache
(`resolveEnginePartThumb` / `resolveBoardCardArtPath` in Play). Cache miss or
1×1 placeholder stub → `resolveEnginePartArtPath` (PNG only after
`ENGINE_PART_PNG_ART_SHIPPED`; until then `''` so LetzFetzCard uses the
gradient/icon fallback instead of a 404/`index.html` broken image).
Forge library grids: same resolver; detail view still uses live 3D canvas.

## Play + Library integration (#133 / #145 / #187)

| Entry | Behavior |
|-------|----------|
| Human Engine-Zone | `BoardEngineLiveZone` — Live-3D when bound recipe is active + registry assets; empty DE placeholder otherwise |
| Auto snapshot warmup | After canvas ready + montage delay (`boardEngineWarmupDelayMs`), `requestEngineSnapshot({ force: true })` — no mandatory button |
| Playtest Cheatbox → **3D-Assembler (MVP)** | Same board zone shows `MVP_DEMO_RECIPE` (still one canvas) |
| Opponent Engine-Zone | 2D thumbs only (cache/PNG) — never a second R3F canvas |
| Forge Card Library detail | When `lookupEnginePartAsset(card.id)` → shared `EnginePreviewCanvas` (carrier-only recipe) |

Shared presentational: `src/components/engine3d/` (`EnginePreviewCanvas`, `WeaponAssembler`, …).  
Play-owned shell: `src/features/play/engine3d/` (`BoardEngineLiveZone`, optional `EnginePreviewPanel`, snapshot cache, MVP demo).  
Hook exception: only `components/engine3d/three/**` (ADR D4).

## V3 assets (#132 / #143)

Catalog: `V3_ENGINE_PARTS_36` (36 ids). Demo trio:

| Part id | `modelUrl` | Slot sockets (`SOCKETS_BY_SLOT`) |
|---------|------------|----------------------------------|
| `v3-part-water-traeger-01` | `/engine-parts/mvp/v3-part-water-traeger-01.glb` | `SOCKET_DRIVE`, `SOCKET_ATTACHMENT_FALLBACK`, `SOCKET_VFX_REAR` |
| `v3-part-shadow-antrieb-01` | `/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` | `SOCKET_OUTPUT`, `SOCKET_VFX_CORE`, `SOCKET_EXHAUST` |
| `v3-part-light-aufsatz-01` | `/engine-parts/mvp/v3-part-light-aufsatz-01.glb` | `SOCKET_ATTACK_ORIGIN`, `SOCKET_VFX_FRONT` |

Regenerate boxes + specs: `npm run generate:engine-part-glbs -- --all` (alias: `generate:mvp-engine-glbs`). Spec stubs: `docs/engine-system/specs/` (36).

**Pilot real meshes (#165):** the trio above are low-poly prisms/spike (`placeholder: false`, spec `version: 2`). Regenerate with `npm run generate:pilot-engine-glbs` — `generate:engine-part-glbs --all` **skips** authored Specs (`placeholder: false`).

**Batch A (#195):** fire ×6 + remaining water ×5 (excludes pilot `water-traeger-01`) via `npm run generate:batch-a-engine-glbs` — distinctive prisms/spikes, Spec `batch: "A"`, `placeholder: false`. Remaining earth/air/shadow/light (non-pilot) stay unit-box placeholders until later batches.

## Materials / toon look (#183)

| Piece | Location |
|-------|----------|
| Semantic classes → `MeshToonMaterial` | `src/components/engine3d/three/EngineMaterials.ts` |
| Apply on part clone | `PartModel` → `applyEngineLook` |
| Outline | `EdgesGeometry` LineSegments (`__engineToonOutline`); off when `prefers-reduced-motion` or low `hardwareConcurrency` / `deviceMemory` |
| Element tint | Cosmetic from part id (`v3-part-<element>-…`) on core/emission/fallback only — **not** rules |
| Cache invalidation | Bump `ENGINE_RENDER_VERSION` (currently **3**) when look contract changes |

Unknown glTF material names → `MAT_FALLBACK` toon (no crash). Gameplay / `src/game/` never imports materials.

Classes: `MAT_METAL`, `MAT_RUBBER`, `MAT_GLASS`, `MAT_WOOD`, `MAT_CONCRETE`, `MAT_CERAMIC`, `MAT_ELEMENT_CORE`, `MAT_EMISSION` — see [`asset-specification.md`](./asset-specification.md).

## Assembly

1. Load Träger GLB → clone scene (+ toon remap / outline)  
2. Attach Antrieb under Träger `SOCKET_DRIVE`  
3. Attach Aufsatz under Antrieb `SOCKET_OUTPUT`  
4. Missing socket: Dev overlay + `console.error` with asset id; Prod German fallback string  

## Montage animation (#186)

| Piece | Location |
|-------|----------|
| Phase math + dock offsets | `src/components/engine3d/three/EngineAnimations.ts` |
| Applied each frame | `WeaponAssembler` `useFrame` |

Stagger (Brief §12 general montage — not per-combo clips):

1. Träger root scale-in (`0.15` → `1`)
2. Antrieb approaches along local **+Z** on `SOCKET_DRIVE` (`MONTAGE_DOCK_DISTANCE` → `0`)
3. Aufsatz approaches along local **+Z** on `SOCKET_OUTPUT`

Carrier-only recipes skip drive/attachment windows (no fake dock). Recipe id change resets progress. `prefers-reduced-motion`: assembled pose, zero tween. Snapshots / `ENGINE_RENDER_VERSION` are unaffected (runtime motion only).

## Visual regression — MVP trio (#192)

| Piece | Location |
|-------|----------|
| Playwright harness | `e2e/fetz-3d-visual-regression-mvp.spec.ts` |
| Helpers | `e2e/helpers/engineMvpVisual.ts` |
| Playwright baseline | `e2e/fetz-3d-visual-regression-mvp.spec.ts-snapshots/` |
| Evidence PNG | `.qa/evidence/fetz-3d-visual-regression-mvp/mvp-trio-assembly.png` |
| npm | `npm run test:e2e:visual-mvp` · update: `npm run test:e2e:visual-mvp:update` |

**Recipe under test:** `MVP_DEMO_RECIPE` (Wasser-Träger + Schatten-Antrieb + Licht-Aufsatz) via Playtest cheatbox **3D-Assembler (MVP)** → board `BoardEngineLiveZone` (fixed `EngineCamera`, reduced-motion assembled pose).

### Fail conditions

| Outcome | Result |
|---------|--------|
| Pixel diff &gt; `maxDiffPixelRatio` (0.04) vs baseline | **FAIL** |
| Zone mounts neither canvas nor WebGL fallback | **FAIL** |
| WebGL unavailable (fallback only) | **`test.skip`** with explicit note — never a silent green pixel pass |

### Baseline refresh

Re-generate after intentional montage/material/asset changes **or** when bumping `ENGINE_RENDER_VERSION`:

```bash
npm run test:e2e:visual-mvp:update
```

Commit updated files under `e2e/fetz-3d-visual-regression-mvp.spec.ts-snapshots/` and the evidence PNG. Platform suffix in Playwright snapshot names is expected (Chromium + OS); refresh on the machine you use for visual checks.

`npm run checks` (build + unit) does **not** run this harness.

## Mobile performance (#193)

| Piece | Location |
|-------|----------|
| Report | [`mobile-perf-report.md`](./mobile-perf-report.md) |
| Metrics JSON | [`mobile-perf-metrics.json`](./mobile-perf-metrics.json) |
| E2E protocol | `npm run test:e2e:mobile-perf` (390×844 Chromium mobile) |
| Optional HUD | `?enginePerf=1` / `localStorage lf-engine-perf=1` → `EnginePerfHud` |

**Budgets (runtime):** ≥30 FPS interactive target on real mid-tier phones; ≤1 Live-3D canvas; outline already disabled for reduced-motion / ≤2 cores / ≤2 GB `deviceMemory`. Emulation metrics are relative — see report.

## Rules

- Max one active Engine canvas per view.
- `renderVersion` bumps invalidate caches when shaders/camera/assets change.
- `prefers-reduced-motion`: skip mount animation; show assembled pose.
- WebGL missing: German fallback copy, no crash.
- **Zero** `three` imports under `src/game/`.
