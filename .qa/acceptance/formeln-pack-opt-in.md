# Acceptance — formeln-pack-opt-in

<!-- seeded from issue #259 — Pack opt-in buttons + OUTDATED -->

## Intent

Material Formeln cards get distinct play-bridge buttons: Bausteine → drawable deck (localStorage overlay merged at `createGame`); Kombinationen → activated field recipe (never hand card). Version pins + OUTDATED warnings in Material and Play setup.

## User Journey

1. Material → Formeln → Baustein (Technik/Essenz/Katalysator) → **„Zum Spieldeck hinzufügen“** → Solo V5 can draw it (overlay merged into pack).
2. Material → Formeln → Kombination → **„Kombination aktivieren“** → field recipe template unlocked (registry + version pins; not in main deck).
3. Authoring version bump → entry **OUTDATED** + German warning in Material detail and Play setup (V5) until re-add / re-activate.

## Problem

No bridge from VFX registry / Material Formeln to playable V5 pack or activated field recipes.

## Solution

- `formulaPlayOptIn` localStorage store (deck opt-ins + activated recipes with version pins).
- `mergeFormulaPlayOverlay` merges opt-in Bausteine into `V5_PACK` at Play resolve (no committed pack JSON edits).
- Material preview actions + Play setup outdated banner.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Kombination never becomes a hand / deck card.
- Pack V5 Bausteine already in base deck — opt-in pins version for OUTDATED tracking; studio-only ids add stub defs via overlay.
- Engine 2-slot resolve (#260) not implemented — activated recipes stored only.

## Acceptance

- [ ] Two distinct buttons with correct German labels and semantics.
- [ ] Deck overlay persisted in localStorage; merged at V5 `createGame`.
- [ ] Activated recipes stored separately with component version pins.
- [ ] OUTDATED warning on version bump (Material + Play setup when possible).
- [ ] Tests for overlay merge + outdated logic; `npm run checks` green.
- [ ] Touched files: zero type escape hatches.

## Design

Epic: `.qa/design/vfx-studio.md` (slice #259)

## Blockers

Depends on #258

## Feature slug

`formeln-pack-opt-in`
