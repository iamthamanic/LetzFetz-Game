# Acceptance — Restore white catalyst art (default)

## Goal

Material/Play default catalyst art is white line-art under `public/cards/formula/*.png` again. Full-color z-image catalyst arts from PR #373 (`e4b4117`) are removed, not kept as an alternate.

## Done when

- [x] Root formula catalyst PNGs overwritten by `e4b4117` restored from `e4b4117^` (white line-art): ausbreitung, echo, kettenkopplung, opfergabe, sofortzuender, spiegelung, ueberspannung, umkehrung, verdichtung, verzoegerung
- [x] `public/cards/formula/z-image/katalysator/` deleted (all PNGs)
- [x] `public/cards/formula/z-image/` removed (manifest + empty tree)
- [x] `resolveCardArtPath` / `resolveFormulaCardArtPath` for `v5-katalysator-*` / `v6-katalysator-*` still resolve to `/cards/formula/<slug>.png`
- [x] Tests no longer assert root↔z-image byte identity; assert white root default + no z-image tree
- [x] `npm run checks` green

## Notes

- `doppelecho.png` / `sicherheitsventil.png` were **added** (not overwritten) in `e4b4117` and had no pre-existing white line-art in git; they remain at root for resolve coverage only.
- No AI art regeneration — restore/delete from git history only.
