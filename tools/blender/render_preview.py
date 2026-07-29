"""
Render a fixed-camera preview PNG for a part into public/cards/engine/.
Location: tools/blender/render_preview.py

Usage:
  blender -b -P tools/blender/render_preview.py -- <asset-id> [--force]

Default: skip write if PNG already exists unless --force.
MVP trio example: v3-part-water-traeger-01
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
    preview_png_path,
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
            "DE: Nutzen: npm run asset:blender -- render_preview <asset-id>\n"
            "EN: Use: npm run asset:blender -- render_preview <asset-id>",
            file=sys.stderr,
        )
        sys.exit(1)


def main() -> None:
    args = argv_after_double_dash()
    if not args or args[0].startswith("-"):
        print(
            "Usage: blender -b -P tools/blender/render_preview.py -- <asset-id> [--force]\n"
            "DE: Feste Kamera/Licht → public/cards/engine/<id>.png\n"
            "EN: Fixed camera/light → public/cards/engine/<id>.png\n"
            "DE: Beispiel MVP-Trio: v3-part-water-traeger-01\n"
            "EN: MVP trio example: v3-part-water-traeger-01",
            file=sys.stderr,
        )
        sys.exit(2)

    asset_id = args[0]
    reject_unsafe_asset_id(asset_id)
    force = "--force" in args

    src = glb_path(asset_id)
    if not src.is_file():
        print(
            f"DE: GLB fehlt: {src.relative_to(repo_root())}\n"
            f"EN: GLB missing: {src.relative_to(repo_root())}",
            file=sys.stderr,
        )
        sys.exit(1)

    out = preview_png_path(asset_id)
    if out.is_file() and not force:
        print(
            f"asset:blender render_preview SKIP (exists) → {out.relative_to(repo_root())}\n"
            f"DE: PNG vorhanden — mit --force überschreiben.\n"
            f"EN: PNG exists — pass --force to overwrite."
        )
        sys.exit(0)

    bpy = _require_bpy()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(src))

    # Camera
    cam_data = bpy.data.cameras.new("PreviewCam")
    cam_obj = bpy.data.objects.new("PreviewCam", cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)
    cam_obj.location = (2.2, -2.2, 1.6)
    cam_obj.rotation_euler = (1.1, 0.0, 0.85)
    bpy.context.scene.camera = cam_obj

    # Lights
    light_data = bpy.data.lights.new(name="Key", type="SUN")
    light_data.energy = 3.0
    light_obj = bpy.data.objects.new(name="Key", object_data=light_data)
    bpy.context.scene.collection.objects.link(light_obj)
    light_obj.rotation_euler = (0.6, 0.2, 0.3)

    fill_data = bpy.data.lights.new(name="Fill", type="AREA")
    fill_data.energy = 50.0
    fill_obj = bpy.data.objects.new(name="Fill", object_data=fill_data)
    bpy.context.scene.collection.objects.link(fill_obj)
    fill_obj.location = (-1.5, 1.0, 1.2)

    scene = bpy.context.scene
    # Prefer Eevee Next (Blender 4.2+); fall back to classic Eevee.
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            scene.render.engine = engine
            break
        except Exception:
            continue
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.film_transparent = True
    scene.render.filepath = str(out)

    out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.render.render(write_still=True)
    print(
        f"asset:blender render_preview OK → {out.relative_to(repo_root())}\n"
        f"DE: Preview geschrieben (512², feste Kamera).\n"
        f"EN: Preview written (512², fixed camera)."
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
