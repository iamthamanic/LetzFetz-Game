#!/usr/bin/env python3
"""
Split Higgsfield glyph sheets into individual PNG glyphs.
Usage: python3 scripts/font-authoring/split-sheets.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
AUTHORING = ROOT / "assets" / "font-authoring"
SHEETS_DIR = AUTHORING / "sheets"
GLYPHS_DIR = AUTHORING / "glyphs"
SUBSET_PATH = AUTHORING / "subset.json"


def safe_filename(char: str) -> str:
    mapping = {
        "/": "slash",
        '"': "quote",
        ".": "period",
        ",": "comma",
        "!": "exclam",
        "?": "question",
        "-": "hyphen",
        ":": "colon",
        "'": "apos",
        "(": "lparen",
        ")": "rparen",
    }
    return mapping.get(char, char)


def trim_white(im: Image.Image, padding: int = 8) -> Image.Image:
    gray = im.convert("L")
    # Content = darker than near-white background
    mask = gray.point(lambda p: 0 if p > 245 else 255)
    bbox = mask.getbbox()
    if not bbox:
        return im
    cropped = im.crop(bbox)
    if padding:
        w, h = cropped.size
        padded = Image.new("RGBA", (w + padding * 2, h + padding * 2), (255, 255, 255, 255))
        padded.paste(cropped, (padding, padding))
        return padded
    return cropped


def split_sheet(sheet_path: Path, chars: str) -> None:
    im = Image.open(sheet_path).convert("RGBA")
    n = len(chars)
    if n == 0:
        return
    col_w = im.width // n
    GLYPHS_DIR.mkdir(parents=True, exist_ok=True)
    for i, char in enumerate(chars):
        left = i * col_w
        right = (i + 1) * col_w if i < n - 1 else im.width
        cell = im.crop((left, 0, right, im.height))
        cell = trim_white(cell)
        out = GLYPHS_DIR / f"{safe_filename(char)}.png"
        cell.save(out)
        print(f"  {char} -> {out.name}")


def main() -> None:
    subset = json.loads(SUBSET_PATH.read_text(encoding="utf-8"))
    for entry in subset["sheets"]:
        sheet_path = SHEETS_DIR / entry["file"]
        chars = entry["chars"]
        if not sheet_path.exists():
            print(f"SKIP (missing): {sheet_path.name}")
            continue
        print(f"Split {sheet_path.name} ({chars})")
        split_sheet(sheet_path, chars)


if __name__ == "__main__":
    main()
