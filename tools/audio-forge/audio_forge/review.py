"""Generate static review HTML for Audio Forge candidates."""

from __future__ import annotations

import html
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from audio_forge.manifest import ManifestError, load_manifest


PACKAGE_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = PACKAGE_ROOT / "review" / "index.html"
DEFAULT_CANDIDATES = PACKAGE_ROOT / "output" / "candidates"


def _safe_id(sound_id: str) -> str:
    return sound_id.replace(".", "_")


def _find_candidates(candidates_dir: Path, sound_id: str) -> list[Path]:
    safe = _safe_id(sound_id)
    if not candidates_dir.is_dir():
        return []
    return sorted(
        p
        for p in candidates_dir.glob(f"{safe}.*")
        if p.is_file() and p.suffix.lower() in {".wav", ".mp3", ".ogg", ".flac"}
    )


def build_review_html(
    manifest: dict[str, Any],
    *,
    candidates_dir: Path,
) -> str:
    sounds = manifest.get("sounds")
    if not isinstance(sounds, list):
        sounds = []

    rows: list[str] = []
    for entry in sounds:
        if not isinstance(entry, dict):
            continue
        sound_id = entry.get("id")
        if not isinstance(sound_id, str):
            continue
        status = str(entry.get("status") or "")
        category = str(entry.get("category") or "")
        prompt = entry.get("prompt") if isinstance(entry.get("prompt"), str) else ""
        public_path = entry.get("publicPath")
        candidates = _find_candidates(candidates_dir, sound_id)

        audio_bits: list[str] = []
        for cand in candidates:
            # Relative from review/index.html → ../output/candidates/...
            rel = Path("..") / "output" / "candidates" / cand.name
            src = html.escape(rel.as_posix())
            audio_bits.append(
                f'<div class="cand"><code>{html.escape(cand.name)}</code>'
                f'<audio controls preload="none" src="{src}"></audio></div>'
            )
        if not audio_bits:
            audio_bits.append('<p class="muted">No candidates yet</p>')

        pub = (
            html.escape(str(public_path))
            if isinstance(public_path, str)
            else "—"
        )
        rows.append(
            "<tr>"
            f"<td><code>{html.escape(sound_id)}</code></td>"
            f"<td>{html.escape(category)}</td>"
            f"<td><span class=\"status status-{html.escape(status)}\">{html.escape(status)}</span></td>"
            f"<td>{pub}</td>"
            f"<td class=\"prompt\">{html.escape(prompt)}</td>"
            f"<td>{''.join(audio_bits)}</td>"
            "</tr>"
        )

    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    body_rows = "\n".join(rows) if rows else "<tr><td colspan='6'>No sounds</td></tr>"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Letz Fetz — Audio Forge Review</title>
  <style>
    :root {{
      --bg: #12141a;
      --panel: #1a1e28;
      --text: #e8eaef;
      --muted: #9aa3b5;
      --line: #2a3140;
      --ok: #3d9a6a;
      --plan: #8a7a3d;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font: 14px/1.45 ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 1.5rem;
    }}
    h1 {{ font-size: 1.35rem; margin: 0 0 0.25rem; }}
    .meta {{ color: var(--muted); margin-bottom: 1.25rem; }}
    table {{
      width: 100%;
      border-collapse: collapse;
      background: var(--panel);
    }}
    th, td {{
      border-bottom: 1px solid var(--line);
      padding: 0.65rem 0.75rem;
      vertical-align: top;
      text-align: left;
    }}
    th {{ color: var(--muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }}
    code {{ font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85em; }}
    .prompt {{ max-width: 22rem; color: var(--muted); font-size: 0.9em; }}
    .muted {{ color: var(--muted); margin: 0; }}
    .cand {{ margin-bottom: 0.5rem; }}
    audio {{ display: block; width: 14rem; margin-top: 0.25rem; }}
    .status-approved, .status-existing {{ color: var(--ok); }}
    .status-planned {{ color: var(--plan); }}
  </style>
</head>
<body>
  <h1>Audio Forge — Review</h1>
  <p class="meta">Static review sheet · generated {html.escape(generated)} · approve by setting manifest status to <code>approved</code> then run <code>audio:verify</code></p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Status</th>
        <th>publicPath</th>
        <th>Prompt</th>
        <th>Candidates</th>
      </tr>
    </thead>
    <tbody>
{body_rows}
    </tbody>
  </table>
</body>
</html>
"""


def cmd_review(args: Any) -> int:
    try:
        manifest = load_manifest(Path(args.manifest) if args.manifest else None)
    except ManifestError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    candidates = Path(args.candidates)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    html_doc = build_review_html(manifest, candidates_dir=candidates)
    out_path.write_text(html_doc, encoding="utf-8")
    print(f"wrote review HTML → {out_path}")
    return 0
