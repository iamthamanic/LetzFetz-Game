# Feature: V6 Slice 0: recipe generator pipeline + CI fail-closed

<!-- seeded by ecc-runner from issue #312 on 2026-08-03 — @implement may refine -->

## Intent
Add a V6 formula-recipe **build-time generator** with fail-closed validation and a CI/check gate (`generate` then `git diff --exit-code` or project-equivalent). Empty/minimal authoring must pass; missing required keys must fail.

## Happy Path
- [ ] - [ ] Generator script + npm script exist and run locally.
- [ ] - [ ] Empty/minimal authoring validates OK; missing required keys fail closed.
- [ ] - [ ] Check/CI regenerates and fails on drift (`git diff --exit-code` or project-equivalent).
- [ ] - [ ] Short docs note in `docs/letz-fetz-v6-spielkonzept.md` and/or `.qa/design/`.
- [ ] - [ ] No V6 playable menu; no runtime formula composer; V5 regression green.
- [ ] - [ ] `npm run checks` green (include new gate if folded into checks).
- [ ] - [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Edge Cases
- [ ] (from .qa/edge-cases.md + @implement)

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
- `scripts/generate-v6-formula-recipes.ts` + `npm run generate:v6-formula-recipes`
- Fail-closed validation in `src/content/v6/validateFormulaAuthoring.ts` (+ Vitest)
- `npm run check:v6-formula-recipes` (generate + git diff --exit-code) folded into `npm run checks`
- Design note: `.qa/design/v6-slice0-generator.md`
