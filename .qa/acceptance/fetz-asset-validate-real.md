# Feature: Asset pipeline: real GLB socket + budget validate

<!-- ecc-runner #164 — refined by implement 2026-07-28 -->

## Intent
Replace the asset-pipeline validate stub with real checks: GLB exists, named sockets match the part slot / spec, triangle + byte budget gates — exit 1 on failure.

Roadmap: fetz-v3-production-followups. Feature slug: `fetz-asset-validate-real`. Issue #164.

## Preconditions
- Specs under `docs/engine-system/specs/*.json` with `sockets` + `budgets`
- Placeholder GLBs already embed SOCKET_* empty nodes
- CLI: `npm run asset:validate -- <asset-id>`

## Happy Path
- [ ] Known id with valid GLB + sockets under budget → exit 0, DE/EN report
- [ ] Missing GLB → exit 1
- [ ] Missing required socket node → exit 1
- [ ] Over `budgets.maxTriangles` or max bytes → exit 1
- [ ] Usage / bad id → exit 2
- [ ] `docs/engine-system/asset-pipeline.md` documents real checks
- [ ] Touched files: zero type escape hatches; `npm run checks` green

## Edge Cases
- [ ] Unknown id (no spec) → exit 1
- [ ] Path traversal id → exit 2
- [ ] Preview PNG still optional

## Regression
- [ ] `asset:preview` / `asset:all` still run
- [ ] Existing MVP GLBs pass validate

## Assumptions
- Budget defaults from spec JSON; if `maxTriangles` missing use 12000; max bytes default 512 KiB
- Socket list from spec.sockets (authoritative)

## Security Coverage
- No network / secrets; path-safe asset ids only
- Out of scope: auth, P2P, UGC upload

## Implementation Notes
- `tools/asset-pipeline/validate.mjs` — parse GLB JSON chunk for SOCKET_* nodes; triangle estimate from accessors; budgets from spec / defaults
- Exit 0/1/2 as documented; all 36 current MVP GLBs pass
- Docs: `docs/engine-system/asset-pipeline.md` real-check section
