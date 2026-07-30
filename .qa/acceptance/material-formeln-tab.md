# Acceptance — material-formeln-tab

<!-- seeded from issue #254 — Material Formeln tab replaces Fetzgerät -->

## Intent

Replace Material **Fetzgerät** category with **Formeln**. Show V5 formula Bausteine (Technik/Essenz/Katalysator) with card art under `public/cards/formula/`. Role badge filters; Kombination empty until #255.

## User Journey

1. Open Card Forge → **Material**.
2. Select **Formeln** tab — 36 V5 Bausteine (12 Technik, 12 Essenz, 12 Katalysator).
3. Each card shows badges **Formel** + role (German).
4. Filter chips **Technik** / **Essenz** / **Katalysator** / **Kombination** narrow the grid (Kombination empty OK).
5. Card art resolves via `resolveFormulaCardArtPath` when PNG exists.

## Problem

Material still lists V3 Fetzgerät engine parts; V5 Formel content and art live elsewhere.

## Solution

- Category `Formula` / label **Formeln** in `categories.ts`.
- `packToForge` + `packPresentation` map V5 `techniques` / `essences` / `catalysts` (default from `V5_PACK`).
- Sub-filter chips in `CardLibrary` when Formeln tab active.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Kombination filter shows empty state (no saved combos yet — #255).
- Essenz cards carry element for art/icons; badges remain Formel + Essenz.
- Legacy V3 engine parts no longer appear in Material.

## Acceptance

- [ ] Formeln tab replaces Fetzgerät; 36 formula cards listed.
- [ ] Badges: Formel + Technik | Essenz | Katalysator (German).
- [ ] Role filter chips work; Kombination empty OK.
- [ ] Formula PNG paths under `/cards/formula/` when shipped.
- [ ] Tests updated; `npm run checks` green.
- [ ] Touched files: zero type escape hatches.

## Design

Epic: `.qa/design/vfx-studio.md` (slice #254)

## Blockers

Depends on #251 (typed contracts), #252 (studio shell context)

## Feature slug

`material-formeln-tab`
