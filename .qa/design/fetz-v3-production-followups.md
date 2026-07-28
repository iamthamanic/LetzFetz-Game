# Design: Fetz V3 Production Follow-ups

<!-- feature-intake 2026-07-28 — user approved create + ecc-runner-loop -->

## Problem & Intent

**Problem:** Three production gaps remain after the Fetz-3D MVP (#130–#146) and V3 cutover:

1. All 36 `public/engine-parts/mvp/*.glb` files are ~1 KB placeholder boxes — not production meshes.
2. Board / card thumbs still resolve via registry `previewUrl` → `/cards/engine/{id}.png` even though #146 shipped `requestEngineSnapshot` + in-memory cache.
3. `V3_INTEGRATION_GAP_CHECKLIST.md` still lists UX/content holes (Marken-Wirkungscopy, Angriffstypen-Copy, Träger-Spend Confirm, etc.) after Engine-Default = V3.

**Goal:** Ship incremental vertical slices — real asset validation + 1–3 pilot GLBs, board thumb cutover to snapshot cache, and the highest-value remaining V3 UX gaps — without a mega-issue or Meshy big-bang.

**Non-goals:** Mass-replace all 36 GLBs; Meshy/Tripo/Blender full pipeline productization; Steam/Tauri; Blueprint/Ulti/Transform authoring UIs; full Dump §5.2–5.18 effect catalog rewrite; in-app full Regelbuch.

## Non-Goals (deferred / YAGNI)

| Deferred | Why |
|----------|-----|
| All 36 production GLBs | Incremental after pilot prove-out |
| Offline headless WebGL snapshot writer | In-app canvas path + placeholder fallback enough |
| Meshy/paid generation + secrets | Keep out of git; CLI stays local |
| Area51 Blueprint UI / Ulti teaching / Transform UX | Hooks exist; content/UI later epic |
| Generic Dump effect-system for every §5 keyword | Playtestability first; catalog later |
| Physische Marker/Token | Out of repo |

## Assumptions (MVP cuts — no further user Q&A)

| # | Assumption | Decision |
|---|------------|----------|
| A1 | Pilot set = docs MVP trio | `v3-part-water-traeger-01`, `v3-part-shadow-antrieb-01`, `v3-part-light-aufsatz-01` |
| A2 | “Real GLB” = distinctive per-slot mesh + named sockets | Hand-authored / script-exported GLB OK; not Meshy-required |
| A3 | Snapshot cache stays Play-owned | `features/play/engine3d/rendering/` — board is Play; no Feature→Feature |
| A4 | Board thumbs: cache hit → data URL; miss → `previewUrl` / card art | No offscreen WebGL in this epic |
| A5 | V3 gaps sliced from checklist ❌/🟡 UX rows only | Not “whole dump” |
| A6 | Architecture | No Three in `src/game/`; German UI; shared `components/engine3d` + `services/engineAssets` |

## Research — Was im Repo schon da ist

| Area | Paths |
|------|--------|
| ADR + pipeline docs | `docs/engine-system/{architecture,asset-pipeline,rendering,adding-a-new-part}.md` |
| 36 specs | `docs/engine-system/specs/v3-part-*.json` |
| Placeholder GLBs | `public/engine-parts/mvp/*.glb` (~1.2 KB each) |
| Registry | `src/services/engineAssets/{partRegistry,slotSockets,types}.ts` |
| CLI stubs | `tools/asset-pipeline/{validate,preview,all}.mjs` — exit 0 always |
| Shared R3F | `src/components/engine3d/` (`EnginePreviewCanvas`, `WeaponAssembler`, `PartModel`) |
| Snapshot cache (#146) | `src/features/play/engine3d/rendering/{engine-snapshot-cache,requestEngineSnapshot}.ts` |
| Board art today | `BoundCardSlot` / `BoardCard` → `resolveCardArtPath` → registry `previewUrl` |
| V3 gaps | `docs/rules/V3_INTEGRATION_GAP_CHECKLIST.md`, WIP, Dump, DRAFT |
| Prior epic | `.qa/design/v3-rules-engine.md` (engine truth largely shipped) |

## Options Considered

### Option A: Incremental production follow-ups (recommended)

- Pipeline validate → pilot 3 GLBs → board snapshot thumbs → 3 V3 UX slices.
- **Pros:** Ponytail-sized PRs; reuses #146; checklist-driven.
- **Cons:** Board thumbs stay stub until preview warms cache.

### Option B: Big-bang 36 GLBs + Meshy

- **Rejected** — YAGNI, cost, secrets, >800 LOC risk.

### Option C: Docs-only gap refresh

- **Rejected** — user wants production + UX slices.

## Decision

**Chosen:** Option A  
**Ponytail:** Rung 1 for Meshy/mass assets; Rung 4 reuse snapshot cache + registry + checklist.

## Cross-Domain Sign-Off

| Domain | Status | Note |
|--------|--------|------|
| KISS | ✅ | Pilot 3 parts; cache miss → PNG |
| SOLID | ✅ | Validate CLI / registry / Play thumbs / V3 UI separate slices |
| DRY | ✅ | One registry; one snapshot API |
| Security | ✅ | No secrets; local assets only |
| UI/UX | ✅ | DE copy; Styleguide primitives for Confirm |
| Testability | ✅ | Vitest for game/helpers; CLI exit codes |
| Architecture | ✅ | No Feature→Feature; no Three in `src/game/` |

## Runtime matrix

| Slice area | Local | Cloud | Appwrite |
|------------|-------|-------|----------|
| Asset CLI / GLBs | yes | no | skip |
| Board snapshot thumbs | yes (in-memory) | no | skip |
| V3 UX chips/modals | yes | no | skip |

## UI direction

Play stays hybrid-playful (existing Styleguide). No landing redesign. Confirm modal = existing `components/ui` Modal/Button. Status tooltips = short DE Wirkungscopy, not Regelbuch dump.

## Implementation sketch (paths only)

1. `tools/asset-pipeline/validate.mjs` — real socket/budget checks  
2. `public/engine-parts/mvp/{pilot}.glb` + optional `docs/engine-system/specs` notes  
3. Play board: helper near `requestEngineSnapshot` / cardArt — prefer cache for engine parts in `BoundCardSlot` / `BoardCard`  
4. `StatusChips` + copy module for §6/§7  
5. `combatStageCopy` — Angriffstypen §10  
6. Träger spend Confirm — Play board / CharacterDock charge path  

## Slice order

See `.qa/intake/fetz-v3-production-followups-issues.md`.
