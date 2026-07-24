"""Resolve provider by name — never silently swap to cloud."""

from __future__ import annotations

from typing import Protocol

from audio_forge.providers.errors import ProviderInstallError
from audio_forge.providers.mock import MockProvider
from audio_forge.providers.stable_audio_local import StableAudioLocalProvider
from audio_forge.providers.types import GenerateResult


class Provider(Protocol):
    name: str

    def generate(self, sound_id: str, prompt: str, out_dir: object) -> GenerateResult: ...


KNOWN = ("mock", "stable_audio_local")


def get_provider(name: str) -> Provider:
    if name == "mock":
        return MockProvider()
    if name == "stable_audio_local":
        return StableAudioLocalProvider()
    raise ProviderInstallError(
        f"Unknown provider '{name}'. Known: {', '.join(KNOWN)}. "
        "No cloud fallback is available."
    )
