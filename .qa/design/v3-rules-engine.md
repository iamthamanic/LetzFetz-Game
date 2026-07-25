# Design: V3 Rules Engine (Effekt-, Status-, Reaktionssystem)

<!-- feature-intake 2026-07-25 — LOCKED product decision overrides prior pingpong soft-layering -->

## Problem & Intent

**Problem:** `docs/letz-fetz-v3-überarbeitung.md` (1768 lines, saved) defines the full target combat fantasy: Elementimpulse, Marken, 21 Reaktionen, Schild, Status-Ticks, Fetzgerät Träger/Antrieb/Aufsatz, Resonanz, Ultis/Transform/Blueprints. The engine (`src/game/`) is V1 combat + V2 phrase board (`core`/`mode`/`tool`/`charge`). Prior design `.qa/design/v3-effect-reaction-system.md` soft-layered V3 as “Kampf layer” and kept V2 D8 free-row as permanent truth — **revoked**.

**Goal:** Implement V3 **1:1 as target rules truth**. Adapt V1/V2 docs toward V3. Vertical engine slices behind an optional rollout flag are OK, but the **target model is full V3** (slots, impulses, marks, reactions, shield, resonance) — not a hybrid that preserves V2 phrase-slots forever.

**Non-goals:** Big-bang single PR for all 21 reactions + blueprints; Next.js/DaisyUI; game-state server; printing physical decks; diluting V3 §12 slots to keep V2 E2 free-row.

## Non-Goals

- Keeping V2 phrase-slot board as permanent engine truth
- Soft-tags-only Träger/Antrieb/Aufsatz without slot semantics
- Shipping Area51 / Transformation / all Ulti hooks in P0
- Replacing Solo V1 playability before P0 tests pass (flagged rollout OK)

## Assumptions (LOCKED)

| # | Assumption | Decision |
|---|------------|----------|
| A1 | V3 source dump is canonical design input | `docs/letz-fetz-v3-überarbeitung.md` → promote to `docs/rules/SPIELANLEITUNG_V3_WIP.md` (+ DRAFT later) |
| A2 | Target Fetzgerät = Träger / Antrieb / Aufsatz | Adapt/replace V2 phrase (`core`/`mode`/`tool`) toward V3 slots — not soft tags forever |
| A3 | Engine rollout may use `ruleset` / pack flag | Flag gates execution; **target** = V3, not permanent V1+V2 hybrid |
| A4 | P0 = docs + status/shield model + impulse/marks + combat pipeline + reaction core + 6 mono + Dampf + Vitest | Festgelegt |
| A5 | Multi-reaction choice → `pendingChoice` (active player) | Reuse interrupt pattern |
| A6 | Prior Option A “V2 D8 wins” | **Revoked** |

## Research

| Source | Finding |
|--------|---------|
| `src/game/types/game.ts` | No `statuses` / `shield` on `PlayerState` |
| `src/game/engine/combat.ts` | Damage = attack − block only; no shield step |
| `src/game/types/matchMeta.ts` | `pendingChoice` union — extend for `pick-reaction` |
| `src/game/engine/phraseBuild.ts` | V2 phrase slots — migrate path toward V3 slots |
| `src/game/rules/elementSynergies.ts` | UI-only synergies — not reaction matrix |
| AGENTS.md | V1 engine truth today; V2 WIP/DRAFT; pure TS engine; UI → `dispatch` |
| Prior design `v3-effect-reaction-system.md` | Soft-layer / E2 wins — **superseded by this doc** |

## Options Considered

### Option A: V3-first vertical slices (recommended)

- **Summary:** Promote V3 rules docs; implement engine modules (`status/`, `reactions`, shield pipeline, slot model) in ordered P0→P2 slices. Flag for rollout only.
- **Pros:** Matches locked product decision; testable; no permanent dual-truth.
- **Cons:** Phrase→slot migration work; V1 Solo must stay green under default flag until cutover.
- **New dependencies?** no

### Option B: Soft-layer V3 on V2 phrase (revoked)

- Keep D8 free-row; Träger as tags only. **Rejected by user 2026-07-25.**

### Option C: YAGNI docs-only

- No engine. **Rejected** — matrix drifts without unit truth.

### Option D: Big-bang

- All 21 + blueprints + transform in one PR. **Rejected** — AGENTS / slice rules.

## Decision

**Chosen:** Option A — V3-first vertical slices  
**Why:** User locked 1:1 V3 as target truth; engine may slice vertically but must not dilute slots/reactions to preserve V2 phrase forever.

**Ponytail:** Rung 4 (reuse `pendingChoice`, pure TS modules, Vitest). Rung 1 YAGNI rejected for core combat fantasy.

## Cross-Domain Sign-Off

| Domain | Status | Note |
|--------|--------|------|
| KISS | ⚠️ | Cap P0 at mono+Dampf; defer blueprints |
| SOLID | ✅ | Status / impulse / reactions own modules |
| DRY | ✅ | One reaction table as data |
| Security | ✅ | Local-first; no new auth in epic |
| UI/UX | ⚠️ | Status chips + reaction modal DE; Styleguide primitives |
| Testability | ✅ | Vitest mandatory for `src/game/` |
| Maintainability | ⚠️ | AGENTS rule-source table must list V3 WIP |

## Confidence

**85%** — product decision locked; codebase mapped; slice plan sized.

## Implementation Sketch

```
docs/
  letz-fetz-v3-überarbeitung.md       (source dump — keep)
  rules/SPIELANLEITUNG_V3_WIP.md      (promote + grill conflicts)
  rules/SPIELANLEITUNG_V3_DRAFT.md    (later playable prose)
  AGENTS.md + .cursor/rules           (rule-source table)

src/game/types/
  status.ts                           (StatusId, stacks, marks)
  game.ts                             (+ statuses, shield)
  matchMeta.ts                        (+ pick-reaction pendingChoice)
  ruleset.ts                          (+ v3Combat / ruleset flag)
  cards.ts                            (slot: träger|antrieb|aufsatz path)

src/game/engine/status/
  applyStatus.ts
  tickStatuses.ts
  elementImpulse.ts
  reactions.ts                        (matrix + resolve)
  reactionChoice.ts
  shield.ts

src/game/engine/combat.ts             (Block → Shield → Prevent → HP)
src/game/engine/actions.ts            (timing hook §17)
src/game/engine/fetzgeraet/           (slots + resonance — P1)

src/features/play/…                   (status chips + reaction modal — P1)

tests: src/game/engine/status/*.test.ts
```

## Runtime matrix

| Area | Local | Cloud | Tauri |
|------|-------|-------|-------|
| Engine status/reactions | yes | n/a | later same TS |
| Play UI chips/modal | yes | n/a | later |
| Pack impulse keywords | local JSON | Appwrite later (out of scope) | later |

## UI direction (P1 play slice)

Playmat status chips + reaction pick modal — playful game tone (Styleguide), German labels, reuse `components/ui/` primitives. No DaisyUI.

## MVP cut (Ponytail Rung 1 deferred)

**Not in this epic’s issues yet (or P2 only):** physical token art, Steam, P2P signaling, full pack content rewrite of all cards, Area51 content authoring beyond hooks.

## Slice order

See `.qa/intake/v3-rules-engine-issues.md`.

## Ready for implement

**YES** after GitHub issues created — start with docs slice (issue 1), then types, then engine P0.

## Referenzen

- `docs/letz-fetz-v3-überarbeitung.md` (canonical dump)
- Supersedes: `.qa/design/v3-effect-reaction-system.md` (soft-layer — do not follow)
- `SPIELANLEITUNG_V1.md`, `SPIELANLEITUNG_V2_WIP.md` (adapt toward V3)
- `src/game/engine/actions.ts`, `combat.ts`, `phraseBuild.ts`
