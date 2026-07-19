# Acceptance — Sofort-Glitch center reveal

## Intent
When an instant (Sofort) glitch is drawn, both players must see it resolve face-up in the center — never silently.

## Happy Path
1. Drawing a Sofort-Glitch (draw phase, Luft, Späti/Sumpf filter, Ulti draw, opening deal) appends to `state.instantReveals`
2. `lastEvent` / chat-match prints name + resolution (e.g. Absturz names the discarded card)
3. Game UI enqueues `instant-glitch-reveal` presentation (~2.2s, input locked) with card art + effect + resolution for human and bot draws

## Edge Cases
- Multiple Sofort-Glitches in one action (e.g. Luft draws two) → one reveal step each, in order
- Instant overwrites hand draw — no silent discard

## Validation
```bash
cd Letzfetzprototype && npm run checks
```
