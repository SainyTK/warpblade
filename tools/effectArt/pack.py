import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SPELL_SLOTS = ("spell1", "spell2", "spell3", "infusion")
TIER_SLOTS = ("tier1", "tier2", "tier3", "tier4")
SPELL_SIZE = 48
INFUSION_SIZE = 64
TIER_SIZE = 96
FRAMES = 4
FPS = 12
KEY_NEAR = 70.0
KEY_FAR = 150.0
ALPHA_FLOOR = 24
PAD = 1
PALETTE = 256


def key_color(rgb: np.ndarray) -> np.ndarray:
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    return np.median(border, axis=0)


def cut_out(path: Path) -> np.ndarray:
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    key = key_color(rgb)
    distance = np.linalg.norm(rgb - key, axis=2)
    alpha = np.clip((distance - KEY_NEAR) / (KEY_FAR - KEY_NEAR), 0, 1)
    a = np.maximum(alpha, 1e-3)[:, :, None]
    rgb = np.clip((rgb - (1 - a) * key) / a, 0, 255)
    return np.dstack([despill(rgb, key, alpha), alpha * 255]).astype(np.float32)


def despill(rgb: np.ndarray, key: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    if key[1] > max(key[0], key[2]):
        edge = alpha < 1
        rgb[:, :, 1] = np.where(edge, np.minimum(g, np.maximum(r, b)), g)
        return rgb
    excess = np.maximum(np.minimum(r, b) - g, 0)
    rgb[:, :, 0] = r - excess
    rgb[:, :, 2] = b - excess
    return rgb


def split_points(mass: np.ndarray, parts: int) -> list[int]:
    size = len(mass)
    window = size // (parts * 3)
    points = [0]
    for i in range(1, parts):
        center = size * i // parts
        lo = max(points[-1] + 1, center - window)
        hi = min(size - 1, center + window)
        points.append(lo + int(np.argmin(mass[lo:hi])))
    points.append(size)
    return points


def trim(cell: np.ndarray) -> np.ndarray | None:
    solid = cell[:, :, 3] > ALPHA_FLOOR
    if not solid.any():
        return None
    ys = np.where(solid.any(axis=1))[0]
    xs = np.where(solid.any(axis=0))[0]
    return cell[ys[0] : ys[-1] + 1, xs[0] : xs[-1] + 1]


def grid(sheet: np.ndarray, rows: int, cols: int) -> list[list[np.ndarray]]:
    alpha = sheet[:, :, 3]
    ys = split_points(alpha.sum(axis=1), rows)
    out = []
    for r in range(rows):
        band = sheet[ys[r] : ys[r + 1]]
        xs = split_points(band[:, :, 3].sum(axis=0), cols)
        row = [trim(band[:, xs[c] : xs[c + 1]]) for c in range(cols)]
        out.append([cell for cell in row if cell is not None])
    return out


def premultiplied_resize(cell: np.ndarray, scale: float) -> np.ndarray:
    h, w = cell.shape[:2]
    size = (max(1, round(w * scale)), max(1, round(h * scale)))
    a = cell[:, :, 3:4] / 255
    channels = np.concatenate([cell[:, :, :3] * a, cell[:, :, 3:4]], axis=2)
    resized = [
        np.asarray(Image.fromarray(channels[:, :, c].astype(np.float32), mode="F").resize(size, Image.LANCZOS))
        for c in range(4)
    ]
    out = np.dstack(resized)
    alpha = np.clip(out[:, :, 3], 0, 255)
    safe = np.where(alpha > 0, alpha / 255, 1)
    rgb = np.clip(out[:, :, :3] / safe[:, :, None], 0, 255)
    alpha = np.where(alpha < ALPHA_FLOOR, 0, alpha)
    return np.dstack([rgb, alpha]).astype(np.uint8)


def frames_for(cells: list[np.ndarray], target: int) -> list[np.ndarray]:
    width = max(c.shape[1] for c in cells)
    height = max(c.shape[0] for c in cells)
    scale = target / max(width, height)
    frames = []
    for cell in cells:
        box = np.zeros((height, width, 4), np.float32)
        y = (height - cell.shape[0]) // 2
        x = (width - cell.shape[1]) // 2
        box[y : y + cell.shape[0], x : x + cell.shape[1]] = cell
        frames.append(premultiplied_resize(box, scale))
    return frames


def pack(out: Path) -> int:
    spells = grid(cut_out(out / "source-spells.webp"), 4, FRAMES)
    tiers = grid(cut_out(out / "source-tiers.webp"), 2, 2)
    slots: dict[str, list[np.ndarray]] = {}
    for slot, cells in zip(SPELL_SLOTS, spells, strict=True):
        slots[slot] = frames_for(cells, INFUSION_SIZE if slot == "infusion" else SPELL_SIZE)
    for slot, cell in zip(TIER_SLOTS, [c for row in tiers for c in row], strict=True):
        slots[slot] = frames_for([cell], TIER_SIZE)
    rows = [(slot, frames) for slot, frames in slots.items()]
    width = max(sum(f.shape[1] + PAD for f in frames) for _, frames in rows[:4])
    tier_width = sum(frames[0].shape[1] + PAD for _, frames in rows[4:])
    width = max(width, tier_width)
    placements: dict[str, dict] = {}
    y = 0
    atlas_rows = []
    for slot, frames in rows[:4]:
        x = 0
        rects = []
        for f in frames:
            rects.append([x, y, f.shape[1], f.shape[0]])
            atlas_rows.append((x, y, f))
            x += f.shape[1] + PAD
        placements[slot] = {"frames": rects, "fps": FPS}
        y += max(f.shape[0] for f in frames) + PAD
    x = 0
    for slot, frames in rows[4:]:
        f = frames[0]
        placements[slot] = {"frames": [[x, y, f.shape[1], f.shape[0]]], "fps": FPS}
        atlas_rows.append((x, y, f))
        x += f.shape[1] + PAD
    height = y + max(frames[0].shape[0] for _, frames in rows[4:])
    atlas = np.zeros((height, width, 4), np.uint8)
    for x0, y0, f in atlas_rows:
        atlas[y0 : y0 + f.shape[0], x0 : x0 + f.shape[1]] = f
    palette = Image.fromarray(atlas, "RGBA").quantize(
        PALETTE, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE
    )
    palette.save(out / "atlas.png", optimize=True)
    (out / "atlas.json").write_text(json.dumps({"slots": placements}, indent=2) + "\n")
    return (out / "atlas.png").stat().st_size


def main() -> None:
    assets = Path(sys.argv[1])
    total = 0
    for hero in sys.argv[2:]:
        size = pack(assets / hero)
        total += size
        print(f"{hero} {size}")
    print(f"total {total}")


if __name__ == "__main__":
    main()
