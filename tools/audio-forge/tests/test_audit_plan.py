"""Tests for audio:audit / audio:plan merge behavior."""

from __future__ import annotations

import json
from pathlib import Path

from audio_forge.audit_plan import cmd_plan
from audio_forge.manifest import load_manifest
from audio_forge.scan import scan_sound_ids


ROOT = Path(__file__).resolve().parents[1]


def test_scan_finds_literal_ids(tmp_path: Path) -> None:
    src = tmp_path / "src"
    src.mkdir()
    (src / "a.ts").write_text(
        "audioManager.play('card.draw');\naudioManager.playMusic('music.menu.main');\n",
        encoding="utf-8",
    )
    ids, notes = scan_sound_ids([tmp_path])
    assert "card.draw" in ids
    assert "music.menu.main" in ids
    assert notes


def test_plan_adds_without_clobbering_prompt(tmp_path: Path) -> None:
    src = tmp_path / "src"
    src.mkdir()
    (src / "x.ts").write_text("play('ui.extra.test');\n", encoding="utf-8")

    manifest_path = tmp_path / "sound-manifest.json"
    curated = "KEEP THIS PROMPT"
    manifest_path.write_text(
        json.dumps(
            {
                "version": 1,
                "sounds": [
                    {
                        "id": "card.clash",
                        "category": "sfx",
                        "status": "existing",
                        "publicPath": "sfx/card-clash.mp3",
                        "prompt": curated,
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    class Args:
        manifest = str(manifest_path)
        repo = str(tmp_path)
        dry_run = False

    assert cmd_plan(Args()) == 0
    data = load_manifest(manifest_path)
    by_id = {s["id"]: s for s in data["sounds"]}
    assert by_id["card.clash"]["prompt"] == curated
    assert "ui.extra.test" in by_id
    assert by_id["ui.extra.test"]["status"] == "planned"
