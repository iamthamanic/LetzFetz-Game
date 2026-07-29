# Gameplay model (Fetzgerät ↔ 3D)

**Status:** Domain code (#131)  
**See also:** [architecture.md](./architecture.md)

## Match truth

- Built parts live in `GameState.players[id].bound` with `fetzSlot` (or legacy `phraseSlot`).
- Shared charge: `fetzCharge`.
- Resonance: `src/game/engine/status/resonance.ts`.
- Part defs: `EnginePartCardDef` in pack (`V2_P100_PACK`); V3 id catalog `V3_ENGINE_PARTS_36` in `src/game/packs/v3/engineParts36.ts`.
- 3D asset lookup (URLs/sockets only): `lookupEnginePartAsset` in `src/services/engineAssets/partRegistry.ts` — all 36 `v3-part-*` ids from the catalog.

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

## Adapter + pair-reaction display (#191)

Pure display helpers in `src/game/engine/adapterPairDisplay.ts` (no Three.js, not match truth):

| API | Role |
|-----|------|
| `selectAdapters(recipe, pack)` | Deterministic joint list (`drive` / `attachment`) for montage/HUD |
| `selectAdaptersFromBound(bound, pack)` | Same via `boundToRecipe` |
| `resolvePairReactions(bound, pack, ruleset)` | DE DTOs for V3 §13 pair (tier 2) + full (tier 3) resonance |

- Incomplete recipe / bound → empty arrays (no throw).
- `v3Combat` off (`DEFAULT_RULESET` / V1) → empty reaction DTOs.
- Effect application stays in `resonance.ts`; these APIs only feed UI copy.

## Effects

3D never computes damage, resonance, or activate costs. UI reads existing engine helpers (`resonance.ts`, `adapterPairDisplay.ts`).
