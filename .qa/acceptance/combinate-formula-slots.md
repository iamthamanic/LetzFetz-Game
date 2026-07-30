# Acceptance — combinate-formula-slots

<!-- seeded from issue #255 — Combinate T/E/K formula card slots -->

## Intent

Retarget Build → Combinate from Meshy engine parts to V5 Formel-Bausteine (Technik/Essenz/Katalysator) from Material/V5 pack. Preview stays placeholder until #257/#258; no save yet (#258).

## User Journey

1. Open Build → **Combinate**.
2. Left library lists Formel-Bausteine grouped by Technik / Essenz / Katalysator (36 cards).
3. Drag a card into a slot — only matching role accepted (wrong slot auto-routes).
4. With **≥2** slots filled → combination indicator (title e.g. „Kombination aus Technik Essenz“) in preview + result column.
5. With **0–1** slots → no combination card chrome.

## Problem

Combinate still loads Meshy part catalog, shows „Teile in die Slots legen“, and 3D mesh assembly preview.

## Solution

- `formulaCardCatalog` from `V5_PACK` + card art paths.
- `FormulaLibraryPanel` replaces `PartLibraryPanel` in Combinate only.
- Slots + result card wired to formula cards; session version bump resets legacy Meshy sessions.
- Meshy catalog code remains for VFX Studio asset pipeline (#256+).

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Partial 2-of-3 fill → Kombi label lists filled roles only.
- Essenz cards show element icon; Technik/Katalysator neutral.
- Old build-session v3 (Meshy ids) → reset on load (v4).

## Acceptance

- [ ] Library lists formula Bausteine by role (no Meshy catalog in Combinate UI).
- [ ] Slots accept only matching role cards.
- [ ] ≥2 filled → combination indicator; 0–1 → no combination card.
- [ ] Preview empty copy references Formelkarten (not „Teile“).
- [ ] Tests updated; `npm run checks` green.
- [ ] Touched files: zero type escape hatches.

## Design

Epic: `.qa/design/vfx-studio.md` (slice #255)

## Blockers

Depends on #250, #254

## Feature slug

`combinate-formula-slots`
