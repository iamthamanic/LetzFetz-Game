"""
Normalize part GLB: origin, scale, axes; write back (or --out).
Location: tools/blender/normalize_part.py

Usage:
  blender -b -P tools/blender/normalize_part.py -- <asset-id> [--out path.glb]
"""
from __future__ import annotations

import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from common.paths import (  # noqa: E402
    argv_after_double_dash,
    glb_path,
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
            "DE: Nutzen: npm run asset:blender -- normalize_part <asset-id>\n"
            "EN: Use: npm run asset:blender -- normalize_part <asset-id>",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> None:
    args = argv_after_double_dash()
    if not args or args[0].startswith("-"):
        print(
            "Usage: blender -b -P tools/blender/normalize_part.py -- <asset-id> [--out path]\n"
            "DE: Setzt Origin, einheitliche Skala; exportiert GLB.\n"
            "EN: Resets origin, uniform scale; exports GLB.",
            file=sys.stderr,
        )
        sys.exit(2)

    asset_id = args[0]
    reject_unsafe_asset_id(asset_id)
    out: Path | None = None
    if "--out" in args:
        i = args.index("--out")
        if i + 1 >= len(args):
            print("DE: --out braucht einen Pfad.\nEN: --out requires a path.", file=sys.stderr)
            sys.exit(2)
        out = Path(args[i + 1])

    src = glb_path(asset_id)
    if not src.is_file():
        print(
            f"DE: GLB fehlt: {src.relative_to(repo_root())}\n"
            f"EN: GLB missing: {src.relative_to(repo_root())}",
            file=sys.stderr,
        )
        sys.exit(1)

    bpy = _require_bpy()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(src))

    # Select all mesh roots and apply transforms; keep EMPTY sockets.
    for obj in list(bpy.data.objects):
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        try:
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        except RuntimeError:
            pass
        obj.select_set(False)

    # Center geometry around world origin without moving socket relative layout:
    # move all objects so mesh bbox center is near origin.
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    if meshes:
        from mathutils import Vector  # type: ignore

        mins = Vector((1e9, 1e9, 1e9))
        maxs = Vector((-1e9, -1e9, -1e9))
        for obj in meshes:
            for corner in obj.bound_box:
                world = obj.matrix_world @ Vector(corner)
                mins = Vector((min(mins.x, world.x), min(mins.y, world.y), min(mins.z, world.z)))
                maxs = Vector((max(maxs.x, world.x), max(maxs.y, world.y), max(maxs.z, world.z)))
        center = (mins + maxs) * 0.5
        for obj in bpy.data.objects:
            obj.location -= center
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)
            try:
                bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)
            except RuntimeError:
                pass
            obj.select_set(False)

    dest = out if out is not None else src
    dest.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(dest), export_format="GLB")
    print(
        f"asset:blender normalize_part OK → {dest}\n"
        f"DE: GLB normalisiert (Rotation/Scale apply, Mesh-Zentrierung).\n"
        f"EN: GLB normalized (apply rot/scale, mesh centering)."
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
