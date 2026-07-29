# Asset specification (Fetzgerät 3D)

**Status:** Binding for authors + CLI  
**Issue:** #182  
**Code source of truth:** `src/services/engineAssets/slotSockets.ts` (`SOCKETS_BY_SLOT`)  
**See also:** [architecture.md](./architecture.md) · [asset-pipeline.md](./asset-pipeline.md) · [adding-a-new-part.md](./adding-a-new-part.md) · [rendering.md](./rendering.md)

This document is the **human-readable** production contract. Machine checks live in `npm run asset:validate` and per-part JSON under `docs/engine-system/specs/`. Do **not** invent socket names here — only document what `SOCKETS_BY_SLOT` already defines.

## 1. Identity & paths

| Field | Rule |
|-------|------|
| `id` | Pack defId, single path segment: `^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$` (e.g. `v3-part-water-traeger-01`) |
| Slot | Gameplay: `traeger` \| `antrieb` \| `aufsatz` (German roles). Recipe DTO may use `carrier` / `drive` / `attachment` as **aliases only** (ADR D1) |
| Element | `fire` \| `water` \| `earth` \| `air` \| `light` \| `shadow` |
| GLB | `public/engine-parts/mvp/<id>.glb` → URL `/engine-parts/mvp/<id>.glb` |
| Spec JSON | `docs/engine-system/specs/<id>.json` |
| Card preview PNG | `public/cards/engine/<id>.png` → URL `/cards/engine/<id>.png` |
| `version` | Integer; bump when GLB or socket layout changes |

## 2. Socket contract

Named EMPTY (or equivalent transform) nodes inside the GLB. Assembler attaches children by **exact** node `name`.

Authoritative map (`SOCKETS_BY_SLOT`):

### Träger (`traeger`)

| Socket | Role |
|--------|------|
| `SOCKET_DRIVE` | Attach Antrieb |
| `SOCKET_ATTACHMENT_FALLBACK` | Optional attach when drive path unavailable |
| `SOCKET_VFX_REAR` | Rear VFX / exhaust cue |

```text
ROOT
├── visible mesh(es)
├── SOCKET_DRIVE
├── SOCKET_ATTACHMENT_FALLBACK
└── SOCKET_VFX_REAR
```

### Antrieb (`antrieb`)

| Socket | Role |
|--------|------|
| `SOCKET_OUTPUT` | Attach Aufsatz |
| `SOCKET_VFX_CORE` | Core element VFX |
| `SOCKET_EXHAUST` | Exhaust / plume |

```text
ROOT
├── visible mesh(es)
├── SOCKET_OUTPUT
├── SOCKET_VFX_CORE
└── SOCKET_EXHAUST
```

### Aufsatz (`aufsatz`)

| Socket | Role |
|--------|------|
| `SOCKET_ATTACK_ORIGIN` | Attack / projectile origin |
| `SOCKET_VFX_FRONT` | Front VFX |

```text
ROOT
├── visible mesh(es)
├── SOCKET_ATTACK_ORIGIN
└── SOCKET_VFX_FRONT
```

**Validate rule:** every name in the part’s `sockets[]` (and thus `SOCKETS_BY_SLOT[slot]`) must appear as a glTF node `name` in the GLB. Missing sockets → `asset:validate` exit `1`; runtime: loud error + debug marker in development, controlled German fallback in production (ADR §5).

Default EMPTY translations for placeholders (world units) are in `SOCKET_TRANSLATIONS` — production meshes may differ but must keep the same names.

## 3. Spec JSON shape (shipped)

Current stubs match registry needs (not the full Brief §14 example with `movingParts` / `animations` — those are optional future fields).

```json
{
  "id": "v3-part-water-traeger-01",
  "name": "Wasser-Träger 01",
  "slot": "traeger",
  "element": "water",
  "sockets": [
    "SOCKET_DRIVE",
    "SOCKET_ATTACHMENT_FALLBACK",
    "SOCKET_VFX_REAR"
  ],
  "modelUrl": "/engine-parts/mvp/v3-part-water-traeger-01.glb",
  "previewUrl": "/cards/engine/v3-part-water-traeger-01.png",
  "budgets": {
    "maxTriangles": 256,
    "maxTexturePx": 0,
    "placeholder": false
  },
  "version": 2,
  "pilot": true
}
```

| Field | Notes |
|-------|--------|
| `sockets` | Must equal `SOCKETS_BY_SLOT[slot]` for that part |
| `budgets.placeholder` | `true` = unit-box / temporary mesh; `false` = authored or pilot mesh |
| `pilot` | Optional; MVP prove-out trio (#165) only |
| `budgets.maxTexturePx` | `0` = no texture budget enforced yet |

## 4. Budgets

| Budget | CLI default (if omitted in spec) | Notes |
|--------|----------------------------------|--------|
| `maxTriangles` | **12 000** | Estimated from GLB indices/3 |
| `maxBytes` | **512 KiB** | File size on disk |
| Brief §14 production ceiling | 30 000 tris / 2048 tex | Target for future production meshes; validate defaults are stricter until raised per-spec |

Placeholder boxes use very low `maxTriangles` (e.g. 48). Pilot meshes (#165) use higher but still small budgets (e.g. 256) with `placeholder: false`.

Over budget → `asset:validate` exit `1`.

**Runtime (mobile preview):** interactive floor ≥30 FPS / ≤1 Live-3D canvas — see [`mobile-perf-report.md`](./mobile-perf-report.md). Triangle/byte caps above are unchanged by the #193 measure pass.

## 5. Material names (semantic classes)

Gameplay **never** reads materials for rules (ADR D6). Central mapping / toon outline is a follow-up (`EngineMaterials`). Authors should name glTF materials with stable prefixes so remapping works:

```text
MAT_METAL
MAT_RUBBER
MAT_GLASS
MAT_WOOD
MAT_CONCRETE
MAT_CERAMIC
MAT_ELEMENT_CORE
MAT_EMISSION
```

Element look guidance (art, not rules): Feuer = soot/glow; Wasser = tanks/hoses; Erde = stone/steel; Luft = open frames/rotors; Licht = bright emission; Schatten = matte dark voids. See Brief §11.

## 6. Preview contract

| Layer | Path / behavior |
|-------|-----------------|
| Per-part static PNG | `previewUrl` → `/cards/engine/<id>.png` under `public/cards/engine/` |
| Ship gate | `ENGINE_PART_PNG_ART_SHIPPED` in `src/services/cardArt/manifest.ts` — **false** until previews exist (avoids broken `<img>`) |
| Engine snapshot | In-app cache keyed by `createRenderKey(recipe)`; not a substitute for per-part card PNG |
| CLI `asset:preview` | Today: stub / path hint; target: fill `public/cards/engine/` from GLB (Blender `render_preview` or canvas) |

Until PNGs ship: card UI uses gradient/icon fallback; board thumbs prefer snapshot cache when warm.

## 7. Pilot vs placeholder

| Class | Spec flags | GLB source | Regen |
|-------|------------|------------|--------|
| **Placeholder** (33 parts) | `budgets.placeholder: true` | Unit boxes via `npm run generate:mvp-engine-glbs` | Overwrites **all** MVP GLBs — do not run casually over pilots |
| **Pilot** (3 parts) | `placeholder: false`, optional `pilot: true`, `version: 2` | Distinct low-poly meshes | `npm run generate:pilot-engine-glbs` then `asset:validate` |

MVP pilot trio:

| Role | Part id |
|------|---------|
| Wasser Träger | `v3-part-water-traeger-01` |
| Schatten Antrieb | `v3-part-shadow-antrieb-01` |
| Licht Aufsatz | `v3-part-light-aufsatz-01` |

## 8. Assembly attachment order

1. Load Träger → find `SOCKET_DRIVE`
2. Attach Antrieb under that socket
3. Attach Aufsatz under Antrieb `SOCKET_OUTPUT`
4. Missing socket → controlled fallback (no blank crash)

Axis convention for authors: forward along local +Z of the part root unless a future spec field overrides; keep origins consistent with `SOCKET_TRANSLATIONS` for placeholders.

## 9. Validation commands

```bash
npm run asset:validate -- <asset-id>   # exit 0/1/2 — see asset-pipeline.md
npm run asset:preview -- <asset-id>    # preview path / stub
npm run asset:all -- <asset-id>        # validate then preview
```

No Meshy/Tripo secrets in git. No `three` imports under `src/game/`.

## 10. Out of scope (this doc)

- Inventing sockets beyond `SOCKETS_BY_SLOT`
- Full Brief §14 `movingParts` / `animations` enforcement (document later when CLI needs them)
- Meshy/Tripo productization, own MCP server
- Free orbit on every card; SSR
