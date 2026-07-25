# Acceptance: v3-reaction-matrix-core

## Intent
Reaktionskern + pick-reaction pendingChoice; max 1 Reaktion/Aktion; Auto bei einer Option.

## Happy Path
- 1 Match → auto stub resolve
- 2 Matches → pick-reaction → PICK_REACTION

## Edge Cases
- Zweite Reaktion in derselben Aktion → Markenpfad

## Security Coverage
Out of scope.

## Implementation Notes
#103
