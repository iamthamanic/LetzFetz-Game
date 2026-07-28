# Rendering (Fetzgerät 3D)

**Status:** Live detail canvas in Play (#133); snapshots / CLI in #134  
**See also:** [architecture.md](./architecture.md)

## Surfaces

| UI | Tech |
|----|------|
| Cards / board thumbs | Static image (`previewUrl` or legacy PNG) |
| Detail / build preview | Single `@react-three/fiber` canvas |
| Cached engine art | Snapshot keyed by `createRenderKey` (#134) |

## Play integration (#133)

| Entry | Behavior |
|-------|----------|
| Playtest Cheatbox → **3D-Assembler (MVP)** | Opens `EnginePreviewPanel` with hardcoded MVP×3 recipe |
| Bound recipe with Träger + registry GLB | Button **Fetzgerät 3D** (bottom-left) → same panel via `boundToRecipe` |
| Forge Card Library | **Follow-up** — no Feature→Feature import; optional later `src/components/engine3d/` |

Code: `src/features/play/engine3d/` (`EnginePreviewCanvas`, `WeaponAssembler`, …).  
Hook exception: only `engine3d/three/**` (ADR D4).

## MVP assets (#132)

| Part id | `modelUrl` | Required sockets |
|---------|------------|------------------|
| `v3-part-water-traeger-01` | `/engine-parts/mvp/v3-part-water-traeger-01.glb` | `SOCKET_DRIVE` (+ `SOCKET_VFX_REAR`) |
| `v3-part-shadow-antrieb-01` | `/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` | `SOCKET_OUTPUT`, `SOCKET_VFX_CORE` |
| `v3-part-light-aufsatz-01` | `/engine-parts/mvp/v3-part-light-aufsatz-01.glb` | `SOCKET_ATTACK_ORIGIN` |

Regenerate boxes: `npm run generate:mvp-engine-glbs`. Spec stubs: `docs/engine-system/specs/`.

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
