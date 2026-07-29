# Acceptance: fetz-3d-asset-preview-real

**Issue:** #185

## Intent
Real `asset:preview` via Blender; MVP trio PNGs committed; ship flag + id set.

## Implementation Notes
- `preview.mjs` → `tools/blender/run.mjs render_preview`
- Trio PNGs under `public/cards/engine/`
- `ENGINE_PART_PNG_ART_SHIPPED=true` + `ENGINE_PART_PNG_SHIPPED_IDS` (trio only)
- Removed accidental `__pycache__` from git; gitignore Python cache
