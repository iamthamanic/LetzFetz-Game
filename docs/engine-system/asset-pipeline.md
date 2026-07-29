# Asset pipeline (Fetzgerät 3D)

**Status:** Validate is real (#164) — no Meshy, no paid APIs  
**See also:** [architecture.md](./architecture.md), [asset-specification.md](./asset-specification.md), [adding-a-new-part.md](./adding-a-new-part.md)

## Purpose

Local npm commands to validate / preview modular engine part assets. Mirrors `tools/audio-forge` **exit-code clarity** without pulling Python.

| Script | Command | Today |
|--------|---------|--------|
| Validate | `npm run asset:validate -- <asset-id>` | Real: GLB exists, SOCKET_* nodes vs spec, triangle + byte budgets |
| Preview | `npm run asset:preview -- <asset-id>` | Stub: path + in-app snapshot hint |
| All | `npm run asset:all -- <asset-id>` | Runs validate then preview |

## Exit codes (`asset:validate`)

| Code | Meaning |
|------|---------|
| `0` | Validation passed (sockets + budgets OK) |
| `1` | Validation failed (missing GLB / sockets / over budget / unknown id / bad GLB) |
| `2` | Usage error (missing/invalid `<asset-id>`) |

## Checks (validate)

1. Asset id is a safe single path segment (no `..` / separators).
2. Spec JSON exists under `docs/engine-system/specs/<id>.json`.
3. GLB exists under `public/engine-parts/mvp/<id>.glb`.
4. GLB JSON chunk lists every `sockets[]` name from the spec as a node `name`.
5. Estimated triangle count (indices/3) ≤ `budgets.maxTriangles` (default 12 000 if omitted).
6. File size ≤ `budgets.maxBytes` when set; otherwise default 512 KiB.

Preview PNG remains **optional**.

## Layout

```text
tools/asset-pipeline/
  validate.mjs
  preview.mjs
  all.mjs
public/engine-parts/mvp/     # GLBs
docs/engine-system/specs/    # JSON stubs (sockets + budgets)
src/services/engineAssets/   # partRegistry
```

## Snapshots (runtime, not CLI)

In-app cache: `src/features/play/engine3d/rendering/`

- Key: `createRenderKey(recipe)` from `src/game/engine/engineRecipe.ts`
- `get` / `set` / `invalidate` — in-memory only
- `requestEngineSnapshot(recipe, { canvas?, allowPlaceholder? })`
  - Cache hit → reuse
  - Live preview: pass WebGL `HTMLCanvasElement` from `EnginePreviewCanvas` (`onGlCanvasReady`) → `toDataURL` → cache (source `canvas`)
  - Fallback: 1×1 PNG **placeholder** when no canvas / capture fails (CI / headless)
  - `allowPlaceholder: false` → miss, nothing cached
  - `force: true` → skip cache read (re-capture from canvas or re-stub)

Bump `ENGINE_RENDER_VERSION` when assembly/shaders/camera contract changes so keys miss old entries.

## Follow-ups (still out of scope)

- Offline/headless WebGL snapshot writer
- Meshy/Tripo or other generation providers (keep secrets out of git)
- Mass production of all 36 non-placeholder GLBs
