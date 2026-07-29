"""
Shared path helpers for Blender asset scripts (safe asset ids, repo roots).
Location: tools/blender/common/paths.py
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

SAFE_ASSET_ID = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$")


def repo_root() -> Path:
    """tools/blender/common → repo root."""
    return Path(__file__).resolve().parents[3]


def is_safe_asset_id(asset_id: str) -> bool:
    return bool(SAFE_ASSET_ID.match(asset_id))


def reject_unsafe_asset_id(asset_id: str) -> None:
    if not is_safe_asset_id(asset_id):
        print(
            "DE: Ungültige Asset-ID (nur Buchstaben, Ziffern, ._- ; kein Pfad).\n"
            "EN: Invalid asset id (no path separators or ..).",
            file=sys.stderr,
        )
        sys.exit(2)


def glb_path(asset_id: str) -> Path:
    return repo_root() / "public" / "engine-parts" / "mvp" / f"{asset_id}.glb"


def spec_path(asset_id: str) -> Path:
    return repo_root() / "docs" / "engine-system" / "specs" / f"{asset_id}.json"


def preview_png_path(asset_id: str) -> Path:
    return repo_root() / "public" / "cards" / "engine" / f"{asset_id}.png"


def load_spec(asset_id: str) -> dict:
    path = spec_path(asset_id)
    if not path.is_file():
        print(
            f"DE: Spec fehlt: {path.relative_to(repo_root())}\n"
            f"EN: Spec missing: {path.relative_to(repo_root())}",
            file=sys.stderr,
        )
        sys.exit(1)
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or "id" not in data:
        print("DE: Spec JSON ungültig.\nEN: Spec JSON invalid.", file=sys.stderr)
        sys.exit(1)
    return data


def argv_after_double_dash(argv: list[str] | None = None) -> list[str]:
    """Blender passes script args after `--`."""
    args = list(sys.argv if argv is None else argv)
    if "--" in args:
        return args[args.index("--") + 1 :]
    # When run outside Blender for import tests, allow trailing args.
    return [a for a in args[1:] if not a.endswith(".py")]
