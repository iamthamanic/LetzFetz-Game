# Adding a new Fetzgerät part

Checklist for authors and agents. Follow ADR [`architecture.md`](./architecture.md) and the binding [`asset-specification.md`](./asset-specification.md). Slots stay **Träger / Antrieb / Aufsatz** in gameplay; English recipe fields are DTO aliases only.

## 0. Preconditions

- [ ] Part has a stable **defId** (e.g. `v3-part-water-traeger-01`) shared by pack content and registry
- [ ] Slot role chosen: `traeger` | `antrieb` | `aufsatz`
- [ ] Required sockets for that role known ([`asset-specification.md`](./asset-specification.md) / ADR §5 / `SOCKETS_BY_SLOT`)

## 1. Content / rules (if gameplay card)

- [ ] Author part in pack / `engineParts36` (or temporary demo only)
- [ ] Effects / charge / resonance stay in `src/game/` — **no** Three.js
- [ ] Card art fallback PNG optional under `public/cards/engine/<id>.png`

## 2. Spec stub

- [ ] Add `docs/engine-system/specs/<id>.json` (see MVP stubs)
- [ ] List `sockets`, `modelUrl`, `previewUrl`, `slot`, `version`

## 3. 3D asset

- [ ] Place GLB at `public/engine-parts/…/<id>.glb` (MVP: `public/engine-parts/mvp/`)
- [ ] Named EMPTY nodes match ADR socket contract
- [ ] Or regenerate placeholders: `npm run generate:mvp-engine-glbs` (boxes only — **skips** Spec `placeholder: false` / pilot)
- [ ] Pilot trio: `npm run generate:pilot-engine-glbs` then `npm run asset:validate -- <id>`
- [ ] Batch A/B/C: `npm run generate:batch-{a,b,c}-engine-glbs` (`scripts/generate-batch-glbs.ts`)

## 4. Registry

- [ ] Register in `src/services/engineAssets/partRegistry.ts`
- [ ] Bump `version` when GLB/sockets change (feeds cache invalidation via `renderVersion` / asset version)
- [ ] Extend Vitest in `partRegistry.test.ts` if MVP set grows

## 5. Recipe / cache

- [ ] Bound cards derive via `boundToRecipe` — do not persist a parallel engine DTO
- [ ] After material/camera/socket contract changes: bump `ENGINE_RENDER_VERSION` in `engineVisual.ts` (invalidates `createRenderKey` caches)
- [ ] Optional: warm cache with `requestEngineSnapshot(recipe)` from Play detail UI

## 6. Validate / preview

```bash
npm run asset:validate -- <id>
npm run asset:preview -- <id>
# or
npm run asset:all -- <id>
```

- [ ] `asset:validate` exits 0 (sockets + budgets) — see [`asset-pipeline.md`](./asset-pipeline.md)

## 7. Docs & checks

- [ ] Update this checklist / [`asset-specification.md`](./asset-specification.md) / [`rendering.md`](./rendering.md) if sockets or surfaces change
- [ ] `npm run checks` green
- [ ] Zero `three` imports under `src/game/`
- [ ] No Meshy/API secrets in repo

## Out of scope (MVP)

- Full 36-part Meshy pipeline
- Per-card live WebGL
- Server-side snapshot rendering
