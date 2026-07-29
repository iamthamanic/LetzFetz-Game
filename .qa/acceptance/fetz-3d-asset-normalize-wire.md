# Acceptance: fetz-3d-asset-normalize-wire

**Issue:** #190  
**Slug:** `fetz-3d-asset-normalize-wire`

## Intent

Wire `asset:normalize` and `asset:optimize` to real offline tooling (Blender `normalize_part` + `@gltf-transform/core` repack/budget) so Brief §18 Phase 6 is reproducible via npm — no no-op stubs for these two commands.

## Preconditions

- Spec JSON at `docs/engine-system/specs/<id>.json`
- GLB at `public/engine-parts/mvp/<id>.glb`
- For normalize: Blender CLI on PATH or `BLENDER_BIN`
- Deps #184 (Blender scripts) and #189 (CLI suite) merged

## Happy Path

1. Author runs `npm run asset:normalize -- <id>` → Blender `normalize_part` rewrites working GLB (or `--out`)
2. Author runs `npm run asset:optimize -- <id>` → gltf-transform repack + byte-budget check
3. `npm run asset:validate -- <id>` can still exit 0 for MVP pilot parts

## Edge Cases

- Missing Blender → normalize exit 1 with clear DE/EN message
- Missing/unsafe id → exit 2
- Missing GLB → exit 1
- Optimize over `maxBytes` (spec or default) → exit 1 after write attempt / report
- Overwrite of source GLB documented (use git to revert; `--out` for alternate path)

## Acceptance Criteria

- [ ] `asset:normalize` / `asset:optimize` are not pure no-op stubs
- [ ] After normalize (local Blender), validate can pass for an MVP id
- [ ] Docs in `docs/engine-system/asset-pipeline.md` + blender README updated
- [ ] `npm run checks` green (does not require Blender)
- [ ] Touched files: zero type escape hatches

## Security Coverage

- F-03 / path traversal: asset ids single-segment safe regex (same as validate/preview)
- B-01 / secrets: no API keys; local Blender + in-repo gltf-transform only
- P-04: no network in normalize/optimize runners
- Out of scope: Meshy/Tripo (#198), MCP (#199), publish stub

## Implementation Notes

- `tools/asset-pipeline/normalize.mjs` → `tools/blender/run.mjs normalize_part` (preview.mjs pattern); `--out` passthrough
- `tools/asset-pipeline/optimize.mjs` → `@gltf-transform/core` NodeIO repack + Spec `maxBytes` / 512 KiB default
- package.json `asset:normalize` / `asset:optimize` point at real runners; stubs removed for those cmds
- Docs: `docs/engine-system/asset-pipeline.md`, `tools/blender/README.md`
