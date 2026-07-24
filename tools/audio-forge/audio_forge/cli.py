"""Audio Forge CLI."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from audio_forge import __version__
from audio_forge.audit_plan import cmd_audit, cmd_plan
from audio_forge.manifest import ManifestError, find_sound, load_manifest
from audio_forge.process import ProcessError, process_file, require_ffmpeg, resolve_candidate
from audio_forge.providers import ProviderError, ProviderInstallError, get_provider


STUB_COMMANDS = ("review", "verify")


def _print_python_hint() -> None:
    print(
        "Audio Forge needs Python 3.11+.\n"
        "Install Python, then: cd tools/audio-forge && python3 -m venv .venv "
        "&& source .venv/bin/activate && pip install -r requirements.txt",
        file=sys.stderr,
    )


def cmd_generate(args: argparse.Namespace) -> int:
    try:
        manifest = load_manifest(Path(args.manifest) if args.manifest else None)
    except ManifestError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    ids: list[str] = []
    if args.id:
        ids.append(args.id)
    if args.ids:
        ids.extend(x.strip() for x in args.ids.split(",") if x.strip())
    if not ids:
        print("error: pass --id or --ids", file=sys.stderr)
        return 2

    try:
        provider = get_provider(args.provider)
    except ProviderInstallError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    out_dir = Path(args.out)
    failures = 0
    for sound_id in ids:
        entry = find_sound(manifest, sound_id)
        if entry is None:
            print(f"error: unknown sound id: {sound_id}", file=sys.stderr)
            failures += 1
            continue
        prompt = entry.get("prompt") if isinstance(entry.get("prompt"), str) else sound_id
        try:
            result = provider.generate(sound_id, prompt, out_dir)
        except ProviderInstallError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 2
        except ProviderError as exc:
            print(f"error: {sound_id}: {exc}", file=sys.stderr)
            failures += 1
            continue
        print(
            f"generated {result.sound_id} via {result.provider} → {result.output_path} "
            f"({result.bytes_written} bytes)"
        )

    if failures:
        print(f"error: {failures}/{len(ids)} generate(s) failed", file=sys.stderr)
        return 1
    return 0


def cmd_process(args: argparse.Namespace) -> int:
    try:
        require_ffmpeg()
    except ProcessError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    candidates_dir = Path(args.candidates)
    masters_dir = Path(args.masters)
    web_dir = Path(args.web)

    ids: list[str] = []
    if args.id:
        ids.append(args.id)
    if args.ids:
        ids.extend(x.strip() for x in args.ids.split(",") if x.strip())

    jobs: list[tuple[str, Path]] = []
    if args.input:
        if not ids:
            print("error: --input requires --id", file=sys.stderr)
            return 2
        jobs.append((ids[0], Path(args.input)))
        ids = ids[1:]

    for sound_id in ids:
        candidate = resolve_candidate(candidates_dir, sound_id)
        if candidate is None:
            print(
                f"error: no candidate for {sound_id} under {candidates_dir}",
                file=sys.stderr,
            )
            continue
        jobs.append((sound_id, candidate))

    if not jobs:
        print(
            "error: nothing to process — pass --id/--ids (and optional --input)",
            file=sys.stderr,
        )
        return 2

    failures = 0
    for sound_id, input_path in jobs:
        try:
            result = process_file(sound_id, input_path, masters_dir, web_dir)
        except ProcessError as exc:
            print(f"error: {sound_id}: {exc}", file=sys.stderr)
            failures += 1
            continue
        print(
            f"processed {result.sound_id}: master={result.master_path} "
            f"web={result.web_mp3.name},{result.web_ogg.name}"
        )

    if failures:
        print(f"error: {failures}/{len(jobs)} process job(s) failed", file=sys.stderr)
        return 1
    return 0


def cmd_stub(name: str) -> int:
    print(
        f"audio:{name} is scaffolded but not implemented yet "
        f"(see later epic issues)."
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="audio_forge",
        description="Letz Fetz offline Audio Forge CLI",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command")

    gen = sub.add_parser("generate", help="Generate candidates (mock / stable_audio_local)")
    gen.add_argument("--id", default=None, help="Sound id, e.g. card.draw")
    gen.add_argument("--ids", default=None, help="Comma-separated sound ids")
    gen.add_argument(
        "--provider",
        default="mock",
        help="Provider name (default: mock). Use stable_audio_local for local model.",
    )
    gen.add_argument(
        "--out",
        default="tools/audio-forge/output/candidates",
        help="Output directory for candidates",
    )
    gen.add_argument("--manifest", default=None, help="Override manifest path")

    proc = sub.add_parser("process", help="FFmpeg: candidates → masters + web formats")
    proc.add_argument("--id", default=None, help="Sound id to process")
    proc.add_argument("--ids", default=None, help="Comma-separated sound ids")
    proc.add_argument("--input", default=None, help="Explicit input audio path")
    proc.add_argument(
        "--candidates",
        default="tools/audio-forge/output/candidates",
        help="Candidates directory",
    )
    proc.add_argument(
        "--masters",
        default="tools/audio-forge/output/masters",
        help="Masters output directory",
    )
    proc.add_argument(
        "--web",
        default="tools/audio-forge/output/web",
        help="Web formats output directory",
    )

    audit = sub.add_parser("audit", help="Compare code SoundId literals vs manifest")
    audit.add_argument("--manifest", default=None, help="Override manifest path")
    audit.add_argument("--repo", default=None, help="Repo root (default: auto)")

    plan = sub.add_parser(
        "plan",
        help="Add missing planned manifest rows (never overwrite prompts)",
    )
    plan.add_argument("--manifest", default=None, help="Override manifest path")
    plan.add_argument("--repo", default=None, help="Repo root (default: auto)")
    plan.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned additions without writing the manifest",
    )

    for name in STUB_COMMANDS:
        sub.add_parser(name, help=f"Stub — {name} (later issue)")

    sub.add_parser("help", help="Show help")
    return parser


def main(argv: list[str] | None = None) -> int:
    if sys.version_info < (3, 11):
        _print_python_hint()
        return 1

    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command is None or args.command == "help":
        parser.print_help()
        return 0
    if args.command == "generate":
        return cmd_generate(args)
    if args.command == "process":
        return cmd_process(args)
    if args.command == "audit":
        return cmd_audit(args)
    if args.command == "plan":
        return cmd_plan(args)
    if args.command in STUB_COMMANDS:
        return cmd_stub(args.command)
    parser.print_help()
    return 0
