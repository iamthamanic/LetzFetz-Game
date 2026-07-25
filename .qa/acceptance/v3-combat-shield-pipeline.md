# Acceptance: v3-combat-shield-pipeline

## Intent
Damage pipeline Block→Schild→HP; Treffer vs Vollblock; impulse hook on hit only.

## Happy Path
- Schild absorbiert vor HP unter v3Combat
- Schild-Vollabsorption bleibt Treffer (kein Vollblock-Effekt)
- V1-Pfad ohne Schildnutzung

## Edge Cases
- postBlockDamage 0 → Vollblock, kein Impuls

## Security Coverage
Out of scope.

## Implementation Notes
#102 — shield.ts + applyPlayerAttackDamage wiring.
