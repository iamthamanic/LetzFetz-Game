# Acceptance: v3-status-gamestate

## Intent
Typmodell für Statusmarken, Buffs/Debuffs und Schild in GameState; Ruleset-Flag `v3Combat` (default false).

## Happy Path
- createGame setzt `statuses: []`, `shield: 0`
- clampShield / clampStatusStacks respektieren §19
- DEFAULT_RULESET.v3Combat === false

## Edge Cases
- Schild >5 → clamp
- Unbekannte Status-IDs → isStatusId false

## Security Coverage
Out of scope (local engine types only).

## Implementation Notes
Issue #100 — types + createGame + cloneState + invariants.
