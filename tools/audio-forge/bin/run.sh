#!/usr/bin/env bash
# Run Audio Forge CLI with a clear error if Python is missing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found. Install Python 3.11+ then:" >&2
  echo "  cd tools/audio-forge && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt" >&2
  exit 1
fi

export PYTHONPATH="${ROOT}${PYTHONPATH:+:$PYTHONPATH}"
cd "$REPO_ROOT"
exec python3 -m audio_forge "$@"
