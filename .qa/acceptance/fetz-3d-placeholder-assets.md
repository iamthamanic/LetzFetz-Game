## Intent
Drei Platzhalter-GLBs mit Sockets + Registry, gemappt auf bestehende V3-Part-IDs (Wasser-Träger, Schatten-Antrieb, Licht-Aufsatz).

## User Journey
1. Registry löst `v3-part-*` → `modelUrl` + Socket-Metadaten
2. Fehlendes Asset → kontrollierter Fehler (Dev) / Fallback-Flag (`null`)
3. Previews optional stubben (`previewUrl` → bestehendes PNG-Konventionspfad bis GLB-Preview existiert)

## Problem
Ohne standardisierte Sockets kein Assembler.

## Solution
- `public/engine-parts/mvp/` — 3 minimale GLBs mit Nodes: SOCKET_DRIVE / SOCKET_OUTPUT / SOCKET_ATTACK_ORIGIN (+ optional VFX sockets)
- `src/services/engineAssets/partRegistry.ts` — 3 Einträge, IDs aus ADR-Mapping (`v3-part-*-01`)
- Spec-JSON stubs unter `docs/engine-system/specs/`
- Generator: `scripts/generate-mvp-placeholder-glbs.ts` (gltf-transform devDep)
- Kein Meshy/Blender-Vollpipeline; kein Three.js Runtime

## Runtime
| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases
- Unbekannte Part-ID → `null`
- Alte PNG-Arts bleiben Fallback für Kartenrahmen (`previewUrl`)

## Acceptance
- [x] 3 GLBs + Registry + Lookup-Tests
- [x] Socket-Namen dokumentiert
- [x] `npm run checks` grün
- [x] Touched files: zero type escape hatches

## Design
Depends on #131  
docs/engine-system/architecture.md

## Runner
Labels: agent-ready, P0  
Feature slug: fetz-3d-placeholder-assets

## Blockers
Depends on #131 (merged)

## Implementation Notes
- MVP part ids (ADR; `engineParts36.ts` not in repo yet): `v3-part-water-traeger-01`, `v3-part-shadow-antrieb-01`, `v3-part-light-aufsatz-01`
- GLBs: `public/engine-parts/mvp/*.glb` via `scripts/generate-mvp-placeholder-glbs.ts` (`@gltf-transform/core` devDep)
- Registry: `src/services/engineAssets/partRegistry.ts` + `types.ts` + Vitest
- Spec stubs: `docs/engine-system/specs/*.json`
- Docs lightly updated: architecture / gameplay-model / rendering
- `npm run checks` green; no Three.js runtime dep
