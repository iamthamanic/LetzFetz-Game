# Rendering (Fetzgerät 3D)

**Status:** Stub — R3F + snapshots in #133 / #134  
**See also:** [architecture.md](./architecture.md)

## Surfaces

| UI | Tech |
|----|------|
| Cards / board thumbs | Static image (`previewUrl` or legacy PNG) |
| Detail / build preview | Single `@react-three/fiber` canvas |
| Cached engine art | Snapshot keyed by `createRenderKey` |

## MVP assets (#132)

| Part id | `modelUrl` | Required sockets |
|---------|------------|------------------|
| `v3-part-water-traeger-01` | `/engine-parts/mvp/v3-part-water-traeger-01.glb` | `SOCKET_DRIVE` (+ `SOCKET_VFX_REAR`) |
| `v3-part-shadow-antrieb-01` | `/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` | `SOCKET_OUTPUT`, `SOCKET_VFX_CORE` |
| `v3-part-light-aufsatz-01` | `/engine-parts/mvp/v3-part-light-aufsatz-01.glb` | `SOCKET_ATTACK_ORIGIN` |

Regenerate boxes: `npm run generate:mvp-engine-glbs`. Spec stubs: `docs/engine-system/specs/`.

## Rules

- Max one active Engine canvas per view.
- `renderVersion` bumps invalidate caches when shaders/camera/assets change.
- `prefers-reduced-motion`: skip mount animation; show assembled pose.
- WebGL missing: German fallback copy, no crash.
