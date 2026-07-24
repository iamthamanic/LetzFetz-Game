"""Load and validate sound-manifest.json."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


PACKAGE_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_MANIFEST = PACKAGE_ROOT / "sound-manifest.json"


class ManifestError(ValueError):
    """Invalid or empty sound manifest."""


def load_manifest(path: Path | None = None) -> dict[str, Any]:
    manifest_path = path or DEFAULT_MANIFEST
    if not manifest_path.is_file():
        raise ManifestError(f"Manifest not found: {manifest_path}")
    raw: Any = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ManifestError("Manifest root must be an object")
    sounds = raw.get("sounds")
    if not isinstance(sounds, list):
        raise ManifestError("Manifest.sounds must be a list")
    if len(sounds) == 0:
        raise ManifestError("Manifest.sounds is empty")
    ids: list[str] = []
    for entry in sounds:
        if not isinstance(entry, dict):
            raise ManifestError("Each sound entry must be an object")
        sound_id = entry.get("id")
        if not isinstance(sound_id, str) or not sound_id:
            raise ManifestError("Sound entry missing id")
        if sound_id in ids:
            raise ManifestError(f"Duplicate sound id: {sound_id}")
        ids.append(sound_id)
    return raw


def find_sound(manifest: dict[str, Any], sound_id: str) -> dict[str, Any] | None:
    sounds = manifest.get("sounds")
    if not isinstance(sounds, list):
        return None
    for entry in sounds:
        if isinstance(entry, dict) and entry.get("id") == sound_id:
            return entry
    return None
