# Modular Fetzgerät 3D — Architecture ADR

**Status:** Soft-retire for default Play (legacy V3) — Accepted for MVP historically  
**Date:** 2026-07-28 (updated 2026-07-30, #232)  
**Issue:** #130  
**Stack:** Vite 6 + React 18 + TypeScript (npm).

> **Legacy V3:** Fetzgerät Live-3D (`BoardEngineLiveZone`) and Bound Träger/Antrieb/Aufsatz are **not** the Play default. Default matches use **V5 Formel** + `FormulaRig`. This folder documents the modular 3D pipeline for Forge/Build and for the explicit **V3 Playtest** tile. Do not treat Fetz-3D as the product visual target.

## 1. Goal

Keep Letz Fetz as a **2D card game**. Represent Fetzgerät builds (Träger + Antrieb + Aufsatz) with **standardized 3D modules** so the same part looks identical on the card preview, in the forge/detail assembler, and in cached engine snapshots.

KI-generated PNGs under `public/cards/engine/` become **concept / fallback art**, not the long-term modular source of truth.

## 2. Current system (do not replace)

| Layer | Location | Role |
|-------|----------|------|
| Rules | `src/game/` | Pure TS; no React/DOM/Three |
| Slots | `FetzgeraetSlot` = `traeger` \| `antrieb` \| `aufsatz` | Authoritative role model |
| Bound state | `players.*.bound` + `fetzSlot` | Match truth for built parts |
| Charge | `fetzCharge` | Shared pool |
| Effects | `fetzgeraetEffects.ts` | Passives / activate |
| Resonance | `resonance.ts` + `ResonanceHud` | ×2 / ×3 element tiers |
| Content | `V3_PACK` / `engineParts36.ts` | 36 authored parts |
| Play UI | `features/play/board/*` | Slot row, labels, HUD |
| Card art | `public/cards/engine/*.png` | Current 2D illustrations |

V2 phrase slots (`core` / `mode` / `tool`) map via `PHRASE_TO_FETZ` / `FETZ_TO_PHRASE` — keep that adapter; do not invent a second slot vocabulary in gameplay code.

## 3. Decisions

### D1 — Recipe is a view/cache DTO, not match truth

```ts
// Conceptual — implemented in follow-up #131
interface EngineRecipe {
  carrierId: string;      // traeger defId
  driveId?: string;       // antrieb defId
  attachmentId?: string;  // aufsatz defId
  cosmeticSeed: number;
  renderVersion: number;
}
```

- Derive with `boundToRecipe(bound, pack)`.
- Validate: active engine requires Träger; max one part per role slot.
- Never store a parallel “built engine” that can drift from `bound[]`.
- Gameplay effects continue to read `bound` + pack defs + resonance helpers.

English field names (`carrier` / `drive` / `attachment`) are **DTO aliases only**. Registry and UI labels stay Träger / Antrieb / Aufsatz.

### D2 — Feature slice placement (no Feature→Feature imports)

```text
src/game/…                    # recipe, validate, renderKey (pure)
src/services/engineAssets/    # registry URLs, lookup (shared)
src/components/engine3d/      # R3F canvas + assembler (shared Play + Forge)
src/features/play/engine3d/   # Play panel, MVP demo, snapshot helpers
public/engine-parts/          # GLB + generated previews
tools/asset-pipeline/         # CLI (npm scripts)
docs/engine-system/           # this folder
```

- **Do not** create `features/engine-builder` that Play must import.
- Card Forge / Library use shared `services/engineAssets` + `src/components/engine3d/` — no Feature→Feature.
- `App.tsx` remains composition root.

### D3 — Live 3D only where it pays off

| Surface | Rendering |
|---------|-----------|
| Hand, library grid, board tooltips, small slot thumbs | Static PNG / WebP (pack art or GLB preview / snapshot) |
| Engine detail / build highlight / forge-style preview | **One** R3F canvas |
| Optional activation VFX | Same canvas or short overlay — later |

Never mount a Three.js canvas per hand card.

### D4 — React hooks vs R3F

Project default hooks: `useState` / `useRef` / `useEffect`.

**Exception (documented):** files under `src/components/engine3d/three/**` may use additional hooks required by `@react-three/fiber` / `@react-three/drei`. Do not spread that exception into `src/game/` or unrelated features.

### D5 — Package manager and CLI

- Use **npm** (`package-lock.json`), not pnpm.
- Asset commands: `npm run asset:…` mirroring `tools/audio-forge` patterns.

### D6 — Materials / toon look

Central material mapping and toon/outline live in the play `engine3d` layer (follow-up). Gameplay never reads material names for rules.

### D7 — Out of scope for MVP issues (#130–#134)

- Full 36-part GLB production
- Meshy/Tripo deep integration / MCP server productization
- Recycling / scrap economy rules (extension point only)
- Free 3D orbit on every card
- Server-side rendering
- New global state library

## 4. MVP vertical slice (issues)

| Issue | Scope |
|-------|--------|
| #130 | This ADR + stub docs |
| #131 | `EngineRecipe` domain + Vitest |
| #132 | 3 placeholder GLBs + `partRegistry` mapped to existing V3 IDs |
| #133 | R3F `WeaponAssembler` + one Play detail canvas |
| #134 | Snapshot memory cache + `asset:*` CLI stubs + `adding-a-new-part.md` |

Catalog (#143): `src/game/packs/v3/engineParts36.ts` → `V3_ENGINE_PARTS_36` (6×3×2 = 36). Registry + GLBs derive from it.

MVP demo trio (#132 locked, still in the 36):

| Role | Part id | GLB |
|------|---------|-----|
| Wasser Träger | `v3-part-water-traeger-01` | `public/engine-parts/mvp/v3-part-water-traeger-01.glb` |
| Schatten Antrieb | `v3-part-shadow-antrieb-01` | `public/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` |
| Licht Aufsatz | `v3-part-light-aufsatz-01` | `public/engine-parts/mvp/v3-part-light-aufsatz-01.glb` |

Registry: `src/services/engineAssets/partRegistry.ts` · Spec stubs: `docs/engine-system/specs/` (36) · Regenerate: `npm run generate:engine-part-glbs -- --all`

## 5. Socket contract (assets)

Named nodes inside GLB (authoritative for assembler). Full human-readable contract: [`asset-specification.md`](./asset-specification.md) (mirrors `SOCKETS_BY_SLOT`).

**Träger:** `SOCKET_DRIVE`, optional `SOCKET_ATTACHMENT_FALLBACK`, `SOCKET_VFX_REAR`  
**Antrieb:** `SOCKET_OUTPUT`, `SOCKET_VFX_CORE`, `SOCKET_EXHAUST`  
**Aufsatz:** `SOCKET_ATTACK_ORIGIN`, `SOCKET_VFX_FRONT`

Missing sockets: loud error + debug marker in development; controlled fallback in production (no blank crash).

## 6. Risks

1. Scope creep into full asset pipeline before assembler works — mitigate with placeholders first.  
2. Mobile WebGL cost — one canvas only; reduce motion via existing `prefersReducedMotion`.  
3. Dual truth if Recipe is persisted without deriving from Bound — forbidden by D1.  
4. Hook-policy conflict — contained by D4.  
5. Dirty / parallel KI PNG workflow — keep PNGs as fallback until GLB previews ship.

## 7. File plan (target)

```text
docs/engine-system/
  architecture.md          # this file (ADR index)
  asset-specification.md   # sockets / budgets / preview contract
  gameplay-model.md        # recipe / adapters (game layer)
  rendering.md             # surfaces, cache, materials, visual/mobile
  asset-pipeline.md        # npm asset:* CLI
  blender-workflow.md      # #194 Blender ops loop
  mcp-and-cli-setup.md     # #194 CLI authority; MCP YAGNI
  troubleshooting.md       # #194 sockets / WebGL / cache / CLI
  mobile-perf-report.md    # #193 measure + budgets
  adding-a-new-part.md     # author checklist

src/game/types/engineVisual.ts
src/game/engine/engineRecipe.ts
src/services/engineAssets/       # partRegistry + types
src/components/engine3d/         # shared canvas
src/features/play/engine3d/      # panel + snapshot
public/engine-parts/mvp/         # GLBs
docs/engine-system/specs/        # part spec JSON
scripts/generate-mvp-placeholder-glbs.ts
tools/asset-pipeline/
tools/blender/
```

## 8. Validation

Docs-only change for #130. Later issues must keep `npm run checks` green and **zero** `three` imports under `src/game/`.
