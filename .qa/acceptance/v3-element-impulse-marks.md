# Acceptance: v3-element-impulse-marks

## Intent
Elementimpuls → primäre Marke oder Reaction-Candidates (stub); High→Verpeilt.

## Happy Path
- Feuerimpuls ohne Marke → Brennen ×1
- Feuerimpuls auf Durchnässt → reaction candidates, kein neues Brennen
- v3Combat false → skipped

## Edge Cases
- High 4. Stapel → Verpeilt

## Security Coverage
Out of scope (local engine).

## Implementation Notes
#101 — applyStatus + elementImpulse modules.
