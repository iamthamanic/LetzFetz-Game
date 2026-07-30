# Acceptance — V5 legacy soft-retire (#232)

## Intent

Bound-4 / Fetzgerät Live-3D are not the Play default. Default is V5 Formel + FormulaRig; Base and documented V3 legacy tiles remain selectable. Docs mark Soft-Retire.

## In scope

- Gate `BoardEngineLiveZone` via `shouldShowBoardEngineLiveZone`
- Setup labels: V5 Standard, V3 Legacy Soft-Retire
- Hide 3D cheatbox toggle under V5 matches
- AGENTS + SPIELUEBERSICHT + `docs/engine-system/architecture.md` legacy note

## Out of scope

- Deleting Meshy / engine-part assets
- Removing V3 engine code paths
- Forge authoring retarget beyond labels

## Acceptance criteria

1. GameSetup default remains `v5`; V3 tile shows Legacy Soft-Retire copy
2. V5 match does not mount Fetzgerät Live-3D as main formula presentation
3. Base + V3 pack choices still resolve and remain playable
4. Docs mention Soft-Retire / Play-Default V5
5. `npm run checks` green; typed-strict on touched files

## Evidence

- `boardEngineLive.test.ts`
- `resolveGamePackChoice.test.ts` (default v5)
- Manual: Play setup tiles + V5 board FormulaRig only
