## Intent
Reine TypeScript-Domäne: aus Bound-Karten ein deterministisches `EngineRecipe` ableiten, validieren und Render-Keys erzeugen — ohne React/Three.

## User Journey
1. Bound hat Träger (+ optional Antrieb/Aufsatz)
2. `boundToRecipe` / `validateRecipe` liefern ok oder Fehler
3. `createRenderKey` ist stabil bei gleichem Rezept+Seed+renderVersion

## Problem
Darstellung braucht ein Rezept-DTO; Gameplay bleibt `players.*.bound`.

## Solution
- `src/game/types/engineVisual.ts`
- `src/game/engine/engineRecipe.ts` — `boundToRecipe`, `validateRecipe`, `createRenderKey`, optional Display-Name
- Vitest in `src/game/engine/engineRecipe.test.ts`
- **Kein** `three`-Import in `src/game/`

## Runtime
| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases
- Nur Antrieb/Aufsatz ohne Träger → invalid / keine aktive Engine
- Zwei Träger → invalid
- V1/Phrase-Mode: `effectiveFetzSlot` mappt phrase → Fetz-Slot; Charge übersprungen

## Acceptance
- [x] Typen + pure Funktionen + Vitest grün
- [x] `npm run checks` grün
- [x] Kein Three/React in game/
- [x] Touched files: zero type escape hatches
- [x] ADR-Pfade respektiert (`engineVisual.ts`, `engineRecipe.ts`)

## Design
Depends on #130
docs/engine-system/architecture.md

## Runner
Labels: agent-ready, P0
Feature slug: fetz-3d-recipe-domain

## Blockers
Depends on #130 (merged)

## Implementation Notes
- `EngineRecipe` + `EngineRecipeValidation` in `src/game/types/engineVisual.ts`
- `boundToRecipe` / `validateRecipe` / `validateBoundRecipe` / `createRenderKey` / `createEngineDisplayName` in `src/game/engine/engineRecipe.ts`
- Slot mapping: traeger→carrierId, antrieb→driveId, aufsatz→attachmentId via `effectiveFetzSlot`
- Vitest: 9 cases including empty, drive-only, Träger partial, full three, two Träger, stable render key
- `docs/engine-system/gameplay-model.md` expanded from stub
- Exported from `src/game/types` and `src/game/engine` barrels
