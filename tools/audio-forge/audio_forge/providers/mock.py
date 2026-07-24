"""Deterministic mock provider — CI-safe placeholder WAV (no GPU / API)."""

from __future__ import annotations

import hashlib
import math
import struct
import wave
from pathlib import Path

from audio_forge.providers.types import GenerateResult


class MockProvider:
    name = "mock"

    def generate(self, sound_id: str, prompt: str, out_dir: Path) -> GenerateResult:
        out_dir.mkdir(parents=True, exist_ok=True)
        safe = sound_id.replace(".", "_")
        out_path = out_dir / f"{safe}.mock.wav"
        seed = int(hashlib.sha256(f"{sound_id}:{prompt}".encode()).hexdigest()[:8], 16)
        sample_rate = 22050
        duration_sec = 0.12
        n_frames = int(sample_rate * duration_sec)
        freq = 180.0 + (seed % 400)

        with wave.open(str(out_path), "w") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            frames = bytearray()
            for i in range(n_frames):
                t = i / sample_rate
                # Short decaying tone — deterministic from id+prompt.
                amp = int(12000 * math.exp(-t * 18) * math.sin(2 * math.pi * freq * t))
                frames.extend(struct.pack("<h", max(-32767, min(32767, amp))))
            wf.writeframes(bytes(frames))

        size = out_path.stat().st_size
        return GenerateResult(
            sound_id=sound_id,
            output_path=out_path,
            provider=self.name,
            bytes_written=size,
        )
