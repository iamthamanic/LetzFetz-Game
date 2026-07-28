# Modular Fetzgerät 3D — Architecture ADR

**Status:** Accepted for MVP  
**Date:** 2026-07-28  
**Issue:** #130  
**Stack:** Vite 6 + React 18 + TypeScript (npm). No Three.js on `main` at ADR time.

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
src/game/…                 # recipe, validate, renderKey (pure)
src/services/engineAssets/ # registry URLs, lookup (shared)
src/features/play/engine3d/# R3F canvas, assembler, snapshot helpers
public/engine-parts/       # GLB + generated previews
tools/asset-pipeline/      # CLI (npm scripts)
docs/engine-system/        # this folder
```

- **Do not** create `features/engine-builder` that Play must import.
- Card Forge / Library may use shared `services/engineAssets` + optional shared presentational components under `src/components/` if needed later.
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

**Exception (documented):** files under `src/features/play/engine3d/three/**` may use additional hooks required by `@react-three/fiber` / `@react-three/drei`. Do not spread that exception into `src/game/` or unrelated features.

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

MVP ID mapping (#132 locked — `engineParts36.ts` not authored yet; IDs stay stable for #133):

| Role | Part id | GLB |
|------|---------|-----|
| Wasser Träger | `v3-part-water-traeger-01` | `public/engine-parts/mvp/v3-part-water-traeger-01.glb` |
| Schatten Antrieb | `v3-part-shadow-antrieb-01` | `public/engine-parts/mvp/v3-part-shadow-antrieb-01.glb` |
| Licht Aufsatz | `v3-part-light-aufsatz-01` | `public/engine-parts/mvp/v3-part-light-aufsatz-01.glb` |

Registry: `src/services/engineAssets/partRegistry.ts` · Spec stubs: `docs/engine-system/specs/`

## 5. Socket contract (assets)

Named nodes inside GLB (authoritative for assembler):

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
  architecture.md          # this file
  gameplay-model.md        # stub → expand with #131
  rendering.md             # stub → expand with #133/#134
  asset-pipeline.md        # #134
  adding-a-new-part.md     # #134

src/game/types/engineVisual.ts   # #131
src/game/engine/engineRecipe.ts  # #131
src/services/engineAssets/       # #132 (partRegistry + types)
src/features/play/engine3d/      # #133–#134
public/engine-parts/mvp/         # #132 placeholder GLBs
docs/engine-system/specs/        # #132 part spec JSON stubs
scripts/generate-mvp-placeholder-glbs.ts  # regenerate MVP GLBs
tools/asset-pipeline/            # #134
```

## 8. Validation

Docs-only change for #130. Later issues must keep `npm run checks` green and **zero** `three` imports under `src/game/`.
