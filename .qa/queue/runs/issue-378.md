# Issue #378 — V6 Standard-Glitches

**phase:** ship
**branch:** feat/378-v6-standard-glitches
**acceptance:** `.qa/acceptance/v6-standard-glitches.md`

## Done
- V6 pack ships 7 Standard-Glitches with Aktionsphase/Reaktion timing (no Sofort)
- Engine: formula targets under v6Formula (Kurzschluss/Systemfehler/Download)
- Play UI: pending glitch → Formelziel (+ Abwurf for Download)
- Tests + SPIELANLEITUNG_V6 / Spielregeln / spielkonzept
- `npm run checks` PASS

## Pipeline
- verify: PASS
- review: PASS (scoped)
- ecc-check: READY (checks green)
