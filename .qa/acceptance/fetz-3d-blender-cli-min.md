# Acceptance: fetz-3d-blender-cli-min

**Issue:** #184  
**Slug:** `fetz-3d-blender-cli-min`

## Intent

Ship `tools/blender/` with `normalize_part.py`, `validate_sockets.py`, `render_preview.py` (+ `common/`) and a Node runner that fails clearly when Blender is missing.

## Acceptance Criteria

- [ ] `tools/blender/` with normalize / validate_sockets / render_preview (+ common)
- [ ] validate_sockets checks Spec sockets; fail ≠ 0
- [ ] render_preview documented for MVP trio (local Blender)
- [ ] Missing Blender → clear DE/EN message, exit ≠ 0
- [ ] `npm run checks` green
- [ ] Path-safe asset ids; no secrets

## Implementation Notes

- tools/blender/{validate_sockets,normalize_part,render_preview}.py + common/paths.py
- run.mjs + npm run asset:blender; missing Blender → exit 1 DE/EN
- Docs: tools/blender/README.md + asset-pipeline.md
