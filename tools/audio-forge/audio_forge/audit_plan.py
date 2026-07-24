"""audio:audit and audio:plan implementations."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from audio_forge.manifest import ManifestError, load_manifest
from audio_forge.scan import scan_sound_ids


REPO_HINT = Path(__file__).resolve().parents[3]  # Letz-Fetz-Game/


def _default_scan_roots(repo: Path) -> list[Path]:
    return [repo / "src"]


def _public_file(repo: Path, public_path: str | None) -> Path | None:
    if not public_path:
        return None
    return repo / "public" / "audio" / public_path


def cmd_audit(args: Any) -> int:
    repo = Path(args.repo).resolve() if getattr(args, "repo", None) else REPO_HINT
    try:
        manifest = load_manifest(Path(args.manifest) if args.manifest else None)
    except ManifestError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    sounds: list[dict[str, Any]] = [
        s for s in manifest.get("sounds", []) if isinstance(s, dict)
    ]
    by_id = {str(s["id"]): s for s in sounds if "id" in s}
    used, notes = scan_sound_ids(_default_scan_roots(repo))

    missing_from_manifest = sorted(used - set(by_id))
    unused_in_code = sorted(set(by_id) - used)
    missing_files: list[str] = []
    for sid, entry in by_id.items():
        if entry.get("status") not in {"existing", "approved"}:
            continue
        path = _public_file(repo, entry.get("publicPath") if isinstance(entry.get("publicPath"), str) else None)
        if path is None or not path.is_file():
            missing_files.append(sid)

    print("=== audio:audit ===")
    print(f"repo: {repo}")
    print(f"manifest ids: {len(by_id)}")
    print(f"used in code (literals): {len(used)}")
    print(f"used but missing from manifest: {len(missing_from_manifest)}")
    for sid in missing_from_manifest:
        print(f"  - {sid}")
    print(f"in manifest unused by scan: {len(unused_in_code)}")
    for sid in unused_in_code[:20]:
        print(f"  - {sid}")
    if len(unused_in_code) > 20:
        print(f"  … +{len(unused_in_code) - 20} more")
    print(f"existing/approved missing files: {len(missing_files)}")
    for sid in missing_files:
        print(f"  - {sid}")
    print("notes:")
    for note in notes:
        print(f"  - {note}")

    if missing_from_manifest or missing_files:
        return 1
    return 0


def cmd_plan(args: Any) -> int:
    repo = Path(args.repo).resolve() if getattr(args, "repo", None) else REPO_HINT
    manifest_path = Path(args.manifest) if args.manifest else (
        Path(__file__).resolve().parent.parent / "sound-manifest.json"
    )
    try:
        manifest = load_manifest(manifest_path)
    except ManifestError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    sounds: list[dict[str, Any]] = list(manifest.get("sounds", []))
    by_id = {
        str(s["id"]): s
        for s in sounds
        if isinstance(s, dict) and isinstance(s.get("id"), str)
    }
    used, _notes = scan_sound_ids(_default_scan_roots(repo))
    added: list[str] = []
    preserved = 0

    for sid in sorted(used):
        if sid in by_id:
            preserved += 1
            continue
        category = sid.split(".", 1)[0]
        if category == "ui":
            cat = "ui"
        elif category in {"ambience", "music"}:
            cat = category
        else:
            cat = "sfx"
        sounds.append(
            {
                "id": sid,
                "category": cat,
                "status": "planned",
                "publicPath": None,
                "prompt": f"TODO: curated prompt for {sid}",
            }
        )
        added.append(sid)

    # Never clobber curated prompts — we only append new rows above.
    manifest["sounds"] = sounds
    if not getattr(args, "dry_run", False):
        manifest_path.write_text(
            json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
        )

    print("=== audio:plan ===")
    print(f"added planned entries: {len(added)}")
    for sid in added:
        print(f"  + {sid}")
    print(f"existing entries left untouched: {preserved}")
    if getattr(args, "dry_run", False):
        print("(dry-run — manifest not written)")
    return 0
