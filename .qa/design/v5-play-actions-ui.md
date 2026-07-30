# Design: v5-play-actions-ui (#227)

**Slug:** `v5-play-actions-ui`  
**Stand:** 2026-07-30  
**Epic:** `.qa/design/v5-formula-migration.md`

## Intent

Play footer + hand + FormulaRig dispatch V5 Formelphase and action options (incl. Item stub + Großformel) without Bound/Fetz-Charge UX for `v5Formula` matches.

## Decision (Ponytail)

| Area | Approach |
|------|----------|
| Formelphase | Reuse build-select/hand flow; map `FORMULA_BUILD`/`REPLACE`/`SCHNELLMIX` like build; footer Activate + Skip |
| Challenge | Same `CHALLENGE` + attack pending; FormulaRig slots set `targetBoundInstanceId` |
| Großformel | Existing `PLAY_ULTIMATE` button; DE label when v5 |
| Items | Add minimal `PLAY_ITEM` in engine (action timing); hand interaction like boost |
| Legacy | Unchanged Bound/Build/FetzChargeConfirm when `v5Formula` off |

## Non-goals

- Full item effect parity / reaction items in combat window
- Presentation animations for every formula action
- Bot heuristics (#228)

## UI copy (DE)

- Formel bauen / Formel aktivieren / Skip Formelphase
- Großformel spielen (v5) vs Ultimativkarte spielen (legacy)
- Challenge coach: Gegner-Formel antippen
