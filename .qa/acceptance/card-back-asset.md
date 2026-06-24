# Feature: Letz Fetz card-back SVG

<!-- seeded by ecc-runner from issue #2 -->

## Intent
Einheitliche Letz-Fetz-Kartenrückseite für verdeckte Karten (Deal, Gegnerhand, Stapel).

## Happy Path
- [x] Asset unter `public/cards/card-back.svg`
- [x] `LetzFetzCard` rendert Rückseite bei `faceDown`
- [x] `resolveCardBackPath()` in manifest
- [x] `npm run checks` grün

## Edge Cases
- [x] Fallback: SVG ist statisches Asset im Repo (kein Netzwerk nötig)
- [x] Kontrast: dunkler Rahmen + Pergament-Panel auf Playmat

## Implementation Notes
- `public/cards/card-back.svg` — Grunge-Pergament, LETZ FETZ Wordmark
- `LetzFetzCard.tsx` — `faceDown` nutzt `resolveCardBackPath()`, `data-testid="card-back"`
