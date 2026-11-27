import json

import numpy as np
from PIL import Image

from constants import CELLS, ICON, OUT
from models import Icon
from pixelate import pixelate

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
