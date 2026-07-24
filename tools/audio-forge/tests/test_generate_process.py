"""Tests for generate providers + FFmpeg process pipeline."""

from __future__ import annotations

import shutil
from pathlib import Path

import pytest

from audio_forge.process import ProcessError, process_file, require_ffmpeg
from audio_forge.providers import (
    MockProvider,
    ProviderInstallError,
    StableAudioLocalProvider,
    get_provider,
)
from audio_forge.providers.stable_audio_local import is_installed


ROOT = Path(__file__).resolve().parents[1]


def test_get_provider_unknown() -> None:
    with pytest.raises(ProviderInstallError, match="Unknown provider"):
        get_provider("stability_cloud")


def test_stable_audio_local_missing_install(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("AUDIO_FORGE_STABLE_AUDIO_CMD", raising=False)
    monkeypatch.setattr(
        "audio_forge.providers.stable_audio_local._package_available",
        lambda: False,
    )
    assert is_installed() is False
    with pytest.raises(ProviderInstallError, match="not installed"):
        StableAudioLocalProvider().generate("card.draw", "prompt", ROOT / "output" / "t")


def test_stable_audio_local_via_cmd(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    # Tiny WAV writer used as "local model" stand-in — no cloud.
    script = tmp_path / "fake_infer.py"
    script.write_text(
        "import sys, wave, struct\n"
        "out = sys.argv[1]\n"
        "with wave.open(out, 'w') as wf:\n"
        "  wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(22050)\n"
        "  wf.writeframes(struct.pack('<h', 0) * 2205)\n",
        encoding="utf-8",
    )
    monkeypatch.setenv(
        "AUDIO_FORGE_STABLE_AUDIO_CMD",
        f"python3 {script} {{out}}",
    )
    monkeypatch.setattr(
        "audio_forge.providers.stable_audio_local._package_available",
        lambda: False,
    )
    out_dir = tmp_path / "cand"
    result = StableAudioLocalProvider().generate("card.draw", "prompt", out_dir)
    assert result.provider == "stable_audio_local"
    assert result.output_path.is_file()
    assert result.bytes_written > 0


@pytest.mark.skipif(shutil.which("ffmpeg") is None, reason="ffmpeg not installed")
def test_process_produces_master_and_web(tmp_path: Path) -> None:
    require_ffmpeg()
    cand = MockProvider().generate("card.draw", "p", tmp_path / "cand")
    masters = tmp_path / "masters"
    web = tmp_path / "web"
    result = process_file("card.draw", cand.output_path, masters, web)
    assert result.master_path.is_file()
    assert result.web_mp3.is_file()
    assert result.web_ogg.is_file()
    assert result.master_path.suffix == ".wav"
    assert result.web_mp3.stat().st_size > 0
    assert result.web_ogg.stat().st_size > 0


def test_process_missing_ffmpeg(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr("audio_forge.process.shutil.which", lambda _name: None)
    with pytest.raises(ProcessError, match="ffmpeg not found"):
        require_ffmpeg()
    with pytest.raises(ProcessError, match="ffmpeg not found"):
        process_file(
            "card.draw",
            tmp_path / "missing.wav",
            tmp_path / "m",
            tmp_path / "w",
        )


def test_mock_provider_default_no_api_keys_needed() -> None:
    """Default CI path uses mock — no cloud credentials required."""
    assert get_provider("mock").name == "mock"
