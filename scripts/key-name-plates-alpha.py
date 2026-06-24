#!/usr/bin/env python3
"""Key uniform canvas (black/grey/white) from edges → transparent name plate PNGs."""
import sys
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
SOURCE = REPO / "assets_ui"
OUT = ROOT / "public/cards/text"

SOURCES = {
    "TEXT_KNUSPERGNOM.png": "knuspergnom.png",
    "TEXT_KOKABELL.png": "kokabell.png",
    "TEXT_SCHLUCKSPECHT.png": "schluckspecht.png",
    "TEXT_STIERNACKENKOMMANDO.png": "stiernackenkommando.png",
    "TEXT_DRIPMINISTERIN.png": "dripministerin.png",
    "TEXT_PILLENDOKTORA.png": "pillendoktora.png",
    "TEXT_Das Mysterium.png": "mysterium.png",
}


def corner_bg_color(img: Image.Image, tolerance: int = 28) -> tuple[int, int, int]:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    samples = [rgba.getpixel(c) for c in corners]
    return (
        int(sum(s[0] for s in samples) / len(samples)),
        int(sum(s[1] for s in samples) / len(samples)),
        int(sum(s[2] for s in samples) / len(samples)),
    )


def is_bg_pixel(
    r: int,
    g: int,
    b: int,
    a: int,
    bg: tuple[int, int, int],
    tolerance: int,
) -> bool:
    if a == 0:
        return True
    br, bg_c, bb = bg
    return (
        abs(r - br) <= tolerance
        and abs(g - bg_c) <= tolerance
        and abs(b - bb) <= tolerance
    )


def flood_key(img: Image.Image, tolerance: int = 28) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    bg = corner_bg_color(rgba, tolerance)
    q: deque[tuple[int, int]] = deque()
    seen: set[tuple[int, int]] = set()

    for x in range(w):
        for y in (0, h - 1):
            if is_bg_pixel(*px[x, y], bg, tolerance):
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg_pixel(*px[x, y], bg, tolerance):
                q.append((x, y))

    while q:
        x, y = q.popleft()
        if (x, y) in seen:
            continue
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if not is_bg_pixel(*px[x, y], bg, tolerance):
            continue
        seen.add((x, y))
        px[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return rgba


def crop_with_pad(img: Image.Image, pad: int = 12, max_width: int = 1400) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.width, x1 + pad)
    y1 = min(img.height, y1 + pad)
    cropped = img.crop((x0, y0, x1, y1))
    w, h = cropped.size
    if w > max_width:
        scale = max_width / w
        cropped = cropped.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    return cropped


def key_file(src: Path, dst: Path, tolerance: int = 28) -> Image.Image:
    keyed = crop_with_pad(flood_key(Image.open(src), tolerance=tolerance))
    dst.parent.mkdir(parents=True, exist_ok=True)
    keyed.save(dst, "PNG", optimize=True)
    return keyed


def main() -> None:
    if len(sys.argv) >= 3:
        keyed = key_file(Path(sys.argv[1]), Path(sys.argv[2]))
        print(f"written {sys.argv[2]} {keyed.size} corner={keyed.getpixel((0, 0))}")
        return

    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, out_name in SOURCES.items():
        src = SOURCE / src_name
        if not src.exists():
            raise FileNotFoundError(f"Missing source: {src}")
        keyed = key_file(src, OUT / out_name)
        print(f"written {out_name} {keyed.size} corner={keyed.getpixel((0, 0))}")


if __name__ == "__main__":
    main()
