"""Tests for Audio Forge mock provider + manifest (stdlib / pytest)."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from audio_forge.manifest import ManifestError, find_sound, load_manifest
from audio_forge.providers import MockProvider


ROOT = Path(__file__).resolve().parents[1]


def test_load_manifest_has_unique_ids() -> None:
    manifest = load_manifest(ROOT / "sound-manifest.json")
    ids = [s["id"] for s in manifest["sounds"]]
    assert len(ids) == len(set(ids))
    assert "card.clash" in ids
    assert "music.menu.main" in ids


def test_empty_manifest_rejected(tmp_path: Path) -> None:
    path = tmp_path / "empty.json"
    path.write_text(json.dumps({"version": 1, "sounds": []}), encoding="utf-8")
    with pytest.raises(ManifestError, match="empty"):
        load_manifest(path)


def test_mock_generate_deterministic(tmp_path: Path) -> None:
    provider = MockProvider()
    a = provider.generate("card.draw", "prompt-a", tmp_path / "a")
    b = provider.generate("card.draw", "prompt-a", tmp_path / "b")
    assert a.bytes_written == b.bytes_written
    assert a.output_path.read_bytes() == b.output_path.read_bytes()
    assert a.output_path.suffix == ".wav"


def test_find_music_existing() -> None:
    manifest = load_manifest(ROOT / "sound-manifest.json")
    menu = find_sound(manifest, "music.menu.main")
    match = find_sound(manifest, "music.match.default")
    assert menu is not None and menu.get("status") == "existing"
    assert match is not None and match.get("status") == "existing"
    assert menu.get("publicPath") == "music/pulsefront.mp3"
    assert match.get("publicPath") == "music/iron-surge.mp3"
