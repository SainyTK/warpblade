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


def drawn(rgba: np.ndarray, alpha: int = OPAQUE) -> np.ndarray:
    return (rgba[..., 3] >= alpha) & (rgba[..., :3].max(axis=2) > BRIGHT)


def solid_box(rgba: np.ndarray) -> tuple[int, int, int, int]:
    solid = drawn(rgba)
    rows = np.nonzero(solid.sum(axis=1) > solid.shape[1] * SPECK)[0]
    cols = np.nonzero(solid.sum(axis=0) > solid.shape[0] * SPECK)[0]
    h, w = solid.shape
    return (
        max(0, int(cols.min()) - EDGE),
        max(0, int(rows.min()) - EDGE),
        min(w, int(cols.max()) + 1 + EDGE),
        min(h, int(rows.max()) + 1 + EDGE),
    )


def squared(image: Image.Image) -> Image.Image:
    rgba = np.array(image.convert("RGBA"))
    rgba[rgba[..., 3] < HALO] = 0
    x0, y0, x1, y1 = solid_box(rgba)
    side = max(x1 - x0, y1 - y0)
    out = np.zeros((side, side, 4), np.uint8)
    ox = (side - (x1 - x0)) // 2
    oy = (side - (y1 - y0)) // 2
    out[oy : oy + y1 - y0, ox : ox + x1 - x0] = rgba[y0:y1, x0:x1]
    return Image.fromarray(out)


def indexed(rgba: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    solid = rgba[..., 3] >= OPAQUE
    sample = Image.fromarray(np.ascontiguousarray(rgba[solid][None, :, :3]))
    palette_image = sample.quantize(COLOURS, Image.Quantize.MAXCOVERAGE)
    rgb = Image.fromarray(np.ascontiguousarray(rgba[..., :3]))
    index = np.array(rgb.quantize(palette=palette_image, dither=Image.Dither.NONE)).astype(np.int16)
    index[~solid] = -1
    palette = np.array(palette_image.getpalette()[: COLOURS * 3], np.uint8).reshape(-1, 3)
    return index, palette


def shrunk(image: Image.Image) -> np.ndarray:
    index, palette = indexed(np.array(image))
    ink = palette.astype(int) @ (299, 587, 114) < INK_LUMA * 1000
    edges = np.linspace(0, index.shape[0], INNER + 1).round().astype(int)
    out = np.zeros((INNER, INNER, 4), np.uint8)
    for y in range(INNER):
        for x in range(INNER):
            block = index[edges[y] : edges[y + 1], edges[x] : edges[x + 1]].ravel()
            solid = block[block >= 0]
            if solid.size * 2 < block.size:
                continue
            counts = np.bincount(solid, minlength=len(palette))
            inked = counts * ink
            pick = int(inked.argmax()) if inked.sum() >= solid.size * INK_SHARE else int(counts.argmax())
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
    return outlined(despeckled(shrunk(squared(image))))
