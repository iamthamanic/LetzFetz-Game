"""Local Stable Audio adapter — never falls back to cloud APIs.

Detection order:
1. Env ``AUDIO_FORGE_STABLE_AUDIO_CMD`` — shell command template with
   ``{prompt}``, ``{out}``, ``{id}`` placeholders.
2. Importable ``stable_audio_tools`` package (optional local install).

If neither is available → ``ProviderInstallError`` with install hints.
"""

from __future__ import annotations

import importlib.util
import os
import shlex
import subprocess
from pathlib import Path

from audio_forge.providers.errors import ProviderError, ProviderInstallError
from audio_forge.providers.types import GenerateResult

INSTALL_HINT = """\
stable_audio_local is not installed or configured.

Install a local Stable Audio toolchain (GPU/CPU) and either:

  1. Set AUDIO_FORGE_STABLE_AUDIO_CMD to a local command that writes a WAV,
     with placeholders {prompt} {out} {id}, e.g.:
       export AUDIO_FORGE_STABLE_AUDIO_CMD='my-local-infer --prompt {prompt} --out {out}'

  2. Or install the optional Python package ``stable_audio_tools`` in this
     venv so Audio Forge can import it.

This provider NEVER calls paid cloud APIs. Use --provider mock for CI.
"""


def _cmd_configured() -> str | None:
    raw = os.environ.get("AUDIO_FORGE_STABLE_AUDIO_CMD", "").strip()
    return raw or None


def _package_available() -> bool:
    return importlib.util.find_spec("stable_audio_tools") is not None


def is_installed() -> bool:
    return _cmd_configured() is not None or _package_available()


class StableAudioLocalProvider:
    name = "stable_audio_local"

    def generate(self, sound_id: str, prompt: str, out_dir: Path) -> GenerateResult:
        if not is_installed():
            raise ProviderInstallError(INSTALL_HINT)

        out_dir.mkdir(parents=True, exist_ok=True)
        safe = sound_id.replace(".", "_")
        out_path = out_dir / f"{safe}.stable_local.wav"

        cmd_tmpl = _cmd_configured()
        if cmd_tmpl is not None:
            return self._run_cmd(cmd_tmpl, sound_id, prompt, out_path)

        # Package present but no CLI bridge yet — refuse silent no-op / cloud.
        raise ProviderInstallError(
            "stable_audio_tools is importable, but AUDIO_FORGE_STABLE_AUDIO_CMD "
            "is not set. Point the env var at a local inference command that "
            "writes a WAV (placeholders: {prompt} {out} {id}).\n\n"
            "No cloud fallback will be attempted."
        )

    def _run_cmd(
        self,
        cmd_tmpl: str,
        sound_id: str,
        prompt: str,
        out_path: Path,
    ) -> GenerateResult:
        try:
            filled = cmd_tmpl.format(
                prompt=shlex.quote(prompt),
                out=shlex.quote(str(out_path)),
                id=shlex.quote(sound_id),
            )
        except (KeyError, ValueError) as exc:
            raise ProviderError(
                f"Invalid AUDIO_FORGE_STABLE_AUDIO_CMD template: {exc}"
            ) from exc

        try:
            completed = subprocess.run(
                filled,
                shell=True,
                check=False,
                capture_output=True,
                text=True,
                timeout=600,
            )
        except OSError as exc:
            raise ProviderError(f"Failed to run local Stable Audio command: {exc}") from exc

        if completed.returncode != 0:
            err = (completed.stderr or completed.stdout or "").strip()
            raise ProviderError(
                f"Local Stable Audio command failed (exit {completed.returncode}): {err}"
            )

        if not out_path.is_file() or out_path.stat().st_size == 0:
            raise ProviderError(
                f"Local Stable Audio command finished but output missing/empty: {out_path}"
            )

        return GenerateResult(
            sound_id=sound_id,
            output_path=out_path,
            provider=self.name,
            bytes_written=out_path.stat().st_size,
        )
