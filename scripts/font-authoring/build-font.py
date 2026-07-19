#!/usr/bin/env python3
"""
Build LetzFetzDisplay.ttf from glyph PNGs using potrace + fontTools.
Usage: python3 scripts/font-authoring/build-font.py
Output: public/fonts/LetzFetzDisplay.ttf (+ .woff2 if fonttools woff2 available)
"""
from __future__ import annotations

import json
from pathlib import Path

from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from PIL import Image
from potrace import Bitmap

ROOT = Path(__file__).resolve().parents[2]
AUTHORING = ROOT / "assets" / "font-authoring"
GLYPHS_DIR = AUTHORING / "glyphs"
SUBSET_PATH = AUTHORING / "subset.json"
OUT_DIR = ROOT / "public" / "fonts"
FONT_NAME = "LetzFetzDisplay"

UNITS_PER_EM = 1024
ASCENT = 900
DESCENT = -124


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


def glyph_name(char: str) -> str:
    return f"uni{ord(char):04X}"


def png_to_pen(image_path: Path, pen: TTGlyphPen, target_height: int) -> tuple[int, int]:
    """Trace PNG to glyph pen. Returns (advance_width, lsb)."""
    im = Image.open(image_path).convert("L")
    w, h = im.size
    scale = target_height / h
    target_w = int(w * scale)

    bmp = Bitmap(im, blacklevel=0.5)
    path = bmp.trace(turdsize=2, turnpolicy=4)

    if len(path) == 0:
        pen.moveTo((0, 0))
        pen.lineTo((target_w, 0))
        return target_w, 0

    ymin = 1.0
    ymax = 0.0
    for curve in path:
        for segment in curve:
            if segment.is_corner:
                for x, y in [(segment.c.x, segment.c.y), (segment.end_point.x, segment.end_point.y)]:
                    ymin = min(ymin, y)
                    ymax = max(ymax, y)
            else:
                for x, y in [
                    (segment.c1.x, segment.c1.y),
                    (segment.c2.x, segment.c2.y),
                    (segment.end_point.x, segment.end_point.y),
                ]:
                    ymin = min(ymin, y)
                    ymax = max(ymax, y)

    trace_h = max(ymax - ymin, 0.001)
    y_scale = target_height / trace_h
    x_scale = scale

    def tx(x: float) -> float:
        return x * x_scale

    def ty(y: float) -> float:
        # Flip Y: image top-down -> font coords bottom-up, align to baseline
        return (ymax - y) * y_scale

    for curve in path:
        start = curve.start_point
        pen.moveTo((tx(start.x), ty(start.y)))
        for segment in curve:
            if segment.is_corner:
                pen.lineTo((tx(segment.c.x), ty(segment.c.y)))
                pen.lineTo((tx(segment.end_point.x), ty(segment.end_point.y)))
            else:
                pen.curveTo(
                    (tx(segment.c1.x), ty(segment.c1.y)),
                    (tx(segment.c2.x), ty(segment.c2.y)),
                    (tx(segment.end_point.x), ty(segment.end_point.y)),
                )
        pen.closePath()

    advance = max(target_w, int(target_height * 0.6))
    return advance, 0


def collect_chars() -> list[str]:
    subset = json.loads(SUBSET_PATH.read_text(encoding="utf-8"))
    chars: list[str] = []
    for entry in subset["sheets"]:
        chars.extend(list(entry["chars"]))
    return chars


def build_font() -> Path:
    chars = collect_chars()
    glyph_set = {".notdef": None}
    cmap: dict[int, str] = {}

    target_cap = int(UNITS_PER_EM * 0.72)

    for char in chars:
        png = GLYPHS_DIR / f"{safe_filename(char)}.png"
        if not png.exists():
            print(f"WARN missing glyph: {char} ({png.name})")
            continue
        name = glyph_name(char)
        glyph_set[name] = png
        cmap[ord(char)] = name

    glyph_order = [".notdef"] + sorted(
        [glyph_name(c) for c in chars if (GLYPHS_DIR / f"{safe_filename(c)}.png").exists()],
        key=lambda n: int(n[3:], 16),
    )

    glyf = {}
    hmtx = {}

    # .notdef empty box
    pen = TTGlyphPen(None)
    pen.moveTo((0, 0))
    pen.lineTo((500, 0))
    pen.lineTo((500, 700))
    pen.lineTo((0, 700))
    pen.closePath()
    glyf[".notdef"] = pen.glyph()
    hmtx[".notdef"] = (600, 0)

    for char in chars:
        png = GLYPHS_DIR / f"{safe_filename(char)}.png"
        if not png.exists():
            continue
        name = glyph_name(char)
        tt_pen = TTGlyphPen(None)
        cu2qu_pen = Cu2QuPen(tt_pen, max_err=2.0)
        advance, lsb = png_to_pen(png, cu2qu_pen, target_cap)
        glyf[name] = tt_pen.glyph()
        hmtx[name] = (advance, lsb)
        print(f"Built {name} ({char}) advance={advance}")

    fb = FontBuilder(UNITS_PER_EM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupHead(
        unitsPerEm=UNITS_PER_EM,
        ascender=ASCENT,
        descender=DESCENT,
    )
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupHorizontalMetrics(hmtx)
    fb.setupGlyf(glyf)
    fb.setupNameTable(
        {
            "familyName": FONT_NAME,
            "styleName": "Regular",
            "uniqueFontIdentifier": f"{FONT_NAME}-Regular",
            "fullName": f"{FONT_NAME} Regular",
            "psName": FONT_NAME,
            "version": "Version 0.1",
        }
    )
    fb.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=DESCENT,
        usWinAscent=ASCENT,
        usWinDescent=abs(DESCENT),
    )
    fb.setupPost()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ttf_path = OUT_DIR / f"{FONT_NAME}.ttf"
    fb.save(ttf_path)
    print(f"Saved {ttf_path}")

    woff2_path = OUT_DIR / f"{FONT_NAME}.woff2"
    try:
        font = TTFont(ttf_path)
        font.flavor = "woff2"
        font.save(woff2_path)
        print(f"Saved {woff2_path}")
    except Exception as e:
        print(f"WOFF2 skip: {e}")

    return ttf_path


if __name__ == "__main__":
    build_font()
