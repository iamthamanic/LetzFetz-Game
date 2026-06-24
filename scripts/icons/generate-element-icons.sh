#!/usr/bin/env bash
# Generate brand UI element icons via Higgsfield (replaces SVG placeholders with PNG).
# Usage: bash scripts/icons/generate-element-icons.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../" && pwd)"
cd "$ROOT"
HF="${ROOT}/tools/bin/hf"
OUT="${ROOT}/public/icons/elements"
LOGO="${ROOT}/public/brand/letz-fetz-logo.png"

if [[ ! -x "$HF" ]]; then
  echo "Missing $HF — install Higgsfield CLI first."
  exit 1
fi

download() {
  curl -fsSL "$1" -o "$2"
  echo "Saved $2"
}

generate() {
  local key="$1"
  local prompt="$2"
  local dest="${OUT}/${key}.png"
  if [[ -f "$dest" ]]; then
    echo "SKIP exists: ${key}.png"
    return
  fi
  echo "Generating ${key}..."
  url=$("$HF" generate create gpt_image_2 \
    --image "$LOGO" \
    --prompt "$prompt" \
    --aspect_ratio 1:1 \
    --resolution 1k \
    --wait --wait-timeout 10m)
  download "$url" "$dest"
  sleep 2
}

mkdir -p "$OUT"

# Prompts inlined — keep in sync with elementSymbols.ts
generate fire "Letz Fetz TCG UI icon, bold flame symbol, grunge wheatpaste sticker beige parchment circle, black outline, blood splatter, no text"
generate water "Letz Fetz TCG UI icon, water droplet wave symbol, grunge wheatpaste sticker beige parchment circle, black outline, no text"
generate earth "Letz Fetz TCG UI icon, mountain rock earth symbol, grunge wheatpaste sticker beige parchment circle, black outline, no text"
generate air "Letz Fetz TCG UI icon, wind swirl symbol, grunge wheatpaste sticker beige parchment circle, black outline, no text"
generate shadow "Letz Fetz TCG UI icon, moon shadow symbol, grunge wheatpaste sticker beige parchment circle, black outline, no text"
generate light "Letz Fetz TCG UI icon, radiant sun light symbol, grunge wheatpaste sticker beige parchment circle, black outline, no text"
generate mystery "Letz Fetz TCG UI icon, large bold question mark symbol, mystery unknown element, grunge wheatpaste sticker beige parchment circle, black outline, purple mist, no other text"

echo "Done. Update resolveBrandIconPath to prefer .png when present."
