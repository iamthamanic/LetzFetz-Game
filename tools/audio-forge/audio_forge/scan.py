"""Static scan of TS/TSX for typed sound ID string literals."""

from __future__ import annotations

import re
from pathlib import Path

# Known first-wave prefixes — dynamic/non-literal IDs are a documented limitation.
SOUND_ID_RE = re.compile(
    r"['\"]("
    r"(?:card|dice|combat|ability|round|match|ui|ambience|music)"
    r"\.[a-z0-9.]+"
    r")['\"]"
)

SKIP_DIR_NAMES = {
    "node_modules",
    "build",
    "dist",
    ".git",
    ".venv",
    "output",
    "__pycache__",
}


def iter_source_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in {".ts", ".tsx", ".mts", ".cts"}:
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        files.append(path)
    return sorted(files)


def scan_sound_ids(roots: list[Path]) -> tuple[set[str], list[str]]:
    """Return (ids, notes). Notes document scan limitations."""
    found: set[str] = set()
    for root in roots:
        if not root.exists():
            continue
        for path in iter_source_files(root):
            try:
                text = path.read_text(encoding="utf-8")
            except OSError:
                continue
            for match in SOUND_ID_RE.finditer(text):
                found.add(match.group(1))
    notes = [
        "Limitation: only string-literal IDs matching known prefixes are detected.",
        "Dynamic SoundId expressions are not reported.",
    ]
    return found, notes
