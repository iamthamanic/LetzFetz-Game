# Feature: V5 combat: finish reaction matrix / copy parity §19–20

<!-- issue #283 -->

## Intent
Finish V5 combat reaction matrix and German copy parity with spielkonzept §19–20 (marks + additional reaction effects).

## Happy Path
- [ ] All 21 §19 primary reaction pairs resolve in engine with Vitest matrix smoke.
- [ ] DE reaction labels match spielkonzept names (Überhitzt, Dampf, …).
- [ ] Primary mark + §20 side-effect copy in Play matches spielkonzept prose.
- [ ] typed-strict clean; `npm run checks` green.

## Edge Cases
- [ ] Identical §20 side effects do not stack (applyStatus clamp / existing 1-stack).
- [ ] Light+Light Geblendet window (status `geblendet`).
- [ ] No-reaction → essence markIfNoReaction still works (regression).

## Regression
- [ ] Existing reactionChoice / mixedReactions / formulaResolve tests pass.

## Assumptions
- Engine reaction **ids** stay V3-compatible (`inferno`, `hotbox`, …); only DE labels + outcome bodies align to V5.
- Resonance bonuses remain optional on mono paths where already wired.
- Versteinert without formula target: W6→+0 via `high` (KISS stand-in) documented if needed.

## Screenshots
| Step | Filename |
|------|----------|
| 1 | n/a (engine + copy) |

## Security Coverage
- Local rules/UI copy only — no auth/network/UGC.

## Implementation Notes
- `REACTION_LABEL_DE` → spielkonzept §19 names (Überhitzt, Schmelze, …); engine ids unchanged.
- `reactionOutcomes.ts` rewritten for V5 §19 effect bodies; §20 side statuses via applySideOnce (no stack).
- Play `statusEffectCopy` High/Verstrahlt aligned to §18.
- Matrix smoke: `v5ReactionMatrix.test.ts` (21 pairs + non-stack).
- Tornado/Schlamm −2 attack approximated as Verwirbelt+Nebel (KISS).
