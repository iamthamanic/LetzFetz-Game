# Acceptance: fetz-3d-adapter-pair-display

**Issue:** #191  
**Slug:** `fetz-3d-adapter-pair-display`

## Intent

Pure TS `selectAdapters` + pair/full resonance display DTOs from bound/recipe/pack (Brief §9) — no Three.js; UI can show DE combination hints.

## Preconditions

- Pack with engine parts; bound and/or `EngineRecipe`
- Optional `RulesetConfig` (V3 combat for resonance texts)

## Happy Path

1. Bound Träger+Antrieb same element under V3 → pair-reaction DTO with DE text
2. Recipe with carrier+drive → adapter selection DTO for drive joint
3. Incomplete recipe → empty arrays, no throw

## Edge Cases

- Empty / partial recipe → empty adapters / empty reactions
- `V1_RULESET` / `v3Combat` false → empty reaction DTOs (neutral)
- Unknown defIds in pack → skip element; still list structural adapters

## Acceptance Criteria

- [ ] Pure functions + Vitest for adapter selection / pair display
- [ ] Zero `three` imports in `src/game/`
- [ ] `gameplay-model.md` short section; `npm run checks` green
- [ ] Touched files: zero type escape hatches

## Security Coverage

- No secrets / network / user HTML — pure DTOs
- Out of scope: AdapterModel mesh, Play HUD wiring (optional later)

## Implementation Notes

- `src/game/engine/adapterPairDisplay.ts` — `selectAdapters`, `selectAdaptersFromBound`, `resolvePairReactions`
- Vitest: `adapterPairDisplay.test.ts` (9 cases)
- Docs: `docs/engine-system/gameplay-model.md` section
- Exported from `src/game/engine/index.ts`
