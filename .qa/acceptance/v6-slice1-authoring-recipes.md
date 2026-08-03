# Feature: V6 Slice 1: authoring subset + fail-closed Slice-1 recipes (INTERNAL)

<!-- seeded by ecc-runner from issue #318 — refined by @implement -->

## Intent
Author the **Slice-1 card + recipe subset** under `src/content/v6/`, expand the generator so it emits TE / TK / EK / TEK / Überformel recipes fail-closed, and list only Slice-1 cards on `V6_CORE_PACK`. Still INTERNAL — no Play-Default flip, no runtime composer.

## Preconditions
- Slice 0 on main (`v6Formula`, generator, `V6_CORE_PACK` stub, isolation probes).
- Working tree on `issue/318-v6-slice1-authoring-recipes`.

## Happy Path
- [ ] Slice-1 authoring tables exist for TE/TK/EK/TEK (+ Überformel).
- [ ] Generator + `check:v6-formula-recipes` fail closed on missing/drifted recipes.
- [ ] `V6_CORE_PACK` lists only Slice-1 formula cards + Späti/Vulkan arenas.
- [ ] No V6 path imports V5 `formulaCombinations` / combo catalog.
- [ ] No runtime composer; Play-Default remains V5; still INTERNAL.
- [ ] V5 regression green; `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases
- Empty authoring fails Slice-1 completeness (`V6_SLICE1_INCOMPLETE`).
- Duplicate recipeIds fail at generate-time.
- No Play setup / menu wiring in this ticket.

## Out of scope
- Engine plan/execute, match lifecycle, UI preview, Setup flag.

## Security Coverage
- F/B auth/secrets: N/A (local content + generator only).
- UGC: N/A (authored pack data, not player upload).

## Regression
- [ ] Existing V5 pack/tests and `npm run checks` remain green.

## Assumptions
- Playtest TE/TK/EK primary numbers are Slice-1 placeholders until balance playtests.

## Screenshots
N/A (content/generator — no UI).

## Implementation Notes
- `formulaAuthoring.slice1.ts` builds 9 TE + 12 TK + 12 EK + 4 catalyst transforms.
- Generator expands to 105 recipes (incl. 36 TEK + 36 Überformel).
- Pack version `0.1.0-slice1`; ultimates cleared; instant glitches filtered out of core.
