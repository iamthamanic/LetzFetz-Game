# Asset pipeline (Fetzgerät 3D)

**Status:** CLI stubs (#134) — no Meshy, no paid APIs  
**See also:** [architecture.md](./architecture.md), [adding-a-new-part.md](./adding-a-new-part.md)

## Purpose

Local npm commands to validate / preview modular engine part assets. Mirrors `tools/audio-forge` **exit-code clarity** without pulling Python.

| Script | Command | Today |
|--------|---------|--------|
| Validate | `npm run asset:validate -- <asset-id>` | Stub: MVP registry + file existence report (DE/EN) |
| Preview | `npm run asset:preview -- <asset-id>` | Stub: path + in-app snapshot hint |
| All | `npm run asset:all -- <asset-id>` | Runs validate then preview |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Stub completed / reported status |
| `2` | Usage error (missing `<asset-id>`) |
| `1` | Reserved for future real validation failures |

## Layout

```text
tools/asset-pipeline/
  validate.mjs
  preview.mjs
  all.mjs
public/engine-parts/mvp/     # GLBs
docs/engine-system/specs/    # JSON stubs
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

## Follow-ups (explicitly not this stub)

- Real GLB socket + triangle budget checks
- Offline/headless WebGL snapshot writer
- Meshy/Tripo or other generation providers (keep secrets out of git)
