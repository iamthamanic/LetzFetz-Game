# Acceptance: fetz-3d-asset-cli-stubs

**Issue:** #189  
**Slug:** `fetz-3d-asset-cli-stubs`

## Intent

Brief §18 CLI suite as clear stubs with exit codes — no fake AI, path-safe ids.

## Acceptance Criteria

- [ ] Core Brief commands as npm scripts (stub or real validate/preview)
- [ ] Exit-code contract documented in `asset-pipeline.md`
- [ ] `npm run checks` green
- [ ] No network / secrets in stubs

## Implementation Notes

- `tools/asset-pipeline/stub.mjs` + package.json scripts for asset:* stubs and assets:* batch
- Real: validate / preview / all / blender unchanged
