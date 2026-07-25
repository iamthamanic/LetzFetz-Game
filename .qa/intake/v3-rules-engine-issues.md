# V3 Rules Engine issues — CREATED

Epic: `.qa/design/v3-rules-engine.md`  
Product lock: V3 1:1 target truth (no V2 phrase soft-layer).  
Repo: `iamthamanic/LetzFetz-Game`

| # | Priority | Title | featureSlug | Depends on |
|---|----------|-------|-------------|------------|
| #99 | P0 | V3 docs: promote rules WIP + AGENTS rule sources | `v3-docs-rulesource` | — |
| #100 | P0 | V3 types: statuses, shield, GameState + ruleset flag | `v3-status-gamestate` | #99 |
| #101 | P0 | V3 element impulse + primary marks | `v3-element-impulse-marks` | #100 |
| #102 | P0 | V3 combat: timing hook + damage/shield pipeline | `v3-combat-shield-pipeline` | #101 |
| #103 | P0 | V3 reaction matrix core + pick-reaction choice | `v3-reaction-matrix-core` | #102 |
| #104 | P0 | V3 mono reactions (6) + Dampf + P0 tests | `v3-mono-dampf-reactions` | #103 |
| #105 | P1 | V3 remaining 15 mixed reactions | `v3-mixed-reactions-15` | #104 |
| #106 | P1 | V3 status ticks + §18 conflict rules | `v3-status-ticks-conflict` | #105 |
| #107 | P1 | V3 Fetzgerät Träger/Antrieb/Aufsatz model | `v3-fetzgeraet-slots` | #106 |
| #108 | P1 | V3 element resonance for Fetzgerät | `v3-element-resonance` | #107 |
| #109 | P1 | Play UI: status chips + reaction modal | `v3-play-ui-status-reaction` | #103 |
| #110 | P2 | V3 ulti / transform / blueprint hooks | `v3-ulti-transform-hooks` | #108 |
| #111 | P2 | Pack schema: element impulse keywords | `v3-pack-impulse-schema` | #101 |
| #112 | P2 | Bot heuristics for reaction picks | `v3-bot-reaction-heuristics` | #105 |
| #113 | P2 | V3 E2E / verify-ui acceptance pass | `v3-e2e-verify-ui` | #109, #105, #106 |

Status: CREATED 2026-07-25
