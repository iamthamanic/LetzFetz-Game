# Adding a new Fetzgerät part

Checklist for authors and agents. Follow ADR [`architecture.md`](./architecture.md). Slots stay **Träger / Antrieb / Aufsatz** in gameplay; English recipe fields are DTO aliases only.

## 0. Preconditions

- [ ] Part has a stable **defId** (e.g. `v3-part-water-traeger-01`) shared by pack content and registry
- [ ] Slot role chosen: `traeger` | `antrieb` | `aufsatz`
- [ ] Required sockets for that role known (ADR §5)

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
- [ ] Or regenerate placeholders: `npm run generate:mvp-engine-glbs` (boxes only)

## 4. Registry

- [ ] Register in `src/services/engineAssets/partRegistry.ts`
- [ ] Bump `version` when GLB/sockets change (feeds cache invalidation via `renderVersion` / asset version)
- [ ] Extend Vitest in `partRegistry.test.ts` if MVP set grows

## 5. Recipe / cache

- [ ] Bound cards derive via `boundToRecipe` — do not persist a parallel engine DTO
- [ ] After material/camera/socket contract changes: bump `ENGINE_RENDER_VERSION` in `engineVisual.ts` (invalidates `createRenderKey` caches)
- [ ] Optional: warm cache with `requestEngineSnapshot(recipe)` from Play detail UI

## 6. Validate / preview (stubs today)

```bash
npm run asset:validate -- <id>
npm run asset:preview -- <id>
# or
npm run asset:all -- <id>
```

- [ ] Stubs exit 0 and print DE/EN paths — real socket/budget checks are follow-up ([`asset-pipeline.md`](./asset-pipeline.md))

## 7. Docs & checks

- [ ] Update this checklist / [`rendering.md`](./rendering.md) if sockets or surfaces change
- [ ] `npm run checks` green
- [ ] Zero `three` imports under `src/game/`
- [ ] No Meshy/API secrets in repo

## Out of scope (MVP)

- Full 36-part Meshy pipeline
- Per-card live WebGL
- Server-side snapshot rendering
