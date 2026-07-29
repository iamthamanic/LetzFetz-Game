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

No secrets in Git. Stub commands (`asset:spec`, …) print DE/EN status and exit 0. **`asset:model`** is real but **opt-in** (`--provider=meshy` + `MESHY_API_KEY`) — see [`asset-pipeline.md`](./asset-pipeline.md).

## MCP (optional / YAGNI)

| Topic | Policy |
|-------|--------|
| Productized Meshy MCP | Out of scope — use CLI `asset:model` (#198) |
| **letz-fetz-assets-mcp** (#199) | Thin stdio server: `tools/letz-fetz-assets-mcp/server.mjs` — tools **only** `spawnSync('npm', ['run', 'asset:…'])` |
| Cursor config | Point MCP `command` at `node` + absolute path to `server.mjs`; `cwd` = repo root |

### Tools (CLI mirrors)

| MCP tool | npm script |
|----------|------------|
| `validate_model` | `asset:validate -- <asset_id>` |
| `normalize_part` | `asset:normalize -- <asset_id>` |
| `optimize_part` | `asset:optimize -- <asset_id>` |
| `preview_part` | `asset:preview -- <asset_id>` |

`asset_id` must match `^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$`. Cwd is fixed to the repo root — no filesystem escape via tool args.

Example Cursor MCP entry (local only):

```json
{
  "mcpServers": {
    "letz-fetz-assets": {
      "command": "node",
      "args": ["tools/letz-fetz-assets-mcp/server.mjs"],
      "cwd": "/absolute/path/to/Letz-Fetz-Game"
    }
  }
}
```

Prefer teaching the CLI. Do not add parallel validate logic inside the MCP process.

## Related

- Blender steps: [`blender-workflow.md`](./blender-workflow.md)
- Failures: [`troubleshooting.md`](./troubleshooting.md)
- ADR placement: [`architecture.md`](./architecture.md) D5 (npm) · D7 (MCP out of scope)
