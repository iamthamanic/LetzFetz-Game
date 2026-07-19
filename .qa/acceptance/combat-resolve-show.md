# Feature: Combat resolve show

## Intent
Kampf-Auflösung lesbar machen: größere Block-Stage, danach Fullscreen-Show (W6 fällt, Werte stacken, Clash, Rest) und erst dann die bestehende Damage-Hit-LP-Animation.

## Preconditions
- Engine liefert `PendingCombat` beim Angriff und löst bei `PLAY_BLOCK` / `PASS_BLOCK` auf
- Presentation-Queue und Damage-Hit existieren bereits

## Happy Path
- [ ] Block-Phase: CombatStage groß und zentriert (nicht die winzige Playmat-Zone)
- [ ] Resolve: Fullscreen-Beats Angriff-Stack → Block-Stack → Clash → Rest (−N / 0)
- [ ] Challenge-Erfolg: Extra-Beat „zerstört“
- [ ] Pass/kein Block: Clash gegen 0, dann ggf. Damage-Hit
- [ ] Damage-Hit läuft erst nach der Resolve-Show (Queue-Reihenfolge)
- [ ] Input während Resolve gesperrt; Auto-Timing ~4s
- [ ] `npm run checks` grün

## Edge Cases
- [ ] Completely blocked (0 Schaden): Rest zeigt 0, kein Damage-Hit
- [ ] Rückkopplung (`pendingChoice`): Resolve-Show trotzdem, Damage-Hit wenn HP später fällt
- [ ] `prefers-reduced-motion`: verkürzte/statische Beats

## Implementation Notes
- Block-Phase: `CombatStage` zentriert `min(92vw, 42rem)` — nicht mehr an die kleine Playmat-Zone gebunden
- Resolve: `buildCombatResolveSnapshot` + `CombatResolveShow` (~4.2s) — Stack → Clash → Rest
- Queue: Resolve vor `buildDamageHitSteps`, damit LP-Countdown danach kommt
- Challenge-Destroy / Full-Block / Pass-vs-0 abgedeckt; Reduced Motion springt zu Result