# Name plate sources (`assets_ui/`)

HF reference exports: `TEXT_KNUSPERGNOM.png`, etc.

## Transparent PNGs for the app

**Higgsfield (reference → PNG, matches HF refs):**

```bash
cd Letzfetzprototype
npx tsx scripts/generate-higgsfield-name-plates.ts --all
npx tsx scripts/generate-higgsfield-name-plates.ts --key=knuspergnom --force
```

Uses `assets_ui/TEXT_*.png` as `--image` ref for GPT Image 2, then keys grey/white canvas to alpha.

**Manual key only (no HF):**

```bash
python3 scripts/key-name-plates-alpha.py
```
