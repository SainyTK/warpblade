import numpy as np
from PIL import Image

from constants import CELLS
from models import Icon
from pixelate import pixelate

HUES = {
    "blaze": [(345, 360), (0, 38)],
    "storm": [(40, 68)],
    "venom": [(70, 160)],
    "frost": [(170, 232)],
    "void": [(240, 320)],
}
VIVID = 0.35
LEAST = 0.3


def hues(icon: Icon) -> np.ndarray:
    rgba = pixelate(Image.open(CELLS / f"{icon.id}.png")).reshape(-1, 4)
    hsv = np.array(Image.fromarray(rgba[None, rgba[:, 3] > 0, :3]).convert("HSV"))[0] / 255
    vivid = hsv[(hsv[:, 1] > VIVID) & (hsv[:, 2] > VIVID)]
    return vivid[:, 0] * 360


def shares(degrees: np.ndarray) -> dict[str, float]:
    total = max(1, len(degrees))
    return {e: sum(int(((degrees >= a) & (degrees < b)).sum()) for a, b in r) / total for e, r in HUES.items()}


def off_element(icons: list[Icon]) -> list[str]:
    flagged = []
    for icon in icons:
        if icon.element not in HUES or not (CELLS / f"{icon.id}.png").exists():
            continue
        share = shares(hues(icon))
        top = max(share, key=share.__getitem__)
        if share[icon.element] < LEAST or top != icon.element:
            flagged.append(icon.id)
            print(f"{icon.id:24} {icon.element:6} own {share[icon.element]:.2f}, mostly {top} {share[top]:.2f}")
    print(f"{len(flagged)} icons off their element")
    print(" ".join(flagged))
    return flagged
