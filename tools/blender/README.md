# Blender CLI (Fetzgerät parts)

Minimum offline scripts for normalize / socket validate / preview render. No Meshy, no secrets.

## Prerequisites

- Blender 4.x CLI on `PATH`, **or** `BLENDER_BIN` pointing at the binary
  - macOS app: `/Applications/Blender.app/Contents/MacOS/Blender`
- If Blender is missing, `npm run asset:blender` exits **1** with DE/EN instructions (does not break `npm run checks`).

## Commands

```bash
npm run asset:blender -- validate_sockets <asset-id>
npm run asset:blender -- normalize_part <asset-id>
npm run asset:blender -- render_preview <asset-id>          # skip if PNG exists
npm run asset:blender -- render_preview <asset-id> --force  # overwrite PNG

# Preferred wrappers (same Blender scripts / exit codes):
npm run asset:normalize -- <asset-id>              # → normalize_part; overwrites MVP GLB
npm run asset:normalize -- <asset-id> --out path.glb
npm run asset:optimize -- <asset-id>               # gltf-transform repack (no Blender)
npm run asset:preview -- <asset-id>                # → render_preview
```

Equivalent:

```bash
blender -b -P tools/blender/validate_sockets.py -- v3-part-water-traeger-01
```

## Scripts

| Script | Role |
|--------|------|
| `validate_sockets.py` | Import GLB; require every `sockets[]` name from `docs/engine-system/specs/<id>.json` |
| `normalize_part.py` | Apply rotation/scale; center meshes; write GLB (optional `--out`) |
| `render_preview.py` | Fixed camera/light → `public/cards/engine/<id>.png` (512²). Idempotent unless `--force` |

Shared helpers: `common/paths.py` (safe asset ids, no path traversal).

## MVP trio smoke (local)

With Blender installed:

```bash
npm run asset:blender -- validate_sockets v3-part-water-traeger-01
npm run asset:blender -- render_preview v3-part-water-traeger-01 --force
# likewise: v3-part-shadow-antrieb-01, v3-part-light-aufsatz-01
```

See also: [`docs/engine-system/blender-workflow.md`](../../docs/engine-system/blender-workflow.md), [`asset-pipeline.md`](../../docs/engine-system/asset-pipeline.md), [`asset-specification.md`](../../docs/engine-system/asset-specification.md), [`troubleshooting.md`](../../docs/engine-system/troubleshooting.md).
