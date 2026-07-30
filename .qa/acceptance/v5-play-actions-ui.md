# Acceptance: v5-play-actions-ui

**Issue:** #227  
**Design:** `.qa/design/v5-play-actions-ui.md`

## Intent
PlayView/Phase-Coach dispatches V5 Formel- and Aktionsoptionen inkl. Gegenstand and Großformel.

## Happy Path
1. V5 match: Formelphase — bauen/ersetzen/schnellmix/aktivieren/skip via footer + hand.
2. Aktion: Angriff → FormulaRig challenge target or direct; Großformel when charge===3; Item when legal.
3. V1 base match still uses Engine bauen / Ultimativkarte.

## Edge Cases
- Pending combat block window unchanged.
- Empty formula: no challenge targets.
- FetzChargeConfirm only when not v5Formula.

## Acceptance Criteria
- [x] MVP Formelaktionen + Hauptaktionen inkl. Item/Großformel when legal
- [x] Challenge-UI for Formelkomponenten
- [x] V1 Base still playable
- [x] npm run checks
- [x] typed-strict clean

## Security Coverage
UI + local engine only — Secure-by-Default OOS.

## Implementation Notes
- Engine: `PLAY_ITEM` for action-timing V5 items; formula challenge targets reuse `CHALLENGE`.
- UI: BuildPhaseBar Formel copy + activate; ActionPhaseBar Großformel; FormulaRig clickable targets; hand `play-item`.
- FetzChargeConfirm gated behind `!v5Formula`.
