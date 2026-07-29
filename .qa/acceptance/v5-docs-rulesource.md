# Acceptance: v5-docs-rulesource

<!-- seeded from issue #218 — refined by implement -->

## Intent
Regelquellen und Produktübersicht auf V5 als Zielwahrheit umstellen; V1 als Regression, V3 als Vorgänger markieren. Docs-only.

## Skip reason (UI)
Docs-only — no `@verify-ui`.

## Happy Path
- [ ] `docs/rules/SPIELANLEITUNG_V5_DRAFT.md` existiert mit Phasen + Formel + Kampfkern
- [ ] `AGENTS.md` listet V5 als Produkt-Default-Ziel; V1 Regression dokumentiert
- [ ] `docs/SPIELUEBERSICHT_AKTUELL.md` spiegelt V5-Ziel und Legacy-Tiles
- [ ] `.cursor/rules/project-core.mdc` Pointer auf V5
- [ ] `npm run checks` grün
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Edge Cases
- [ ] V1/V3 Docs bleiben, klar als historisch/Regression gelabelt
- [ ] Kein Löschen von `SPIELANLEITUNG_V1.md`

## Security Coverage
Out of scope (documentation only; no auth/UGC/network).

## Implementation Notes
- Added `docs/rules/SPIELANLEITUNG_V5_DRAFT.md`
- Updated nested + workspace `AGENTS.md`, `SPIELUEBERSICHT_AKTUELL.md`, `project-core.mdc`
- Included `docs/letz-fetz-v5-spielkonzept.md` (was untracked) and intake design artifacts
