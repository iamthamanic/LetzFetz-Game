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
- Gong SFX: `public/sounds/card-clash.mp3` (metallische Partials + Strike-Transient)
- `CLASH_IMPACT_FRACTION = 0.85` + **linear** CSS — Keyframe-% = Wanduhr
- Web Audio `playClashSoundAt(delay)` sample-genau (kein `setTimeout`-Jitter)
- `CLASH_GONG_ATTACK_LEAD_SEC` — Gong startet leicht vor dem Hit, Peak trifft Kollision
- Preload+Decode vor Crash-Start auf dem „Letz Fetz“-Klick
