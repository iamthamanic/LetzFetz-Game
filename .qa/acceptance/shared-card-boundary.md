# Feature: Shared Card Boundary (Issue #60)

<!-- acceptance artifact before implementation — 2026-07-24 -->

## Intent

Finalize the neutral shared-card boundary: presentation types live in `src/components/cards/`, Forge authoring/pack adapters live in `src/features/forge/`, and `src/services/cardForge/` is removed with no re-export stubs.

## Happy Path

- [ ] `src/components/cards/cardTypes.ts` defines neutral `CardKind`, `CardElement`, and shared constants used by presentation.
- [ ] `LetzFetzCard` and card display helpers import only neutral types — not `features/forge` or `services/cardForge`.
- [ ] Forge model/data under `src/features/forge/model/` and `src/features/forge/data/` owns `ForgeCardData`, categories, and `packToForgeCards`.
- [ ] Sandbox and Forge import forge adapters directly from `features/forge/*`.
- [ ] `src/services/icons/elementIcons.ts` uses `CardElement` from neutral cards layer.
- [ ] `src/services/cardForge/` deleted entirely.
- [ ] `npm run checks` green; card presentation unit tests pass.

## Edge Cases

- [ ] Sandbox `toCardKind` / `toCardElement` fall back safely for unknown strings.
- [ ] Game → card prop bridges (`*DefToCardProps`) still resolve art paths and element mapping.
- [ ] `forgeCharacterDefFromCard` (forge-only) still maps pack characters and custom forge rows.
- [ ] Overlay merge (`mergeForgeOverlays`) unchanged behavior for image/notes.

## Regression

- [ ] Forge library renders all 90 pack cards with correct category counts.
- [ ] Sandbox loads pack content and renders cards.
- [ ] Play/board components using `LetzFetzCard` still compile and render element/character cards.

## Security Coverage

- N/A — refactor only; no auth, storage, or user-input surface changes.

## Assumptions

- Play feature remains under `src/components/game/` until Play slice migration; it consumes neutral `LetzFetzCard` only.
- `CardKind` union matches existing V1 rulebook categories (Character, Ultimate, Element, Arena, Glitch).

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — type boundary refactor |

## Implementation Notes

- Added neutral `cardTypes.ts`, `packPresentation.ts` under `src/components/cards/` (`CardKind`, `CardElement`, `CardPresentationData`, `packToPresentationCards`, `mergePresentationOverlays`).
- Moved Forge model to `src/features/forge/model/` (`types.ts`, `categories.ts`, `characterFromForgeCard.ts`); thin adapter `data/packToForge.ts` delegates to neutral pack presentation.
- Renamed bridges: `*DefToCardProps`, `elementDefToCardProps`, `cardElementToBrandIconKey`; moved `forgeCharacterDefFromCard` to forge model.
- Deleted `src/services/cardForge/` entirely. Sandbox imports neutral `packPresentation` (no feature→feature import).
- `npm run checks`: build + 246 tests green.
