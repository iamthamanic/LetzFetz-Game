# V5 Formula Migration — Issues CREATED

Epic: `.qa/design/v5-formula-migration.md`
Repo: `iamthamanic/LetzFetz-Game`

| # | Priority | Title | featureSlug | Depends on |
|---|----------|-------|-------------|------------|
| #218 | P0 | V5 docs: promote spielkonzept + AGENTS + SPIELUEBERSICHT | `v5-docs-rulesource` | — |
| #219 | P0 | V5 types: formula slots, card kinds, visual contracts, ruleset flag | `v5-formula-types` | #218 |
| #220 | P0 | V5 engine: Formelphase actions (build/replace/activate/schnellmix/skip) | `v5-formula-phase-actions` | #219 |
| #221 | P0 | V5 engine: formula resolution (Teil-/Vollformel + prep hooks) | `v5-formula-resolution` | #220 |
| #222 | P0 | V5 engine: challenge disturb/destroy + start restore | `v5-challenge-disturbed` | #221 |
| #223 | P0 | V5 engine: Fetzladung max 3 + Großformel gate | `v5-charge-grossformel` | #221 |
| #224 | P0 | V5 combat: align marks/reactions/shield copy to spielkonzept §17–20 | `v5-combat-matrix-align` | #219 |
| #225 | P0 | V5 pack: MVP deck (9 formula + items + mix) + Play setup tile | `v5-mvp-pack` | #220–#224 |
| #226 | P1 | V5 visual recipe + Formula Rig Playmat (composed core) | `v5-visual-recipe-rig` | #225 |
| #227 | P1 | V5 Play UI: wire Formelphase + items + challenge + Großformel | `v5-play-actions-ui` | #226, #222 |
| #228 | P1 | V5 bot heuristics for formula phase and charge | `v5-bot-formula` | #227 |
| #229 | P1 | V5 characters: passives + Großformel texts per §25 | `v5-character-grossformel` | #225 |
| #230 | P1 | V5 Build: retarget Combinate slots to Technik/Essenz/Katalysator | `v5-build-slots-retarget` | #219 |
| #231 | P2 | V5 full formula content: remaining techniques/essences/catalysts + items | `v5-full-formula-content` | #225, #229 |
| #232 | P2 | V5 legacy soft-retire: Bound-4 / Fetz-3D not default; gate V3 pack | `v5-legacy-soft-retire` | #227, #230 |
| #233 | P2 | V5 E2E / verify-ui: solo formula match smoke | `v5-e2e-verify-ui` | #228, #232 |

Status: CREATED 2026-07-29

Runner: `@ecc-runner-loop`
