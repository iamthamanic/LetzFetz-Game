# Acceptance: v3-docs-rulesource

## Intent
Promote V3 to rules WIP + AGENTS rule-source table; mark V1/V2 relationship; Phrase vs Slots conflict resolved toward V3.

## Skip reason
Docs-only slice — no feature code. Verify via file presence + `npm run checks`.

## Happy Path
- SPIELANLEITUNG_V3_WIP.md exists and points at dump
- AGENTS Regelquellen lists V3
- V2_WIP notes V3 slots win

## Security Coverage
Out of scope (documentation only; no auth/UGC/network).

## Implementation Notes
Done in issue #99.
