# Intake: fetz-v3-production-followups

**Status:** CREATED 2026-07-28  
**Design:** `.qa/design/fetz-v3-production-followups.md`  
**JSON:** `.qa/intake/fetz-v3-production-followups-issues.json`

## Restate (confirmed)

Production follow-ups after Fetz-3D MVP + V3 cutover: (1) real asset pipeline + pilot GLBs instead of placeholder boxes, (2) board thumbs from #146 snapshot cache, (3) remaining V3 checklist UX gaps — vertical P0/P1 slices, not mega-issues.

## Issues (order)

| # | Priority | Title | Feature slug | Depends |
|---|----------|-------|--------------|---------|
| #164 | P0 | Asset pipeline: real GLB socket + budget validate | `fetz-asset-validate-real` | — |
| #165 | P0 | Ship pilot real GLBs for MVP trio parts | `fetz-glb-pilot-three` | #164 |
| #166 | P0 | Board thumbs: prefer engine snapshot cache | `fetz-board-snapshot-thumbs` | — |
| #167 | P1 | V3 StatusChips: Marken/Buff Wirkungscopy tooltips | `v3-status-effect-copy` | — |
| #168 | P1 | V3 Combat stage: Angriffstypen-Copy (§10) | `v3-combat-attack-type-copy` | — |
| #169 | P1 | V3 Träger Ladung-Spend Confirm UI | `v3-traeger-charge-confirm` | — |

## Deferred (not issues)

- Mass 36 GLB replace, Meshy/Blender productization
- Headless WebGL snapshot writer
- Blueprint / Ulti / Transform teaching UIs
- Full Dump §5.2–5.18 effect catalog
- In-app full Regelbuch (§20)
