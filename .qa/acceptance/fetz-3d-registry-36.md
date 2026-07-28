## Intent
Alle 36 V3 Fetzgerät-Part-IDs in `partRegistry` + Platzhalter-GLBs mit Slot-Sockets, damit Assembler/Preview nicht nur MVP×3 kennt.

## User Journey
1. Beliebiger V3-Part aus `engineParts36` → `lookupEnginePartAsset` trifft
2. Generator kann Batch aller 36 GLBs erzeugen
3. Unbekannte IDs bleiben `null`

## Problem
Nur 3 MVP-IDs sind registriert; restliche Parts fallen auf PNG-only zurück ohne 3D-Pfad.

## Solution
- Specs unter `docs/engine-system/specs/` für alle 36 (minimal: id, slot, element, sockets)
- `npm run generate:mvp-engine-glbs` erweitern oder `generate:engine-part-glbs --all`
- Registry aus Specs/Pack ableiten (kein Hardcode-Drift)
- Vitest: 36 IDs resolvable; Socket-Set pro Slot korrekt
- Kein Meshy; weiterhin Box-Platzhalter

## Runtime
| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases
- Unbekannte Part-ID → `null`
- Bestehende MVP×3-IDs bleiben stabil (`water-traeger-01`, `shadow-antrieb-01`, `light-aufsatz-01`)

## Acceptance
- [ ] 36 GLBs unter `public/engine-parts/mvp/` (oder `parts/`)
- [ ] Registry deckt alle `V3_ENGINE_PARTS_36` ids
- [ ] `npm run checks` grün
- [ ] Touched files: zero type escape hatches

## Design
Depends on #132–#134  
docs/engine-system/architecture.md

## Runner
Labels: agent-in-progress, P0  
Feature slug: fetz-3d-registry-36

## Blockers
None (Meshy out of scope)

## Implementation Notes
- Catalog: `src/game/packs/v3/engineParts36.ts` → `V3_ENGINE_PARTS_36` (6 elements × 3 slots × 2 variants)
- Registry derives from catalog + `SOCKETS_BY_SLOT` (`slotSockets.ts`)
- Generator: `scripts/generate-mvp-placeholder-glbs.ts` writes 36 GLBs + 36 specs; `npm run generate:engine-part-glbs -- --all`
- Vitest: all 36 ids resolve; sockets match slot; GLB files present
- MVP demo trio ids preserved; unknown ids still `null`
