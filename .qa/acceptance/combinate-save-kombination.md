# Acceptance — combinate-save-kombination

<!-- seeded from issue #258 — Combinate save Kombination (recipe + hero frame) -->

## Intent

Combinate uses shared VFX preview (#257). Save Kombination when ≥2 slots filled as FormulaRecipe + hero-frame canvas capture. Appears in Material → Formeln with badges Formel + Kombination. Bausteine remain read-only in Combinate library.

## User Journey

1. Open Build → **Combinate**; fill ≥2 Formelplätze (Technik/Essenz/Katalysator).
2. Live preview shows shared VFX viewport.
3. Click **Speichern** → recipe persisted to localStorage registry + hero frame captured from canvas.
4. Open Material → **Formeln** → filter **Kombination** → saved entry with Formel + Kombination badges and hero art.
5. With 0–1 slots: **Speichern** disabled + German hint.

## Problem

No combo persistence; Material Kombination filter always empty; no hero-frame capture.

## Solution

- Extend `vfx/registry` with `formulaRecipes`.
- `combinateSave` builds `FormulaRecipe` with component version pins (V5 baseline = 1).
- `VfxSharedPreview` exposes canvas capture handle.
- `vfxRegistryBridge` + `packToForge` surface Kombinationen in Forge.
- Forge listens for registry update event to refresh grid.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- <2 slots: Speichern disabled + hint „Mindestens zwei Formelplätze belegen…“.
- Canvas capture failure: recipe still saves without hero frame.
- Registry corrupt entries dropped on load.
- Pack buttons / OUTDATED (#259) not in scope.

## Acceptance

- [ ] Shared preview in Combinate (from #257).
- [ ] Speichern when ≥2 slots; disabled + hint when <2.
- [ ] Save creates Kombi in Material Formeln with Formel + Kombination badges.
- [ ] Recipe stored with component version pins.
- [ ] Tests updated; `npm run checks` green.
- [ ] Touched files: zero type escape hatches.

## Design

Epic: `.qa/design/vfx-studio.md` (slice #258)

## Blockers

Depends on #255, #257

## Feature slug

`combinate-save-kombination`
