# Rendering (Fetzgerät 3D)

**Status:** Live detail canvas in Play (#133); in-memory snapshot cache + asset CLI stubs (#134)  
**See also:** [architecture.md](./architecture.md), [asset-pipeline.md](./asset-pipeline.md), [adding-a-new-part.md](./adding-a-new-part.md)

## Surfaces

| UI | Tech |
|----|------|
| Cards / board thumbs | Static image via `resolveCardArtPath` → registry `previewUrl`, else `/cards/engine/{id}.png` |
| Detail / build preview | Single `@react-three/fiber` canvas (`src/components/engine3d/`) |
| Cached engine art | Snapshot keyed by `createRenderKey` (#134) |

## Snapshot cache (#134)

| Piece | Location |
|-------|----------|
| Cache `get` / `set` / `invalidate` | `src/features/play/engine3d/rendering/engine-snapshot-cache.ts` |
| Best-effort request | `requestEngineSnapshot(recipe, options?)` |
| Key | `createRenderKey(recipe)` — includes `renderVersion` + `cosmeticSeed` + part ids |
| Invalidation | Bump `ENGINE_RENDER_VERSION` or call `invalidateEngineSnapshot(key?)` |
| CI / headless | Default **placeholder** 1×1 PNG data URL (no WebGL). Pass `canvas` for live `toDataURL`. |
| Play UI | Optional **Snapshot cachen** on `EnginePreviewPanel` (warms memory cache; not persisted) |

Board cards stay 2D — thumbs resolve through `src/services/cardArt/manifest.ts`
(`resolveCardArtPath` / `resolveEnginePartArtPath` → `lookupEnginePartAsset.previewUrl`).
Snapshot cache remains infrastructure for future generated thumbs, not a cutover in #134.

## Play + Library integration (#133 / #145)

| Entry | Behavior |
|-------|----------|
| Playtest Cheatbox → **3D-Assembler (MVP)** | Opens Play `EnginePreviewPanel` with hardcoded MVP×3 recipe |
| Bound recipe with Träger + registry GLB | Button **Fetzgerät 3D** (bottom-left) → same panel via `boundToRecipe` |
| Forge Card Library detail | When `lookupEnginePartAsset(card.id)` → shared `EnginePreviewCanvas` (carrier-only recipe) |

Shared presentational: `src/components/engine3d/` (`EnginePreviewCanvas`, `WeaponAssembler`, …).  
Play-owned shell: `src/features/play/engine3d/` (`EnginePreviewPanel`, snapshot cache, MVP demo).  
Hook exception: only `components/engine3d/three/**` (ADR D4).

## V3 assets (#132 / #143)

Catalog: `V3_ENGINE_PARTS_36` (36 ids). Demo trio:

| Part id | `modelUrl` | Slot sockets (`SOCKETS_BY_SLOT`) |
|---------|------------|----------------------------------|
| `v3-part-water-traeger-01` | `/engine-parts/mvp/v3-part-water-traeger-01.glb` | `SOCKET_DRIVE`, `SOCKET_ATTACHMENT_FALLBACK`, `SOCKET_VFX_REAR` |
| `v3-part-shadow-antrieb-01` | `/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` | `SOCKET_OUTPUT`, `SOCKET_VFX_CORE`, `SOCKET_EXHAUST` |
| `v3-part-light-aufsatz-01` | `/engine-parts/mvp/v3-part-light-aufsatz-01.glb` | `SOCKET_ATTACK_ORIGIN`, `SOCKET_VFX_FRONT` |

Regenerate boxes + specs: `npm run generate:engine-part-glbs -- --all` (alias: `generate:mvp-engine-glbs`). Spec stubs: `docs/engine-system/specs/` (36).

## Assembly

1. Load Träger GLB → clone scene  
2. Attach Antrieb under Träger `SOCKET_DRIVE`  
3. Attach Aufsatz under Antrieb `SOCKET_OUTPUT`  
4. Missing socket: Dev overlay + `console.error` with asset id; Prod German fallback string  

## Rules

- Max one active Engine canvas per view.
- `renderVersion` bumps invalidate caches when shaders/camera/assets change.
- `prefers-reduced-motion`: skip mount animation; show assembled pose.
- WebGL missing: German fallback copy, no crash.
- **Zero** `three` imports under `src/game/`.
