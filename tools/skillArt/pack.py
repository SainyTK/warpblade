import json

import numpy as np
from PIL import Image

from constants import CELLS, FRAMES, ICON, OUT, SPRITE_SIZES
from models import Icon
from pixelate import pixelate, sprite

ATLAS_COLUMNS = 16


def pack(icons: list[Icon]) -> None:
    drawn = [icon for icon in icons if (CELLS / f"{icon.id}.png").exists()]
    rows = -(-len(drawn) // ATLAS_COLUMNS)
    atlas = np.zeros((rows * ICON, ATLAS_COLUMNS * ICON, 4), np.uint8)
    for i, icon in enumerate(drawn):
        y, x = divmod(i, ATLAS_COLUMNS)
        atlas[y * ICON : (y + 1) * ICON, x * ICON : (x + 1) * ICON] = pixelate(Image.open(CELLS / f"{icon.id}.png"))
    OUT.mkdir(parents=True, exist_ok=True)
    Image.fromarray(atlas).save(OUT / "atlas.webp", lossless=True, exact=True)
    sheet = {"size": ICON, "columns": ATLAS_COLUMNS, "icons": [icon.id for icon in drawn]}
    (OUT / "sheet.json").write_text(json.dumps(sheet, indent=2) + "\n")
    print(f"{len(drawn)} of {len(icons)} icons packed")


def sprite_frames() -> dict[str, np.ndarray]:
    sizes = {name: (size["w"], size["h"]) for name, size in json.loads(SPRITE_SIZES.read_text()).items()}
    return {
        frame: sprite(Image.open(CELLS / f"{cell}.png"), sizes[shape], sizes[size], bright)
        for frame, (cell, shape, size, bright) in FRAMES.items()
        if (CELLS / f"{cell}.png").exists()
    }


def pack_sprites() -> None:
    frames = sprite_frames()
    width = sum(frame.shape[1] for frame in frames.values())
    height = max((frame.shape[0] for frame in frames.values()), default=0)
    atlas = np.zeros((height, width, 4), np.uint8)
    rects: dict[str, list[int]] = {}
    x = 0
    for name, frame in frames.items():
        h, w = frame.shape[:2]
        atlas[:h, x : x + w] = frame
        rects[name] = [x, 0, w, h]
        x += w
    Image.fromarray(atlas).save(OUT / "sprites.webp", lossless=True, exact=True)
    (OUT / "sprites.json").write_text(json.dumps({"sprites": rects}, indent=2) + "\n")
    print(f"{len(frames)} of {len(FRAMES)} sprite frames packed")
