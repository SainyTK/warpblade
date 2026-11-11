import { TEAR_LOOK } from "../../../constants/orrin/chainLook";
import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { fleck, glow, hairline, putImage, toScreenX, toScreenY } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";

/** the measures of one kind of tear: half its height, half its width, and its light's radius and strength */
export interface TearSize {
  tall: number;
  wide: number;
  light: number;
  strength: number;
}

/**
 * A tear in the air at (x, y), `open` from 0 to 1: a tall ragged lens at image pixel detail, a dark indigo rim round
 * volt blue round a white seam, pointed at both ends, with a hair of light running on past each end and two sparks
 * drifting off them. `t` moves the ragged edge and the sparks. A `flat` tear lies on its side, a slit across the sky.
 */
export function drawTear(x: number, y: number, size: TearSize, open: number, t: number, flat = false): void {
  const V = PAL.volt;
  const tall = size.tall * open * RES;
  if (tall < 1) return;
  const ix = Math.floor(toScreenX(x) * RES);
  const iy = Math.floor(toScreenY(y) * RES);
  const beat = Math.floor(t * 14);
  glow(x, y, size.light, V[2], size.strength * open);
  for (let dy = -Math.ceil(tall); dy <= Math.ceil(tall); dy++) {
    const v = Math.abs(dy) / tall;
    if (v > 1) continue;
    const lens = size.wide * RES * (1 - v * v);
    const rough = 1 + (grain(dy, beat) - 0.5) * TEAR_LOOK.ragged * 2;
    const lean = (grain(dy >> 1, 7) - 0.5) * 2;
    const half = lens * rough;
    for (let dx = -Math.ceil(half) - 1; dx <= Math.ceil(half) + 1; dx++) {
      const d = Math.abs(dx - lean);
      if (d > half + 1) continue;
      const c = d > half ? V[0] : d > half * 0.6 ? V[1] : d > half * 0.28 ? V[2] : d > 0.6 ? V[4] : WHITE;
      if (flat) putImage(ix + dy, iy + dx, c);
      else putImage(ix + dx, iy + dy, c);
    }
  }
  const reach = size.tall * open;
  const far = reach + TEAR_LOOK.spark * open;
  const drift = (t * 6) % 3;
  if (flat) {
    hairline(x - reach, y, x - far, y, V[3], (u) => 1 - u);
    hairline(x + reach, y, x + far, y, V[3], (u) => 1 - u);
    fleck(x - reach - drift * 0.5, y + 2 + drift, V[4], 1 - drift / 3);
    fleck(x + reach + drift * 0.5, y - 2 - drift, V[3], 1 - drift / 3);
    return;
  }
  hairline(x, y - reach, x, y - far, V[3], (u) => 1 - u);
  hairline(x, y + reach, x, y + far, V[3], (u) => 1 - u);
  fleck(x + 2 + drift, y - reach - drift * 0.5, V[4], 1 - drift / 3);
  fleck(x - 2 - drift, y + reach + drift * 0.5, V[3], 1 - drift / 3);
}
