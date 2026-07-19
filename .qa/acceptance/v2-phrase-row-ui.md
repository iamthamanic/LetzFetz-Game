# Feature: V2 phrase row UI labels

When a pack includes `engineParts` (V2), the bound row shows Kern / Modus / Werkzeug / Ladung with empty slots visible. V1 matches keep the flat four-slot strip without phrase labels.

## Acceptance

- [ ] V2 board shows Kern / Modus / Werkzeug / Ladung above bound slots
- [ ] Built engine parts and Ladungen appear in the matching labeled slot
- [ ] Empty V2 slots remain visible with slot label
- [ ] V1 `BASE_PACK` board unchanged (no phrase labels)
- [ ] Styleguide tone; responsive on 390px width
- [ ] `npm run checks` green

## Implementation

- `src/components/game/phraseSlotLabels.ts` — German slot labels + order
- `src/components/game/buildGameViewModel.ts` — map bound cards by `phraseSlot` when V2 pack
- `src/components/game/BoundCardRow.tsx` — conditional phrase column labels
- `src/components/game/BoundCardSlot.tsx` — V2 empty slot chrome + engine-part name fallback
- `PlaymatBoard.tsx` / `GameBoard.tsx` — pass `showPhraseLabels={isV2Pack(pack)}`

## Manual smoke

1. Start V1 bot match → bound row shows generic Slot 1–4 / no Kern labels.
2. Start V2 P100 match → four labeled columns; build parts into correct slots.
