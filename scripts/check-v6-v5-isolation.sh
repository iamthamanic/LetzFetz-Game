#!/usr/bin/env bash
# Fail if V6 paths import V5 formulaCombinations SoT.
# Also mirrored in workspace @letz-fetz-check probe A10.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v rg >/dev/null 2>&1; then
  echo "FAIL: ripgrep (rg) required" >&2
  exit 1
fi

PATHS=()
for p in src/content/v6 src/generated/v6 src/game/packs/v6; do
  [[ -d "$p" ]] && PATHS+=("$p")
done

if [[ ${#PATHS[@]} -eq 0 ]]; then
  echo "PASS  V6 paths absent — isolation N/A"
  exit 0
fi

HITS=$(rg -n --glob '*.ts' --glob '*.tsx' --glob '*.js' --glob '*.mjs' \
  -e "from ['\"][^'\"]*packs/v5/formulaCombinations" \
  -e "from ['\"][^'\"]*v5/formulaCombinations" \
  -e "formulaCombinations\.catalog" \
  "${PATHS[@]}" 2>/dev/null || true)

# Drop comment-only lines
HITS=$(echo "$HITS" | grep -v -E ':[0-9]+:[[:space:]]*(//|/\*|\*)' || true)

if [[ -n "$HITS" ]]; then
  echo "FAIL  V6 paths must not import V5 formulaCombinations:"
  echo "$HITS"
  exit 1
fi

echo "PASS  V6↔V5 formula SoT isolation"
exit 0
