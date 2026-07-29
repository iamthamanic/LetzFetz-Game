# Troubleshooting (Fetzgerät 3D)

**Issue:** #194  
**Covers Brief-style ops failures:** sockets, WebGL, snapshot cache, Blender CLI.  
**Evidence-only** — no invented features. See code under `src/components/engine3d/`, `src/features/play/engine3d/`, `tools/`.

## Socket / assemble errors

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Dev overlay / console: socket missing for asset id | GLB node `name` ≠ Spec `sockets[]` / `SOCKETS_BY_SLOT` | Align EMPTY names; `npm run asset:validate -- <id>` or `asset:blender -- validate_sockets <id>` |
| Prod German fallback over canvas | Blocking socket issue in production build | Same as above; do not ship mismatched pilots |
| Antrieb/Aufsatz not docking | Missing `SOCKET_DRIVE` / `SOCKET_OUTPUT` on parent | Re-export GLB with named sockets per [`asset-specification.md`](./asset-specification.md) |

## WebGL / canvas

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| „3D-Vorschau nicht verfügbar (WebGL fehlt).“ | No WebGL context | GPU/driver; headless CI may skip visual tests (`test.skip` — not silent green) |
| Two 3D views / heavy lag | Second R3F canvas | Forbidden — Play board zone owns Live-3D; opponent uses 2D thumbs only ([`rendering.md`](./rendering.md)) |
| Flicker / empty buffer on snapshot | `preserveDrawingBuffer` / capture timing | Board auto-warmup after montage; force via panel **Snapshot cachen** when debugging |

## Snapshot cache

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Stale look after material/GLB change | Same `createRenderKey` | Bump `ENGINE_RENDER_VERSION` or call `invalidateEngineSnapshot` |
| IDB miss after reload | Corrupt / `rv*` mismatch | Hydrate drops bad rows; clear site data if stuck |
| Always 1×1 stub | Capture failed / no canvas | Ensure WebGL path; check warmup status text |

Visual regression after intentional look change: `npm run test:e2e:visual-mvp:update` ([`rendering.md`](./rendering.md)).

## Blender / CLI

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Exit 1 „Blender fehlt“ | Not on PATH | Install Blender 4.x or set `BLENDER_BIN` |
| `normalize` overwrote a good GLB | Default in-place write | Use `--out`; recover with `git checkout -- public/engine-parts/mvp/<id>.glb` |
| `optimize` exit 1 | Over `budgets.maxBytes` | Reduce mesh or raise Spec budget deliberately |
| Preview PNG unchanged | Idempotent skip | Pass `--force` to `render_preview` / `asset:preview` |
| Path / id rejected | Unsafe asset id | Single path segment only (`^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$`) |

## Performance (mobile)

See [`mobile-perf-report.md`](./mobile-perf-report.md). Outline auto-disables on reduced-motion / low cores / low `deviceMemory`. Target ≥30 FPS on real devices; keep **one** canvas.

## Still stuck?

1. `npm run checks`  
2. `npm run asset:validate -- <id>`  
3. Compare Spec JSON ↔ `SOCKETS_BY_SLOT` in `src/services/engineAssets/slotSockets.ts`  
4. ADR constraints: [`architecture.md`](./architecture.md) (D1 recipe, D3 one canvas, D7 no MCP product)
