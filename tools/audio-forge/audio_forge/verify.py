"""audio:verify — manifest ↔ public files ↔ runtime registry consistency."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

from audio_forge.manifest import ManifestError, load_manifest


PACKAGE_ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = PACKAGE_ROOT.parent.parent
DEFAULT_PUBLIC = REPO_ROOT / "public" / "audio"
DEFAULT_REGISTRY = REPO_ROOT / "src" / "services" / "audio" / "soundRegistry.ts"
DEFAULT_PACKAGE_JSON = REPO_ROOT / "package.json"

# Statuses that require a file on disk and a runtime publicUrl.
RUNTIME_FILE_STATUSES = frozenset({"approved", "existing"})


def _repo_root(args_repo: str | None) -> Path:
    return Path(args_repo) if args_repo else REPO_ROOT


def _public_root(repo: Path, manifest: dict[str, Any]) -> Path:
    # Manifest publicRoot is URL path (/audio); files live under public/audio.
    return repo / "public" / "audio"


def _parse_registry_urls(registry_ts: Path) -> dict[str, str | None]:
    """Extract id → publicUrl string literals from soundRegistry.ts (best-effort)."""
    text = registry_ts.read_text(encoding="utf-8")
    # Match blocks like: id: 'card.clash', ... publicUrl: `/audio/...` or null
    pattern = re.compile(
        r"id:\s*'(?P<id>[^']+)'[\s\S]*?publicUrl:\s*(?P<url>null|`[^`]+`|'[^']+'|\"[^\"]+\")",
        re.MULTILINE,
    )
    found: dict[str, str | None] = {}
    for match in pattern.finditer(text):
        sound_id = match.group("id")
        raw = match.group("url")
        if raw == "null":
            found[sound_id] = None
            continue
        url = raw.strip("`\"'")
        # Expand `${AUDIO_PUBLIC_ROOT}/…` used in soundRegistry.ts
        url = url.replace("${AUDIO_PUBLIC_ROOT}", "/audio")
        found[sound_id] = url
    return found


def _scan_unregistered_files(
    public_dir: Path, registered_relpaths: set[str]
) -> list[str]:
    extras: list[str] = []
    if not public_dir.is_dir():
        return extras
    for path in public_dir.rglob("*"):
        if not path.is_file():
            continue
        if path.name.startswith("."):
            continue
        rel = path.relative_to(public_dir).as_posix()
        if rel not in registered_relpaths:
            extras.append(rel)
    return sorted(extras)


def _check_forge_not_in_package_deps(package_json: Path) -> list[str]:
    errors: list[str] = []
    if not package_json.is_file():
        return [f"package.json missing: {package_json}"]
    raw: Any = json.loads(package_json.read_text(encoding="utf-8"))
    for section in ("dependencies", "devDependencies", "optionalDependencies"):
        deps = raw.get(section)
        if not isinstance(deps, dict):
            continue
        for name in deps:
            lower = str(name).lower()
            if "audio-forge" in lower or "audio_forge" in lower or "stable-audio" in lower:
                errors.append(f"{section} lists forbidden forge-related package: {name}")
    return errors


def run_verify(
    *,
    manifest_path: Path | None = None,
    repo: Path | None = None,
    registry_ts: Path | None = None,
) -> int:
    repo_root = repo or REPO_ROOT
    try:
        manifest = load_manifest(manifest_path)
    except ManifestError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    public_dir = _public_root(repo_root, manifest)
    registry_path = registry_ts or (repo_root / "src" / "services" / "audio" / "soundRegistry.ts")
    package_json = repo_root / "package.json"

    errors: list[str] = []
    warnings: list[str] = []

    if not registry_path.is_file():
        print(f"error: registry not found: {registry_path}", file=sys.stderr)
        return 2

    registry_urls = _parse_registry_urls(registry_path)
    registered_relpaths: set[str] = set()
    public_root_url = str(manifest.get("publicRoot") or "/audio").rstrip("/")

    sounds = manifest.get("sounds")
    if not isinstance(sounds, list):
        print("error: manifest.sounds invalid", file=sys.stderr)
        return 2

    for entry in sounds:
        if not isinstance(entry, dict):
            errors.append("non-object sound entry")
            continue
        sound_id = entry.get("id")
        status = entry.get("status")
        public_path = entry.get("publicPath")
        if not isinstance(sound_id, str):
            errors.append("sound entry missing id")
            continue

        if status in RUNTIME_FILE_STATUSES:
            if not isinstance(public_path, str) or not public_path:
                errors.append(f"{sound_id}: status={status} but publicPath missing")
                continue
            registered_relpaths.add(public_path)
            file_path = public_dir / public_path
            if not file_path.is_file():
                errors.append(f"{sound_id}: approved file missing: {file_path}")

            expected_url = f"{public_root_url}/{public_path}"
            reg_url = registry_urls.get(sound_id)
            if reg_url is None:
                errors.append(
                    f"{sound_id}: approved in manifest but registry publicUrl is null/missing"
                )
            elif reg_url != expected_url:
                errors.append(
                    f"{sound_id}: registry URL {reg_url!r} != expected {expected_url!r}"
                )
        else:
            # planned / other — must not expose a file URL in registry
            reg_url = registry_urls.get(sound_id)
            if reg_url is not None:
                errors.append(
                    f"{sound_id}: status={status} but registry has publicUrl {reg_url!r} "
                    "(runtime file URLs are approved-only)"
                )

    extras = _scan_unregistered_files(public_dir, registered_relpaths)
    for rel in extras:
        warnings.append(f"unregistered public file (ok/warned): {rel}")

    errors.extend(_check_forge_not_in_package_deps(package_json))

    # Soft check: no TS/TSX under src imports tools/audio-forge except tests reading JSON.
    src = repo_root / "src"
    if src.is_dir():
        for path in src.rglob("*"):
            if path.suffix not in {".ts", ".tsx"}:
                continue
            if path.name.endswith(".test.ts") or path.name.endswith(".test.tsx"):
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            if "tools/audio-forge" in text and "sound-manifest.json" not in text:
                errors.append(f"src imports forge tooling: {path.relative_to(repo_root)}")
            if re.search(r"from\s+['\"].*audio_forge", text):
                errors.append(f"src imports audio_forge package: {path.relative_to(repo_root)}")

    for warn in warnings:
        print(f"warn: {warn}")
    for err in errors:
        print(f"error: {err}", file=sys.stderr)

    approved_count = sum(
        1
        for e in sounds
        if isinstance(e, dict) and e.get("status") in RUNTIME_FILE_STATUSES
    )
    print(
        f"verify: approved/existing={approved_count} errors={len(errors)} "
        f"warnings={len(warnings)}"
    )
    if errors:
        return 1
    return 0


def cmd_verify(args: Any) -> int:
    return run_verify(
        manifest_path=Path(args.manifest) if getattr(args, "manifest", None) else None,
        repo=_repo_root(getattr(args, "repo", None)),
    )
