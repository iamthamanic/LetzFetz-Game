# Epic: V5 Post-Cutover Parity

**Slug:** `v5-post-cutover-parity`  
**Stand:** 2026-07-30  
**Predecessor:** `.qa/design/v5-formula-migration.md` (Epic #218–#233 CLOSED)  
**Source of truth:** `docs/letz-fetz-v5-spielkonzept.md`  
**Locale:** de (UI) / en (code)

---

## Problem & Intent

V5 is the **Play default** after cutover (Formelphase, Charge 3, VisualRecipe, soft-retire Legacy). Remaining gaps are **content/engine parity** and **docs/e2e polish** — not another ruleset flag flip.

Goal: Close playtest-blocking stubs so Solo vs Bot matches spielkonzept for formula effects, character passives (incl. choice UIs), items/reactions, and deck size — then art/docs/e2e as capacity allows.

## Priority buckets

### P0 — Playtest blockers

| # | Slice | Intent |
|---|-------|--------|
| 1 | Engine formulaEffect kinds | No silent stubs; every shipped `formulaEffect.kind` resolves in `formulaResolve` + combat hooks |
| 2 | Character passives + choice UIs §25 | Wire deferred passives (Pillendoktora choice, Mysterium element pick, Kokabell stability, …) beyond copy-only |
| 3 | Items effect parity + reaction items | Full item resolve + combat UI for reaction-timing items |
| 4 | Combat reaction matrix §19–20 | Finish mark/reaction copy + engine parity vs spielkonzept |

### P1 — Content & presentation

| # | Slice | Intent |
|---|-------|--------|
| 5 | Pack main deck → 106 | Rematch element mix (54 vs BASE 60) so deck = concept §3.1 |
| 6 | Art: item PNGs + formula visual profiles | Assets/profiles for all 36 formula cards + 6 items |
| 7 | Meshy batch MVP-9 | **needs-human** — no credit spend without re-confirm; prefer data contracts if blocked |

### P2 — Later / polish

| # | Slice | Intent |
|---|-------|--------|
| 8 | Formelgestell 3D compose | Replace soft-retired Fetz-3D default path with composed formula rig |
| 9 | Docs: SPIELUEBERSICHT + living docs | V5 default language everywhere humans look |
| 10 | E2E solo formula win/rematch | Optional full match through win; defer if too large |

## Non-goals

| Deferred | Why |
|----------|-----|
| Online P2P / Tauri / Steam | Outside V5 parity |
| Hard-delete V1 Base / V3 packs | Regression paths stay |
| All 1.728 animation IDs | VisualRecipe property-driven |
| WebP second render pipeline | After perf evidence |
| Burning Meshy credits without confirmation | Issue 7 labeled `needs-human` |
| Big-bang rewrite of combat outside §19–20 gaps | Surgical parity only |

## Assumptions (locked)

1. Play-Default stays **`v5Formula`**; `'base'` = V1 regression.
2. Engine remains pure TS in `src/game/`; UI dispatches actions only.
3. Touched files: typed-strict / Boy Scout; Vitest for engine changes.
4. German UI strings; English code/commits.
5. Sequential merges on `main` via `@ecc-runner-loop` (no stacked PR chains).

## Design links

- Epic parent: `.qa/design/v5-formula-migration.md` (Non-Goals / Out of MVP)
- Rules: `docs/rules/SPIELANLEITUNG_V5_DRAFT.md` + spielkonzept §3, §15–20, §25
- Intake: `.qa/intake/v5-post-cutover-issues.md`

## Runner

`@ecc-runner-loop` — user approved create issues + merge-in-loop (2026-07-30).
