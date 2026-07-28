## Intent
Dokumentiere die Integrationsentscheidungen für das modulare 3D-Fetzgerät-System (Träger+Antrieb+Aufsatz) gegen die bestehende V3-Engine — ohne parallele zweite Spielregel-Architektur.

## User Journey
1. Dev liest `docs/engine-system/architecture.md`
2. Versteht: Recipe aus `bound[]`, Live-3D nur Forge/Detail, Karten = Snapshots/Previews
3. Kennt Slice-Pfad (`features/play/engine3d`), Hook-Ausnahme, npm (nicht pnpm)

## Problem
Großes Briefing existiert; Repo hat bereits Slots/Resonanz/36 Parts + KI-PNGs. Ohne ADR droht Doppelarchitektur und Feature→Feature-Imports.

## Solution
- `docs/engine-system/architecture.md` (+ kurze stubs: `gameplay-model.md`, `rendering.md`)
- Explizit: `traeger|antrieb|aufsatz` kanonisch; EN asset-IDs nur Adapter
- Recipe = View/Cache-DTO über Bound, nicht zweite Wahrheit
- R3F nur in `features/play/engine3d/three/**` (Hook-Ausnahme dokumentieren)
- Out of scope dieses Tickets: Code/Deps/GLB

## Runtime
| Axis | This slice |
|------|------------|
| Local (desktop) | yes |
| Cloud session | no |

## Edge Cases
- Keine neuen Gameplay-Regeln erfinden (Recycling/Upgrade) — nur Erweiterungspunkte nennen
- Bestehende `resonance.ts` / `fetzgeraet*` bleiben autoritativ

## Acceptance
- [x] `docs/engine-system/architecture.md` mit Ist-Architektur, Dateiplan, Risiken, MVP-Scope
- [x] Mapping Brief-Slots → Repo-Slots dokumentiert
- [x] Hook-/Slice-Entscheidungen festgehalten
- [x] Kein App-Code / keine Deps in diesem Ticket
- [x] Touched files: zero type escape hatches
- [x] Stubs: `gameplay-model.md`, `rendering.md`

## Design
Referenz: Agent-Analyse Modular 3D Engine System; V3 Dump §12–13; AGENTS.md

## Runner
Labels: agent-ready, P0
Feature slug: fetz-3d-adr

## Blockers
None
