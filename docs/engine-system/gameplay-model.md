# Gameplay model (Fetzgerät ↔ 3D)

**Status:** Stub — domain code in #131  
**See also:** [architecture.md](./architecture.md)

## Match truth

- Built parts live in `GameState.players[id].bound` with `fetzSlot`.
- Shared charge: `fetzCharge`.
- Resonance: `src/game/engine/status/resonance.ts`.
- Part defs: `EnginePartCardDef` in pack (`engineParts36.ts`).

## Visual recipe

`EngineRecipe` is derived from bound role slots. It does not replace bound state.

Validation rules (MVP):

1. No Träger → no active engine (Antrieb/Aufsatz alone invalid for assemble).
2. At most one card per `traeger` / `antrieb` / `aufsatz`.
3. Charge-bound cards are not part of the 3D recipe.

## Effects

3D never computes damage, resonance, or activate costs. UI reads existing engine helpers.
