# Gameplay model (Fetzgerät ↔ 3D)

**Status:** Domain code (#131)  
**See also:** [architecture.md](./architecture.md)

## Match truth

- Built parts live in `GameState.players[id].bound` with `fetzSlot` (or legacy `phraseSlot`).
- Shared charge: `fetzCharge`.
- Resonance: `src/game/engine/status/resonance.ts`.
- Part defs: `EnginePartCardDef` in pack (`V2_P100_PACK` / future `engineParts36`).

## Visual recipe

`EngineRecipe` (`src/game/types/engineVisual.ts`) is derived from bound role slots via `boundToRecipe`. It does **not** replace bound state.

| Fetzgerät slot | Recipe field |
|----------------|--------------|
| `traeger` | `carrierId` |
| `antrieb` | `driveId` |
| `aufsatz` | `attachmentId` |

Helpers: `src/game/engine/engineRecipe.ts`

- `boundToRecipe(bound, options?)` — first defId per role; charge skipped (`effectiveFetzSlot`)
- `validateRecipe(recipe)` — Träger required for active engine
- `validateBoundRecipe(bound)` — ≤1 per role + recipe rules
- `createRenderKey(recipe)` — stable string for cache/snapshots
- `createEngineDisplayName(pack, recipe)` — optional German label

Validation rules (MVP):

1. No Träger → no active engine (Antrieb/Aufsatz alone invalid for assemble).
2. At most one card per `traeger` / `antrieb` / `aufsatz`.
3. Charge-bound cards are not part of the 3D recipe.
4. Empty bound → empty recipe, invalid.

## Effects

3D never computes damage, resonance, or activate costs. UI reads existing engine helpers.
