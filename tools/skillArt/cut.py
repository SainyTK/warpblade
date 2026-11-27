import json
from pathlib import Path

import numpy as np
from PIL import Image

from constants import CELLS, SHEETS
from pixelate import drawn

SOLID = 200
MIN_GAP = 0.015
MIN_RUN = 0.04


def runs(profile: np.ndarray) -> list[tuple[int, int]]:
    length = len(profile)
    found: list[list[int]] = []
    for i in np.nonzero(profile)[0]:
        if found and i - found[-1][1] <= MIN_GAP * length:
            found[-1][1] = int(i)
        else:
            found.append([int(i), int(i)])
    return [(a, b + 1) for a, b in found if b + 1 - a >= MIN_RUN * length]


def bands(profile: np.ndarray, count: int) -> list[tuple[int, int]]:
    found = runs(profile)
    if len(found) != count:
        filled = np.nonzero(profile)[0]
        start, end = (int(filled.min()), int(filled.max()) + 1) if filled.size else (0, len(profile))
        step = (end - start) / count
        found = [(round(start + i * step), round(start + (i + 1) * step)) for i in range(count)]
    edges = [0] + [(a[1] + b[0]) // 2 for a, b in zip(found, found[1:], strict=False)] + [len(profile)]
    return list(zip(edges, edges[1:], strict=False))


def cut_sheet(sheet: Image.Image, ids: list[str], cols: int) -> None:
    CELLS.mkdir(parents=True, exist_ok=True)
    solid = drawn(np.array(sheet.convert("RGBA")), SOLID)
    rows = -(-len(ids) // cols)
    for r, (y0, y1) in enumerate(bands(solid.sum(axis=1) > 2, rows)):
        row_ids = ids[r * cols : (r + 1) * cols]
        band = solid[y0:y1]
        for c, (x0, x1) in enumerate(bands(band.sum(axis=0) > 2, len(row_ids))):
            sheet.crop((x0, y0, x1, y1)).save(CELLS / f"{row_ids[c]}.png")


def cut_record(record: Path) -> None:
    data = json.loads(record.read_text())
    cut_sheet(Image.open(record.with_suffix(".png")), data["ids"], data["cols"])


def recut() -> None:
    records = sorted(SHEETS.glob("*.json"))
    for record in records:
        cut_record(record)
    print(f"{len(records)} sheets cut")
