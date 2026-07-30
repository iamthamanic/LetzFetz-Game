# Design — V5 legacy soft-retire (#232)

## Decision

Keep V3 Bound / Fetz-3D code and assets, but remove them from the default Play path. Gate Live-3D behind `!v5Formula`, label V3 setup as Legacy, update living docs.

## Approach

- Named helper `shouldShowBoardEngineLiveZone` (testable) instead of ad-hoc `!v5Formula` only in JSX
- PlayView never builds Live-3D recipes under V5
- Cheatbox hides 3D assembler toggle for V5 matches
- Docs: SPIELUEBERSICHT tiles, AGENTS default line, engine-system ADR banner

## Non-goals

- Hard-delete assets or V3 packs
- New Formel 3D pipeline
