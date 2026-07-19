#!/usr/bin/env bash
# Generate all glyph sheets via Higgsfield GPT Image 2 (logo reference).
# Usage: bash scripts/font-authoring/generate-sheets.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../" && pwd)"
cd "$ROOT"
HF="$ROOT/tools/bin/hf"
LOGO="$ROOT/public/brand/letz-fetz-logo.png"
OUT="$ROOT/assets/font-authoring/sheets"
P='Font glyph sheet metal punk TCG Letz Fetz. Match reference: jagged cream letters, dark outline, right slant. NO skull glitch drips. White bg. Equal cap height. One horizontal row, equal cells.'

download() {
  local url="$1"
  local dest="$2"
  curl -fsSL "$url" -o "$dest"
  echo "Saved $dest"
}

generate() {
  local letters="$1"
  local outfile="$2"
  if [[ -f "$OUT/$outfile" ]]; then
    echo "SKIP exists: $outfile"
    return
  fi
  echo "Generating $outfile ($letters)..."
  url=$($HF generate create gpt_image_2 \
    --image "$LOGO" \
    --prompt "$P Letters: $letters" \
    --aspect_ratio 16:9 \
    --resolution 2k \
    --wait --wait-timeout 15m)
  download "$url" "$OUT/$outfile"
  sleep 2
}

mkdir -p "$OUT"

generate "A B C D E F" "uppercase-ABCDEF.png"
generate "G H I J K L" "uppercase-GHIJKL.png"
generate "M N O P Q R" "uppercase-MNOPQR.png"
generate "S T U V W X" "uppercase-STUVWX.png"
generate "Y Z" "uppercase-YZ.png"
generate "Ä Ö Ü" "uppercase-umlaut.png"
generate "a b c d e f" "lowercase-abcdef.png"
generate "g h i j k l" "lowercase-ghijkl.png"
generate "m n o p q r" "lowercase-mnopqr.png"
generate "s t u v w x" "lowercase-stuvwx.png"
generate "y z" "lowercase-yz.png"
generate "ä ö ü ß" "lowercase-umlaut.png"
generate "0 1 2 3 4 5 6 7 8 9" "digits.png"
generate ". , ! ? - : ' \" ( ) /" "punctuation.png"

echo "Done. Run: python3 scripts/font-authoring/split-sheets.py && python3 scripts/font-authoring/build-font.py"
