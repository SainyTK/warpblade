import json
import time
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path

from PIL import Image

from constants import CELLS, HEROES, PORTRAIT_OF, RAW, SHEETS
from cut import cut_sheet
from images import draw
from models import Icon
from prompts import sheet_prompt

STYLE_SHEET = RAW / "style.png"
LAYOUTS = [(1, 1, 1, "1024x1024"), (4, 2, 2, "1024x1024"), (16, 4, 4, "1024x1024"), (24, 4, 6, "1024x1536")]
MAX_SHEET = LAYOUTS[-1][0]


def layout(count: int) -> tuple[int, int, str]:
    for most, cols, rows, size in LAYOUTS:
        if count <= most:
            return cols, rows, size
    raise ValueError(f"A sheet holds at most {MAX_SHEET} icons")


def batches(icons: list[Icon]) -> list[list[Icon]]:
    out: list[list[Icon]] = []
    for name in dict.fromkeys(icon.set for icon in icons):
        group = [icon for icon in icons if icon.set == name]
        while group:
            size = next((most for most, *_ in LAYOUTS if most >= len(group)), MAX_SHEET)
            out.append(group[:size])
            group = group[size:]
    return out


def references(icons: list[Icon]) -> list[Path]:
    refs = [HEROES / PORTRAIT_OF[s] / "portrait.webp" for s in dict.fromkeys(i.set for i in icons) if s in PORTRAIT_OF]
    if STYLE_SHEET.exists():
        refs.append(STYLE_SHEET)
    return refs


def make_sheet(icons: list[Icon], every: dict[str, Icon], model: str) -> Path:
    cols, rows, size = layout(len(icons))
    refs = references(icons)
    prompt = sheet_prompt(icons, every, cols, rows, STYLE_SHEET.exists())
    png = draw(prompt, refs, size, model)
    SHEETS.mkdir(parents=True, exist_ok=True)
    stem = f"{time.strftime('%Y%m%d-%H%M%S')}-{icons[0].set}-{icons[0].id}"
    path = SHEETS / f"{stem}.png"
    path.write_bytes(png)
    record = {"ids": [i.id for i in icons], "cols": cols, "rows": rows, "model": model, "prompt": prompt}
    (SHEETS / f"{stem}.json").write_text(json.dumps(record, indent=2) + "\n")
    cut_sheet(Image.open(BytesIO(png)), record["ids"], cols)
    return path


def generate(icons: list[Icon], every: dict[str, Icon], model: str, workers: int) -> None:
    plan = batches(icons)
    print(f"{len(icons)} icons in {len(plan)} sheets")
    with ThreadPoolExecutor(max_workers=workers) as pool:
        jobs = [pool.submit(make_sheet, batch, every, model) for batch in plan]
        for job in jobs:
            try:
                print(job.result())
            except Exception as error:
                print(f"failed: {error}")


def missing(icons: list[Icon]) -> list[Icon]:
    return [icon for icon in icons if not (CELLS / f"{icon.id}.png").exists()]
