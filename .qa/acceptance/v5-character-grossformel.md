# Acceptance: v5-character-grossformel

**Issue:** #229  
**Design:** `.qa/design/v5-character-grossformel.md`

## Intent
Sieben Charaktere: Passiven und Großformeln gemäß V5 §25 (Formel-Bezug), Engine + Pack.

## Happy Path
1. V5 pack characters/ultimates show §25 DE texts in Play setup.
2. Schluckspecht / Knuspergnom / Stiernacken passives fire under `v5Formula`.
3. At least three character effects covered by Vitest.

## Edge Cases
- Passive once-per-turn limits.
- Ulti once per match (existing).
- V1 Base texts unchanged.

## Acceptance Criteria
- [x] Alle 7 Charaktere haben V5-Passive + Großformel-Daten.
- [x] Mindestens 3 Charakter-Effekte engine-getestet.
- [x] Play Setup zeigt aktualisierte DE-Texte.
- [x] typed-strict clean.
- [x] npm run checks

## Security Coverage
Local pack/engine only — OOS.

## Implementation Notes
- Pack: `src/game/packs/v5/characters.ts`
- Passives: `characterPassives.ts` (Schluckspecht, Knuspergnom, Stiernacken)
- Ultimates: V5 formula-aware build / upright / disturb in `ultimate.ts`
