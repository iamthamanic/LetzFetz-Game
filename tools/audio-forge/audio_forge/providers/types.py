"""Shared provider result types."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class GenerateResult:
    sound_id: str
    output_path: Path
    provider: str
    bytes_written: int
