# Feature: Ship pilot real GLBs for MVP trio parts

<!-- ecc-runner #165 — 2026-07-28 -->

## Intent
Replace placeholder box GLBs for the MVP trio with distinctive low-poly meshes that pass `asset:validate` and assemble in WeaponAssembler.

## Happy Path
- [ ] Three pilot GLBs under `public/engine-parts/mvp/`
- [ ] Specs `placeholder: false`, higher triangle budget, `version: 2`
- [ ] `npm run asset:validate` passes for all three
- [ ] Docs note pilot vs placeholder regen
- [ ] Registry / render version bumped; checks green

## Implementation Notes
- Generator: `scripts/generate-pilot-real-glbs.ts` → `npm run generate:pilot-engine-glbs`
- Carrier: octagon prism; Drive: tapered hex; Attachment: spike
- Remaining 33 parts untouched; `ENGINE_RENDER_VERSION` + registry `ASSET_VERSION` → 2
