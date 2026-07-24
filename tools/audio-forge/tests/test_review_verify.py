"""Tests for audio:review and audio:verify."""

from __future__ import annotations

from pathlib import Path

from audio_forge.manifest import load_manifest
from audio_forge.review import build_review_html, cmd_review
from audio_forge.verify import run_verify


ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent.parent


def test_verify_passes_on_repo() -> None:
    code = run_verify(repo=REPO)
    assert code == 0


def test_verify_fails_when_approved_file_missing(tmp_path: Path) -> None:
    # Copy registry + package.json; use empty public dir + real-ish manifest.
    import json
    import shutil

    repo = tmp_path / "repo"
    (repo / "public" / "audio").mkdir(parents=True)
    (repo / "src" / "services" / "audio").mkdir(parents=True)
    shutil.copy(REPO / "package.json", repo / "package.json")
    # Minimal registry with approved URL
    (repo / "src" / "services" / "audio" / "soundRegistry.ts").write_text(
        "const REGISTRY = [\n"
        "  { id: 'card.clash', publicUrl: `/audio/sfx/card-clash.mp3` },\n"
        "];\n",
        encoding="utf-8",
    )
    manifest = {
        "version": 1,
        "publicRoot": "/audio",
        "sounds": [
            {
                "id": "card.clash",
                "category": "sfx",
                "status": "approved",
                "publicPath": "sfx/card-clash.mp3",
            }
        ],
    }
    man_path = tmp_path / "manifest.json"
    man_path.write_text(json.dumps(manifest), encoding="utf-8")
    code = run_verify(manifest_path=man_path, repo=repo)
    assert code == 1


def test_review_html_contains_ids(tmp_path: Path) -> None:
    manifest = load_manifest(ROOT / "sound-manifest.json")
    html_doc = build_review_html(manifest, candidates_dir=tmp_path)
    assert "card.clash" in html_doc
    assert "Audio Forge" in html_doc
    assert "No candidates yet" in html_doc


def test_cmd_review_writes_file(tmp_path: Path) -> None:
    out_path = tmp_path / "review" / "index.html"

    class Args:
        manifest = str(ROOT / "sound-manifest.json")
        candidates = str(tmp_path / "cand")
        out = str(out_path)

    assert cmd_review(Args()) == 0
    assert out_path.is_file()
    assert "music.menu.main" in out_path.read_text(encoding="utf-8")
