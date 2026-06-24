# Feature: Sync MatchIntro clash sound to animation peak

<!-- seeded by ecc-runner from issue #1 on 2026-06-24 — @implement may refine -->

## Intent
Letz-Fetz-Clash fühlt sich synchron an: Sound und stärkster visueller Impact treffen auf demselben Frame zusammen.

## Happy Path
- [x] Sound startet am visuellen Impact-Peak (verify-ui Evidence aktualisiert)
- [x] Crash-Keyframes spürbarer (Overlap/Shake)
- [x] `npm run checks` grün
- [x] E2E `match-intro-letz-fetz-crash` grün

## Edge Cases
- [x] `prefers-reduced-motion`: kein Crash, kein verzögerter Sound
- [x] SFX fehlgeschlagen: Crash-Animation läuft trotzdem

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
- `MatchIntro.tsx`: `CLASH_SOUND_DELAY_MS` = 50 % von `CRASH_MS`; Sound per `useEffect` beim Crash-Beat
- `index.css`: stärkerer Karten-Overlap (`8.5rem`, `scale(1.1)`), Shake-Peak bei 50 %
