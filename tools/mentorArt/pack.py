import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / "src/mentorArt/assets"
HALO = 100
OPAQUE = 128
FEET_ROWS = 4
PORTRAIT_SIZE = 672
PORTRAIT_SOLID = 250
INK = (26, 23, 37, 255)


def cleaned(path: Path, solid: int = HALO) -> Image.Image:
    rgba = np.array(Image.open(path).convert("RGBA"))
    rgba[rgba[..., 3] < HALO] = 0
    rgba[rgba[..., 3] >= solid, 3] = 255
    return Image.fromarray(rgba)


def swung(image: Image.Image, box: list[int], degrees: float) -> Image.Image:
    if not degrees:
        return image
    x0, y0, x1, y1 = box
    lantern = image.crop(box)
    hole = Image.new("RGBA", lantern.size)
    out = image.copy()
    out.paste(hole, (x0, y0))
    turned = lantern.rotate(degrees, resample=Image.BICUBIC, center=((x1 - x0) / 2, 0))
    out.alpha_composite(turned, (x0, y0))
    return out


def shrunk(image: Image.Image, top: int, bottom: int, height: int) -> tuple[np.ndarray, float]:
    scale = height / (bottom - top + 1)
    size = (round(image.width * scale), round(image.height * scale))
    rgba = np.array(image.convert("RGBa").resize(size, Image.BOX).convert("RGBA"))
    rgba[rgba[..., 3] < OPAQUE] = 0
    rgba[rgba[..., 3] >= OPAQUE, 3] = 255
    return rgba, scale


def breathed(rgba: np.ndarray, waist: int, lift: int) -> np.ndarray:
    if not lift:
        return rgba
    out = rgba.copy()
    out[: waist - lift] = rgba[lift:waist]
    return out


def outlined(rgba: np.ndarray) -> np.ndarray:
    solid = np.pad(rgba[..., 3] > 0, 1)
    near = solid[:-2, 1:-1] | solid[2:, 1:-1] | solid[1:-1, :-2] | solid[1:-1, 2:]
    out = rgba.copy()
    out[near & ~solid[1:-1, 1:-1]] = INK
    return out


def opaque_box(rgba: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.nonzero(rgba[..., 3])
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def feet_x(rgba: np.ndarray) -> float:
    bottom = opaque_box(rgba)[3]
    _, xs = np.nonzero(rgba[bottom - FEET_ROWS + 1 : bottom + 1, :, 3])
    return (xs.min() + xs.max()) / 2


def pose_frames(spec: dict, clip: dict, height: int) -> tuple[list[np.ndarray], list[int]]:
    source = cleaned(HERE / "raw" / spec["source"])
    _, top, _, bottom = opaque_box(np.array(source))
    frames = []
    scale = 1.0
    for lift, degrees in zip(clip["breath"], clip["swing"], strict=True):
        rgba, scale = shrunk(swung(source, spec["lantern"], degrees), top, bottom, height)
        padded = np.pad(rgba, ((1, 1), (1, 1), (0, 0)))
        frames.append(outlined(breathed(padded, round(spec["waist"] * scale) + 1, lift)))
    x, y = spec["crystal"]
    rest = frames[0]
    crystal = [round(x * scale + 1 - feet_x(rest)), round(y * scale + 1) - opaque_box(rest)[3]]
    return frames, crystal


def anchored(frame: np.ndarray, size: tuple[int, int], origin: tuple[int, int]) -> np.ndarray:
    x0, _, _, bottom = opaque_box(frame)
    dx = origin[0] - round(feet_x(frame))
    dy = origin[1] - bottom
    cell = np.zeros((size[1], size[0], 4), np.uint8)
    ys, xs = np.nonzero(frame[..., 3])
    cell[ys + dy, xs + dx] = frame[ys, xs]
    return cell


def pack(spec: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    made = {name: pose_frames(spec["poses"][name], spec["clips"][name], spec["height"]) for name in spec["clips"]}
    poses = {name: frames for name, (frames, _) in made.items()}
    every = [frame for frames in poses.values() for frame in frames]
    pad = spec["pad"]
    left = max(round(feet_x(f)) - opaque_box(f)[0] for f in every) + pad
    right = max(opaque_box(f)[2] - round(feet_x(f)) for f in every) + pad
    above = max(opaque_box(f)[3] - opaque_box(f)[1] for f in every) + pad
    size = (left + right + 1, above + pad + 1)
    origin = (left, above)
    cells: list[np.ndarray] = []
    clips = {}
    for name, frames in poses.items():
        order = []
        for frame in frames:
            cell = anchored(frame, size, origin)
            found = next((i for i, c in enumerate(cells) if np.array_equal(c, cell)), None)
            if found is None:
                cells.append(cell)
                found = len(cells) - 1
            order.append(found)
        clips[name] = {"frames": order, "fps": spec["clips"][name]["fps"], "loop": True}
    atlas = np.concatenate(cells, axis=1)
    Image.fromarray(atlas).save(OUT / "atlas.webp", lossless=True, exact=True)
    sheet = {
        "imagePixelsPerArtPixel": spec["imagePixelsPerArtPixel"],
        "frames": [[i * size[0], 0, size[0], size[1], origin[0], origin[1]] for i in range(len(cells))],
        "clips": clips,
        "crystals": {name: crystal for name, (_, crystal) in made.items()},
    }
    (OUT / "sheet.json").write_text(json.dumps(sheet) + "\n")
    portrait = cleaned(HERE / "raw" / spec["portrait"], PORTRAIT_SOLID)
    portrait = portrait.resize((PORTRAIT_SIZE, PORTRAIT_SIZE), Image.LANCZOS)
    portrait.save(OUT / "portrait.webp", quality=90, alpha_quality=100, method=6)
    print(f"{len(cells)} frames of {size[0]}x{size[1]}, origin {origin}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Pack the mentor atlas, sheet and portrait")
    parser.add_argument("--map", type=Path, default=HERE / "map.json")
    args = parser.parse_args()
    pack(json.loads(args.map.read_text()))


if __name__ == "__main__":
    main()
