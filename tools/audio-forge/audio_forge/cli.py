"""Audio Forge CLI skeleton."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from audio_forge import __version__
from audio_forge.manifest import ManifestError, find_sound, load_manifest
from audio_forge.providers import MockProvider


STUB_COMMANDS = ("audit", "plan", "process", "review", "verify")


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

    sound_id = args.id
    entry = find_sound(manifest, sound_id)
    if entry is None:
        print(f"error: unknown sound id: {sound_id}", file=sys.stderr)
        return 2

    provider_name = args.provider
    if provider_name != "mock":
        print(
            f"error: provider '{provider_name}' is not available in scaffold "
            "(use --provider mock). Local Stable Audio lands in a later issue.",
            file=sys.stderr,
        )
        return 2

    prompt = entry.get("prompt") if isinstance(entry.get("prompt"), str) else sound_id
    out_dir = Path(args.out)
    result = MockProvider().generate(sound_id, prompt, out_dir)
    print(
        f"generated {result.sound_id} via {result.provider} → {result.output_path} "
        f"({result.bytes_written} bytes)"
    )
    return 0


def cmd_stub(name: str) -> int:
    print(
        f"audio:{name} is scaffolded but not implemented yet "
        f"(see later epic issues). Use: audio:help / audio:generate --provider mock"
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="audio_forge",
        description="Letz Fetz offline Audio Forge CLI",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = parser.add_subparsers(dest="command")

    gen = sub.add_parser("generate", help="Generate candidates (mock provider in scaffold)")
    gen.add_argument("--id", required=True, help="Sound id, e.g. card.draw")
    gen.add_argument("--provider", default="mock", help="Provider name (default: mock)")
    gen.add_argument(
        "--out",
        default="tools/audio-forge/output/candidates",
        help="Output directory for candidates",
    )
    gen.add_argument("--manifest", default=None, help="Override manifest path")

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
    if args.command in STUB_COMMANDS:
        return cmd_stub(args.command)
    parser.print_help()
    return 0
