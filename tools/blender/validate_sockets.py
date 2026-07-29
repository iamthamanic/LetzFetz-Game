"""
Validate GLB named sockets against docs/engine-system/specs/<id>.json.
Location: tools/blender/validate_sockets.py

Usage (Blender CLI):
  blender -b -P tools/blender/validate_sockets.py -- <asset-id>

Exit: 0 ok | 1 fail | 2 usage
"""
from __future__ import annotations

import sys
from pathlib import Path

# Allow `import common.*` when Blender runs this file.
_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from common.paths import (  # noqa: E402
    argv_after_double_dash,
    glb_path,
    load_spec,
    reject_unsafe_asset_id,
    repo_root,
)


def _require_bpy():
    try:
        import bpy  # type: ignore

        return bpy
    except ImportError:
        print(
            "DE: Dieses Skript muss in Blender laufen (bpy fehlt).\n"
            "EN: This script must run inside Blender (bpy missing).\n"
            "DE: Nutzen: npm run asset:blender -- validate_sockets <asset-id>\n"
            "EN: Use: npm run asset:blender -- validate_sockets <asset-id>",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> None:
    args = argv_after_double_dash()
    if not args or args[0].startswith("-"):
        print(
            "Usage: blender -b -P tools/blender/validate_sockets.py -- <asset-id>\n"
            "DE: Prüft SOCKET_* Nodes gegen Spec-JSON.\n"
            "EN: Checks SOCKET_* nodes against spec JSON.",
            file=sys.stderr,
        )
        sys.exit(2)

    asset_id = args[0]
    reject_unsafe_asset_id(asset_id)
    spec = load_spec(asset_id)
    expected = spec.get("sockets")
    if not isinstance(expected, list) or not all(isinstance(s, str) for s in expected):
        print(
            "DE: Spec.sockets fehlt oder ist ungültig.\nEN: Spec.sockets missing or invalid.",
            file=sys.stderr,
        )
        sys.exit(1)

    path = glb_path(asset_id)
    if not path.is_file():
        print(
            f"DE: GLB fehlt: {path.relative_to(repo_root())}\n"
            f"EN: GLB missing: {path.relative_to(repo_root())}",
            file=sys.stderr,
        )
        sys.exit(1)

    bpy = _require_bpy()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(path))

    names = {obj.name for obj in bpy.data.objects}
    missing = [s for s in expected if s not in names]
    if missing:
        print(
            f"DE: Fehlende Sockets für {asset_id}: {', '.join(missing)}\n"
            f"EN: Missing sockets for {asset_id}: {', '.join(missing)}",
            file=sys.stderr,
        )
        sys.exit(1)

    print(
        f"asset:blender validate_sockets OK\n"
        f"DE: Alle {len(expected)} Spec-Sockets vorhanden.\n"
        f"EN: All {len(expected)} spec sockets present."
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
