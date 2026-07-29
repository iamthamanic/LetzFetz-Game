# Acceptance: v5-mvp-pack

**Issue:** #225  
**Slug:** `v5-mvp-pack`

## Intent
V5_PACK with MVP-9 formula components, 6 items, deck mix, Play setup tile as default.

## Happy Path
1. Play → Kartenset V5 (Standard) → match with v5Formula, 20 LP.
2. Deck includes formula + items; FORMULA_BUILD works.

## Acceptance Criteria
- [ ] V5_PACK exported in packs/index + game index
- [ ] Play setup V5 tile Standard default; starts v5Formula match
- [ ] MVP-9 + 6 items; deck builder includes kinds
- [ ] Vitest createGame / draw / formula build smoke
- [ ] typed-strict clean

## Implementation Notes
- `src/game/packs/v5/*` — mvpCards + v5-pack (deck size documented <106 until #231)
- `deck.ts` includes techniques/essences/catalysts/items
- GameSetup default `v5`; resolveGamePackChoice maps to V5_PACK_RULESET
