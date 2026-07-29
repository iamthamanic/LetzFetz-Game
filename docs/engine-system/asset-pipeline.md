# Asset pipeline (Fetzgerät 3D)

**Status:** Validate + preview + normalize + optimize real; remaining Brief §18 stubs (#189) — no Meshy, no paid APIs  
**See also:** [architecture.md](./architecture.md), [asset-specification.md](./asset-specification.md), [adding-a-new-part.md](./adding-a-new-part.md), [blender-workflow.md](./blender-workflow.md), [mcp-and-cli-setup.md](./mcp-and-cli-setup.md), [troubleshooting.md](./troubleshooting.md)

## Purpose

Local npm commands to validate / preview / (later) author modular engine part assets. Mirrors `tools/audio-forge` **exit-code clarity** without pulling Python.

| Script | Command | Today |
|--------|---------|--------|
| Validate | `npm run asset:validate -- <asset-id>` | Real: GLB exists, SOCKET_* nodes vs spec, triangle + byte budgets |
| Preview | `npm run asset:preview -- <asset-id>` | Real: Blender `render_preview` → `public/cards/engine/<id>.png` (#185) |
| Normalize | `npm run asset:normalize -- <asset-id>` | Real: Blender `normalize_part` (#190) |
| Optimize | `npm run asset:optimize -- <asset-id>` | Real: `@gltf-transform/core` repack + byte budget (#190) |
| All | `npm run asset:all -- <asset-id>` | Runs validate then preview |
| Blender | `npm run asset:blender -- <script> <asset-id>` | `validate_sockets` / `normalize_part` / `render_preview` (#184) |
| Spec / concept / multiview / model / publish | `npm run asset:<cmd> -- <id>` | **Stub** (#189) — DE/EN status + expected path, exit 0 |
| Batch | `npm run assets:validate\|previews\|registry\|report` | **Stub** (#189) — no id |

## Normalize + optimize (#190)

```bash
npm run asset:normalize -- v3-part-water-traeger-01
npm run asset:normalize -- v3-part-water-traeger-01 --out /tmp/water.glb
npm run asset:optimize -- v3-part-water-traeger-01
npm run asset:optimize -- v3-part-water-traeger-01 --out /tmp/water-opt.glb
```

| Command | Tooling | Overwrite |
|---------|---------|-----------|
| `asset:normalize` | Spawns `tools/blender/run.mjs normalize_part` | Default **overwrites** `public/engine-parts/mvp/<id>.glb`. Use `--out` or `git checkout` to keep the original. Missing Blender → exit **1** (DE/EN). |
| `asset:optimize` | `@gltf-transform/core` NodeIO read/write (repack) | Same overwrite rules. Fails exit **1** if size &gt; Spec `budgets.maxBytes` (default 512 KiB). No Draco/meshopt yet (YAGNI). |

Recommended local order: `normalize` → `optimize` → `validate` → `preview`.

CI `npm run checks` does **not** invoke Blender or these commands.

## Stub suite (#189)

Shared runner: `tools/asset-pipeline/stub.mjs`. No network, no writes, no secrets.

```bash
npm run asset:spec -- v3-part-water-traeger-01
npm run asset:concept -- v3-part-water-traeger-01
npm run asset:multiview -- v3-part-water-traeger-01
npm run asset:model -- v3-part-water-traeger-01
npm run asset:publish -- v3-part-water-traeger-01
npm run assets:validate
npm run assets:previews
npm run assets:registry
npm run assets:report
```

### Exit codes (stubs + real runners)

| Code | Meaning |
|------|---------|
| `0` | OK — real step passed, or stub acknowledged |
| `1` | Real failure (validate / preview / normalize / optimize / blender) |
| `2` | Usage error (missing/invalid `<asset-id>`, unknown flags) |

## Blender CLI (#184)

Requires Blender on `PATH` or `BLENDER_BIN`. Missing Blender → exit **1** with DE/EN message (CI `npm run checks` does **not** invoke Blender).

```bash
npm run asset:blender -- validate_sockets v3-part-water-traeger-01
npm run asset:blender -- normalize_part v3-part-water-traeger-01
npm run asset:blender -- render_preview v3-part-water-traeger-01 --force
# Preferred npm wrappers (#190):
npm run asset:normalize -- v3-part-water-traeger-01
```

Scripts live under `tools/blender/` (`README.md`). Preview PNG: `public/cards/engine/<id>.png` (idempotent unless `--force`). Socket names must match Spec JSON / [`asset-specification.md`](./asset-specification.md).

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
  normalize.mjs         # Blender normalize_part (#190)
  optimize.mjs          # gltf-transform repack + budget (#190)
  all.mjs
  stub.mjs              # Brief §18 stubs (#189)
public/engine-parts/mvp/     # GLBs
docs/engine-system/specs/    # JSON stubs (sockets + budgets)
src/services/engineAssets/   # partRegistry
```

## Snapshots (runtime, not CLI)

In-app cache: `src/features/play/engine3d/rendering/`

- Key: `createRenderKey(recipe)` from `src/game/engine/engineRecipe.ts`
- L1 memory + L2 IndexedDB (#188)
- `requestEngineSnapshot(recipe, { canvas?, allowPlaceholder? })`

Bump `ENGINE_RENDER_VERSION` when assembly/shaders/camera contract changes so keys miss old entries.

## Follow-ups (still out of scope)

- Draco / meshopt via `@gltf-transform/functions` (optimize stays core-repack for now)
- Offline/headless WebGL snapshot writer
- Meshy/Tripo or other generation providers (keep secrets out of git)
- Mass production of all 36 non-placeholder GLBs
