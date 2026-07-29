# MCP and CLI setup (Fetzgerät 3D)

**Issue:** #194  
**Status:** Ops guide  
**Authority:** **npm CLI is authoritative.** MCP (if any) is optional sugar — never a second source of truth.

## CLI first (required)

Install deps once, then use package scripts only:

```bash
cd Letz-Fetz-Game
npm ci   # or npm install
npm run checks          # build + unit — no Blender
npm run asset:validate -- <asset-id>
npm run asset:preview -- <asset-id>
npm run asset:normalize -- <asset-id>
npm run asset:optimize -- <asset-id>
npm run asset:blender -- validate_sockets|normalize_part|render_preview <asset-id>
```

Exit codes: `0` OK · `1` real failure · `2` usage — see [`asset-pipeline.md`](./asset-pipeline.md).

Environment:

| Variable | Purpose |
|----------|---------|
| `BLENDER_BIN` | Absolute path to Blender when not on `PATH` |

No secrets, no network calls in the asset CLI suite. Stub commands (`asset:spec`, `asset:model`, …) print DE/EN status and exit 0 — they do **not** invent Meshy/paid APIs.

## MCP (optional / YAGNI)

| Topic | Policy |
|-------|--------|
| Productized MCP server for assets | **Out of scope** for MVP (ADR D7 — no Meshy/Tripo MCP productization) |
| Cursor / agent MCP wrappers | If added later, they must **shell out to the same npm scripts** — no duplicated validate/normalize logic |
| This doc | Bedienhinweis only: prefer teaching the CLI; do not maintain parallel MCP schemas here |

When an agent needs assets: run `npm run asset:…` (or document the exact command). Do not invent MCP tools that re-implement `tools/asset-pipeline/*.mjs` or `tools/blender/*.py`.

## Related

- Blender steps: [`blender-workflow.md`](./blender-workflow.md)
- Failures: [`troubleshooting.md`](./troubleshooting.md)
- ADR placement: [`architecture.md`](./architecture.md) D5 (npm) · D7 (MCP out of scope)
