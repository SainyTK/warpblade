import numpy as np
from PIL import Image

from constants import COLOURS, ICON, INK, INNER, OPAQUE

HALO = 96
SPECK = 0.002
INK_LUMA = 48
INK_SHARE = 0.3
SPECK_PIXELS = 4
BRIGHT = 60
EDGE = 4
LIT_BAND = 24
LIT_LIFT = 12
RIM_SHADE = 45
SPRITE_INK_SHARE = 0.6


def drawn(rgba: np.ndarray, alpha: int = OPAQUE) -> np.ndarray:
    return (rgba[..., 3] >= alpha) & (rgba[..., :3].max(axis=2) > BRIGHT)


def solid_box(rgba: np.ndarray, with_ink: bool) -> tuple[int, int, int, int]:
    solid = rgba[..., 3] >= OPAQUE if with_ink else drawn(rgba)
    rows = np.nonzero(solid.sum(axis=1) > solid.shape[1] * SPECK)[0]
    cols = np.nonzero(solid.sum(axis=0) > solid.shape[0] * SPECK)[0]
    h, w = solid.shape
    return (
        max(0, int(cols.min()) - EDGE),
        max(0, int(rows.min()) - EDGE),
        min(w, int(cols.max()) + 1 + EDGE),
        min(h, int(rows.max()) + 1 + EDGE),
    )


def indexed(rgba: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    solid = rgba[..., 3] >= OPAQUE
    sample = Image.fromarray(np.ascontiguousarray(rgba[solid][None, :, :3]))
    palette_image = sample.quantize(COLOURS, Image.Quantize.MAXCOVERAGE)
    rgb = Image.fromarray(np.ascontiguousarray(rgba[..., :3]))
    index = np.array(rgb.quantize(palette=palette_image, dither=Image.Dither.NONE)).astype(np.int16)
    index[~solid] = -1
    palette = np.array(palette_image.getpalette()[: COLOURS * 3], np.uint8).reshape(-1, 3)
    return index, palette


def framed(image: Image.Image, w: int, h: int, with_ink: bool = False) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    rgba[rgba[..., 3] < HALO] = 0
    x0, y0, x1, y1 = solid_box(rgba, with_ink)
    scale = max((x1 - x0) / w, (y1 - y0) / h)
    width, height = round(w * scale), round(h * scale)
    out = np.zeros((height, width, 4), np.uint8)
    ox = (width - (x1 - x0)) // 2
    oy = (height - (y1 - y0)) // 2
    out[oy : oy + y1 - y0, ox : ox + x1 - x0] = rgba[y0:y1, x0:x1]
    return Image.fromarray(out)


def shrunk(image: Image.Image, w: int = INNER, h: int = INNER, ink_share: float = INK_SHARE) -> np.ndarray:
    colour_first = ink_share > INK_SHARE
    index, palette = indexed(np.array(image))
    ink = palette.astype(int) @ (299, 587, 114) < INK_LUMA * 1000
    rows = np.linspace(0, index.shape[0], h + 1).round().astype(int)
    cols = np.linspace(0, index.shape[1], w + 1).round().astype(int)
    out = np.zeros((h, w, 4), np.uint8)
    for y in range(h):
        for x in range(w):
            block = index[rows[y] : rows[y + 1], cols[x] : cols[x + 1]].ravel()
            solid = block[block >= 0]
            if solid.size * 2 < block.size:
                continue
            counts = np.bincount(solid, minlength=len(palette))
            inked = counts * ink
            pick = (
                int(inked.argmax())
                if inked.sum() >= solid.size * ink_share
                else int((counts * ~ink if colour_first else counts).argmax())
            )
            out[y, x] = (*palette[pick], 255)
    return out


def despeckled(rgba: np.ndarray) -> np.ndarray:
    solid = rgba[..., 3] > 0
    seen = np.zeros_like(solid)
    out = rgba.copy()
    h, w = solid.shape
    for sy, sx in zip(*np.nonzero(solid), strict=True):
        if seen[sy, sx]:
            continue
        seen[sy, sx] = True
        group = [(sy, sx)]
        for y, x in group:
            for ny in range(max(0, y - 1), min(h, y + 2)):
                for nx in range(max(0, x - 1), min(w, x + 2)):
                    if solid[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        group.append((ny, nx))
        if len(group) < SPECK_PIXELS:
            for y, x in group:
                out[y, x] = 0
    return out


def outlined(rgba: np.ndarray) -> np.ndarray:
    pad = (ICON - INNER) // 2
    framed = np.pad(rgba, ((pad, pad), (pad, pad), (0, 0)))
    solid = np.pad(framed[..., 3] > 0, 1)
    near = solid[:-2, 1:-1] | solid[2:, 1:-1] | solid[1:-1, :-2] | solid[1:-1, 2:]
    framed[near & ~solid[1:-1, 1:-1]] = INK
    return framed


def pixelate(image: Image.Image) -> np.ndarray:
    return outlined(despeckled(shrunk(framed(image, INNER, INNER))))


def lit(rgba: np.ndarray) -> np.ndarray:
    out = rgba.copy()
    rgb = out[..., :3].astype(int)
    luma = rgb @ (299, 587, 114) // 1000
    solid = out[..., 3] > 0
    top = solid & (luma >= luma[solid].max() - LIT_BAND)
    lifted = rgb + (255 - rgb) * LIT_LIFT // 100
    keep = luma < INK_LUMA
    out[..., :3] = np.where(keep[..., None], rgb, np.where(top[..., None], 255, lifted)).astype(np.uint8)
    return out


def shaded(rgba: np.ndarray) -> np.ndarray:
    out = rgba.copy()
    solid = np.pad(rgba[..., 3] > 0, 1)
    rim = solid[1:-1, 1:-1] & ~(solid[2:, 1:-1] & solid[1:-1, 2:])
    rgb = out[..., :3].astype(int)
    luma = rgb @ (299, 587, 114) // 1000
    dark = rim & (luma >= INK_LUMA)
    out[dark, :3] = (rgb[dark] * (100 - RIM_SHADE) // 100).astype(np.uint8)
    return out


def sprite(image: Image.Image, frame: tuple[int, int], size: tuple[int, int], bright: bool) -> np.ndarray:
    out = shaded(despeckled(shrunk(framed(image, *frame, with_ink=True), *size, SPRITE_INK_SHARE)))
    return lit(out) if bright else out
