# Rendering (Fetzgerät 3D)

**Status:** Stub — R3F + snapshots in #133 / #134  
**See also:** [architecture.md](./architecture.md)

## Surfaces

| UI | Tech |
|----|------|
| Cards / board thumbs | Static image (`previewUrl` or legacy PNG) |
| Detail / build preview | Single `@react-three/fiber` canvas |
| Cached engine art | Snapshot keyed by `createRenderKey` |

## Rules

- Max one active Engine canvas per view.
- `renderVersion` bumps invalidate caches when shaders/camera/assets change.
- `prefers-reduced-motion`: skip mount animation; show assembled pose.
- WebGL missing: German fallback copy, no crash.
