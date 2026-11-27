from pathlib import Path

from PIL import Image, ImageDraw

from constants import CELLS, ICON
from models import Icon
from pack import sprite_frames
from pixelate import pixelate

NIGHT = (12, 10, 24, 255)
DAY = (214, 196, 158, 255)
SPRITE_ZOOMS = (12, 3)
LABEL = (200, 196, 220, 255)
ZOOM = 4
PER_ROW = 8
TILE_W = ICON * ZOOM + ICON * 2 + ICON + 24
TILE_H = ICON * ZOOM + 22


def tile(icon: Icon) -> Image.Image:
    art = Image.fromarray(pixelate(Image.open(CELLS / f"{icon.id}.png")))
    out = Image.new("RGBA", (TILE_W, TILE_H), NIGHT)
    out.alpha_composite(art.resize((ICON * ZOOM, ICON * ZOOM), Image.NEAREST), (4, 4))
    out.alpha_composite(art.resize((ICON * 2, ICON * 2), Image.NEAREST), (ICON * ZOOM + 12, 4))
    out.alpha_composite(art, (ICON * ZOOM + 12, ICON * 2 + 12))
    ImageDraw.Draw(out).text((4, ICON * ZOOM + 8), f"{icon.id} {icon.element}", fill=LABEL)
    return out


def contact_sheet(icons: list[Icon], folder: Path) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    drawn = [icon for icon in icons if (CELLS / f"{icon.id}.png").exists()]
    for name in dict.fromkeys(icon.set for icon in drawn):
        group = [icon for icon in drawn if icon.set == name]
        rows = -(-len(group) // PER_ROW)
        sheet = Image.new("RGBA", (TILE_W * PER_ROW, TILE_H * rows), NIGHT)
        for i, icon in enumerate(group):
            y, x = divmod(i, PER_ROW)
            sheet.alpha_composite(tile(icon), (x * TILE_W, y * TILE_H))
        sheet.save(folder / f"{name}.png")
    small = Image.new("RGBA", (ICON * 2 * 20 + 40, (ICON * 2 + 4) * (-(-len(drawn) // 20))), NIGHT)
    for i, icon in enumerate(drawn):
        y, x = divmod(i, 20)
        art = Image.fromarray(pixelate(Image.open(CELLS / f"{icon.id}.png")))
        small.alpha_composite(art.resize((ICON * 2, ICON * 2), Image.NEAREST), (x * (ICON * 2 + 2), y * (ICON * 2 + 4)))
    small.save(folder / "all.png")
    print(folder)


def sprite_sheet(folder: Path) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    frames = sprite_frames()
    for zoom in SPRITE_ZOOMS:
        width = sum(frame.shape[1] * zoom + 8 for frame in frames.values()) + 8
        height = max(frame.shape[0] for frame in frames.values()) * zoom + 16
        sheet = Image.new("RGBA", (width, height * 2), NIGHT)
        sheet.paste(DAY, (0, 0, width, height))
        for row in range(2):
            x = 8
            for frame in frames.values():
                art = Image.fromarray(frame)
                art = art.resize((art.width * zoom, art.height * zoom), Image.NEAREST)
                sheet.alpha_composite(art, (x, row * height + 8))
                x += art.width + 8
        sheet.save(folder / f"sprites-x{zoom}.png")
    print(folder)
