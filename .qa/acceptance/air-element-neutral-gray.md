# Feature: Luft element always white–gray

<!-- 2026-07-29 — global Luft tone follow-up after PR #180 -->

## Intent
Luft (`air`) must use the same neutral stone white/gray tone everywhere — ElementIcon default, frame stripes, card accent badges — never sky blue.

## Happy Path
- [ ] `ElementIcon` for `air` uses `text-stone-100` / `bg-stone-700/75` / `border-stone-400/55`
- [ ] Character dual-element stripes for air use stone gradients (not sky)
- [ ] `ELEMENT_ACCENTS.Air` stripe/glow/badge use stone tokens matching ElementIcon
- [ ] ElementEffectCard Luft badge inherits default (no `airTone` prop)
- [ ] Other elements keep existing colors

## Regression
- [ ] German UI labels unchanged
- [ ] `airTone` prop removed from ElementIcon API
- [ ] Non-element sky usage (Schild chip, Badge `info`, arena-club theme) unchanged

## Implementation Notes
- Files: `ElementIcon.tsx`, `cardFrameTokens.ts`, `ElementEffectCard.tsx`, `elementSymbols.ts` prompt
- Removed redundant `airTone` special-case after default became neutral
