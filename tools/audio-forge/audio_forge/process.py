"""FFmpeg process step: candidates → masters (loudnorm WAV) + web (mp3/ogg)."""

from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path


class ProcessError(RuntimeError):
    """FFmpeg missing or process failure."""


FFMPEG_HINT = """\
ffmpeg not found on PATH.

Install FFmpeg (e.g. brew install ffmpeg / apt install ffmpeg), then re-run
npm run audio:process. Audio Forge does not ship a cloud encoder.
"""


@dataclass(frozen=True)
class ProcessResult:
    sound_id: str
    input_path: Path
    master_path: Path
    web_mp3: Path
    web_ogg: Path


def require_ffmpeg() -> str:
    path = shutil.which("ffmpeg")
    if path is None:
        raise ProcessError(FFMPEG_HINT)
    return path


def _safe_id(sound_id: str) -> str:
    return sound_id.replace(".", "_")


def resolve_candidate(candidates_dir: Path, sound_id: str) -> Path | None:
    """Prefer newest matching candidate for sound_id."""
    safe = _safe_id(sound_id)
    matches = sorted(
        [
            p
            for p in candidates_dir.glob(f"{safe}.*")
            if p.is_file() and p.suffix.lower() in {".wav", ".flac", ".aiff", ".mp3"}
        ],
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    return matches[0] if matches else None


def process_file(
    sound_id: str,
    input_path: Path,
    masters_dir: Path,
    web_dir: Path,
    *,
    ffmpeg_bin: str | None = None,
) -> ProcessResult:
    ffmpeg = ffmpeg_bin or require_ffmpeg()
    if not input_path.is_file():
        raise ProcessError(f"Input not found: {input_path}")

    masters_dir.mkdir(parents=True, exist_ok=True)
    web_dir.mkdir(parents=True, exist_ok=True)
    safe = _safe_id(sound_id)
    master_path = masters_dir / f"{safe}.wav"
    web_mp3 = web_dir / f"{safe}.mp3"
    web_ogg = web_dir / f"{safe}.ogg"

    # Master: mono-friendly loudnorm → 48k WAV (web-ready master).
    _run_ffmpeg(
        ffmpeg,
        [
            "-y",
            "-i",
            str(input_path),
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar",
            "48000",
            str(master_path),
        ],
        label="master",
    )

    # Web formats from master.
    _run_ffmpeg(
        ffmpeg,
        ["-y", "-i", str(master_path), "-codec:a", "libmp3lame", "-q:a", "4", str(web_mp3)],
        label="web-mp3",
    )
    _run_ffmpeg(
        ffmpeg,
        ["-y", "-i", str(master_path), "-codec:a", "libvorbis", "-q:a", "4", str(web_ogg)],
        label="web-ogg",
    )

    for path in (master_path, web_mp3, web_ogg):
        if not path.is_file() or path.stat().st_size == 0:
            raise ProcessError(f"FFmpeg produced empty/missing output: {path}")

    return ProcessResult(
        sound_id=sound_id,
        input_path=input_path,
        master_path=master_path,
        web_mp3=web_mp3,
        web_ogg=web_ogg,
    )


def _run_ffmpeg(ffmpeg: str, args: list[str], *, label: str) -> None:
    cmd = [ffmpeg, "-hide_banner", "-loglevel", "error", *args]
    try:
        completed = subprocess.run(cmd, check=False, capture_output=True, text=True)
    except OSError as exc:
        raise ProcessError(f"Failed to run ffmpeg ({label}): {exc}") from exc
    if completed.returncode != 0:
        err = (completed.stderr or completed.stdout or "").strip()
        raise ProcessError(f"ffmpeg {label} failed (exit {completed.returncode}): {err}")
