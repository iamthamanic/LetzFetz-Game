# Acceptance: fetz-3d-glb-batch-fire-water

**Issue:** #195  
**Slug:** `fetz-3d-glb-batch-fire-water`

## Intent

Replace Batch A placeholders (fire ×6 + remaining water ×5) with distinctive meshes + Spec sockets; validate exit 0.

## Implementation Notes

- `scripts/generate-batch-a-glbs.ts` + `npm run generate:batch-a-engine-glbs`
- Placeholder `--all` skips `placeholder: false` / pilot
- Registry `ASSET_VERSION` → 3; docs in rendering + adding-a-new-part
