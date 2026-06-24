#!/usr/bin/env python3
"""Flood-fill black canvas from edges → transparent PNGs for element icons."""
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/element-icons-source"
OUT = ROOT / "public/icons/elements"

SOURCES = {
    "element_icons_feuer.png": "fire.png",
    "element_icons_wasser.png": "water.png",
    "element_icons_erde.png": "earth.png",
    "element_icons_wind.png": "air.png",
    "element_icons_schatten.png": "shadow.png",
    "element_icons_licht.png": "light.png",
}


def is_bg(r: int, g: int, b: int, a: int, threshold: int) -> bool:
    return a > 0 and r <= threshold and g <= threshold and b <= threshold


def flood_key(img: Image.Image, threshold: int = 45) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    q: deque[tuple[int, int]] = deque()
    seen: set[tuple[int, int]] = set()

    for x in range(w):
        for y in (0, h - 1):
            if is_bg(*px[x, y], threshold):
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(*px[x, y], threshold):
                q.append((x, y))

    while q:
        x, y = q.popleft()
        if (x, y) in seen:
            continue
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if not is_bg(*px[x, y], threshold):
            continue
        seen.add((x, y))
        px[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return rgba


def crop_and_resize(img: Image.Image, max_side: int = 256, pad: int = 8) -> Image.Image:
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
    scale = max_side / max(w, h)
    if scale < 1:
        cropped = cropped.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    return cropped


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, out_name in SOURCES.items():
        src = SOURCE / src_name
        if not src.exists():
            raise FileNotFoundError(f"Missing source: {src}")
        out = OUT / out_name
        crop_and_resize(flood_key(Image.open(src))).save(out, "PNG", optimize=True)
        print(f"written {out_name}")


if __name__ == "__main__":
    main()
