# Blender workflow (Fetzgerät parts)

**Issue:** #194  
**Status:** Ops guide (evidence from `tools/blender/` + `asset-pipeline.md`)  
**See also:** [`asset-pipeline.md`](./asset-pipeline.md) · [`asset-specification.md`](./asset-specification.md) · [`tools/blender/README.md`](../../tools/blender/README.md)

## Goal

Author and check modular GLBs offline with **Blender CLI**. npm wrappers are the supported entry; raw `blender -b -P …` is equivalent for debugging.

## Prerequisites

| Need | Detail |
|------|--------|
| Blender 4.x | On `PATH`, or set `BLENDER_BIN` (macOS app: `/Applications/Blender.app/Contents/MacOS/Blender`) |
| Spec JSON | `docs/engine-system/specs/<asset-id>.json` with `sockets[]` matching `SOCKETS_BY_SLOT` |
| GLB path | `public/engine-parts/mvp/<asset-id>.glb` |

Missing Blender → `npm run asset:blender` / `asset:normalize` / `asset:preview` exit **1** with DE/EN instructions. `npm run checks` does **not** call Blender.

## Recommended local loop

```bash
# 1) Normalize (overwrites MVP GLB unless --out)
npm run asset:normalize -- v3-part-water-traeger-01

# 2) Optional repack (no Blender)
npm run asset:optimize -- v3-part-water-traeger-01

# 3) Validate sockets + budgets
npm run asset:validate -- v3-part-water-traeger-01

# 4) Preview PNG (skip if exists; --force to overwrite)
npm run asset:preview -- v3-part-water-traeger-01 --force
# or:
npm run asset:blender -- render_preview v3-part-water-traeger-01 --force
```

Safe dry-run normalize:

```bash
npm run asset:normalize -- v3-part-water-traeger-01 --out /tmp/water.glb
```

## Scripts (what they do)

| Script | Role |
|--------|------|
| `validate_sockets.py` | Import GLB; every Spec `sockets[]` name must exist as a node `name` |
| `normalize_part.py` | Rotation/scale cleanup; center meshes; write GLB |
| `render_preview.py` | Fixed camera/light → `public/cards/engine/<id>.png` (512²) |

Shared path helpers: `tools/blender/common/paths.py` (safe ids, no path traversal).

## MVP trio smoke

```bash
for id in v3-part-water-traeger-01 v3-part-shadow-antrieb-01 v3-part-light-aufsatz-01; do
  npm run asset:blender -- validate_sockets "$id"
done
```

Pilot meshes: regenerate with `npm run generate:pilot-engine-glbs` — do **not** casually overwrite with `--all` box regen (`rendering.md`).

## Author checklist (short)

Full list: [`adding-a-new-part.md`](./adding-a-new-part.md). Minimum before PR:

1. Spec sockets = `SOCKETS_BY_SLOT[slot]`
2. `asset:validate` exit 0
3. Preview PNG only if shipping card art for that id
4. Bump Spec `version` when GLB/sockets change (feeds cache / `renderVersion` discipline)
