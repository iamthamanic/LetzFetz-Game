# Letz Fetz Display Font — Authoring (v0.1)

Pipeline: **Higgsfield glyph sheets → split → potrace → TTF/WOFF2 → `public/fonts/`**

## Quick commands

```bash
# 1. Generate sheets (Higgsfield CLI + logo reference; ~15 min total)
bash scripts/font-authoring/generate-sheets.sh

# 2. Split into individual PNG glyphs
python3 scripts/font-authoring/split-sheets.py

# 3. Build font files
python3 scripts/font-authoring/build-font.py
```

Requires: `pip3 install fonttools pillow potracer`, authenticated `tools/bin/hf`.

## Character subset (v0)

`A–Z a–z ÄÖÜ äöü ß 0–9 . , ! ? - : ' " ( ) /`

Defined in `subset.json`.

## YourFonts fallback

If a glyph needs manual touch-up:

1. Download [YourFonts print template (A4)](https://www.yourfonts.com/print-template/)
2. Place cleaned glyphs from `glyphs/` into template cells in Figma
3. Export PDF → upload at yourfonts.com
4. Replace `public/fonts/LetzFetzDisplay.ttf` manually

## License notes

- Higgsfield output: verify commercial terms for your Ultra plan before Steam/print
- Document final license in `.qa/design/letz-fetz-display-font.md` when shipping product

## Usage in app

- CSS variable `--font-brand`: `BadSuabiaSwing`, `Frazzle`, Impact, sans-serif
- Class `font-brand` — **display only** (≥ text-base), not log/body text
- Header wordmark: `AppBrand` + `.logo-wordmark`

## Legacy: LetzFetzDisplay (AI v0.1)

Superseded by Bad Suabia Swing (`public/fonts/BadSuabiaSwing-Regular.otf`). Pipeline scripts remain for experiments.
