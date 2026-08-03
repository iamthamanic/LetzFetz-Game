# Feature: V6 PLAYABLE-Prep — setup flag polish

**Issue:** #336

## Intent
V6_PLAYABLE reveals the V6 tile without flipping Play-Default. Initial selection remains V5; docs/hint explain flag keys.

## Happy Path
- [ ] `defaultPackChoice` always `v5`
- [ ] With flag: V6 tile + hint; V5 selected initially; V5 labeled Standard
- [ ] Without flag: no V6 tile; resolve(`v6`) throws
- [ ] Spielkonzept note updated
- [ ] `npm run checks` green

## Implementation Notes
- Reordered pack tiles V5 then V6; INTERNAL/Opt-in badges; enable hint
