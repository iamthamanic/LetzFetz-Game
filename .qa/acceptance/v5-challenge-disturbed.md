# Acceptance: v5-challenge-disturbed

**Issue:** #222  
**Slug:** `v5-challenge-disturbed`  
**Design:** `.qa/design/v5-formula-migration.md`

## Intent

Unter `v5Formula` zielt Herausfordern auf Formelkomponenten (Stabilität). Differenz steuert gestört vs zerstört; die Startphase des Besitzers stellt gestörte wieder her. Kein LP-Schaden (§24.5).

## Preconditions

- Match mit `ruleset.v5Formula === true` und Gegner mit mind. einer Formelkomponente.
- Angreifer hat eine Angriffskarte in der Hand; Aktionsphase.

## Happy Path

1. Angreifer spielt CHALLENGE gegen eine Formelkomponente; Verteidigung = Stabilität (+ Bonus) + optional Block.
2. Differenz +1–2 → `disturbed: true`; +3+ → Slot leer, Karte auf Ablage.
3. Bereits gestört + Angriff höher → zerstört.
4. Nächste Startphase des Besitzers: `disturbed → false`, `stabilityBonus → 0`, erschöpfte Komponenten aufgerichtet.
5. Gestörte Komponenten bleiben für FORMULA_ACTIVATE ignoriert (bestehendes Resolve).

## Edge Cases

- Leere Formel: keine CHALLENGE-Ziele.
- Angriff ≤ Verteidigung: keine Wirkung.
- V1/Base ohne `v5Formula`: Bound-Challenge unverändert (destroy on success).
- Kein Lebensschaden durch Herausforderung.

## Acceptance Criteria

- [ ] Challenge-Ergebnisse laut V5 §24.2 implementiert.
- [ ] Gestört ignoriert Effekt/Element bis Restore (Activate-Pfad).
- [ ] Startphase stellt eigene gestörte Komponenten wieder her.
- [ ] Vitest für Margin-Tabelle + Restore.
- [ ] Touched files: zero type escape hatches (`@typed-strict` / Boy Scout)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 / B-01 / secrets | Out of scope — pure engine, no network/auth |
| UGC / pack narrow | Out of scope — fixture defs in tests; no new pack ingest |
| P-04 injection | Out of scope — no user strings executed |

## Regression

- Existing `challenge.test.ts` (V1 Bound) remains green.
- Formula phase / resolve tests remain green.

## Screenshots

N/A — engine-only.

## Implementation Notes

- `formulaChallenge.ts`: §24.2 margin table, stability, disturb/destroy, start restore
- `actions.ts`: under `v5Formula`, CHALLENGE targets formula components; resolve branch; start restore in `runStartPhase`
- `bot.ts`: pickBestChallenge scores formula disturb/destroy (minimal so legal actions don't noop)
- Vitest: `formulaChallenge.test.ts` — margin unit + integration (disturb/destroy/restore/empty)
- V1 `challenge.test.ts` unchanged (Bound path)
