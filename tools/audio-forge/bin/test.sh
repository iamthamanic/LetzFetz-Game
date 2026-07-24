#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ -x "$ROOT/.venv/bin/python" ]]; then
  PY="$ROOT/.venv/bin/python"
elif command -v python3 >/dev/null; then
  PY=python3
else
  echo "error: python3 not found for audio:test" >&2
  exit 1
fi
export PYTHONPATH="$ROOT"
exec "$PY" -m pytest tests -q
