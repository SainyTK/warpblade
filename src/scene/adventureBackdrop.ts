import { FN, FW, GROUND, RES } from "../constants/stage";
import { mix, scale } from "../utils/color";
import { grain } from "../utils/grain";
import type { ScenePalette } from "./eras/sceneDef";

const RUIN_PARALLAX = 0.42;
const FLOOR_ROW = GROUND * RES;
const RUIN_ROW = 111 * RES;
const CHUNK = 160 * RES;
const STRIP = CHUNK * 6;
const backdrop = new Uint32Array(FN);
const ruins = new Uint32Array((FLOOR_ROW - RUIN_ROW) * STRIP);
let lastPalette: ScenePalette | undefined;

function paintRuins(p: ScenePalette): void {
  lastPalette = p;
  ruins.fill(0);
  const horizon = p.sky[p.sky.length - 1];
  const body = mix(p.tower, horizon, 0.18);
  const rim = mix(p.towerRim, horizon, 0.42);
  const ridge = mix(p.ridge, p.tower, 0.38);
  for (let ix = 0; ix < STRIP; ix++) {
    const angle = (ix / STRIP) * 2 * Math.PI;
    const hill = Math.round((143 + 4 * Math.sin(angle * 6) + 4 * Math.sin(angle * 13)) * RES);
    const part = Math.floor(ix / CHUNK);
    const width = Math.round((20 + 14 * grain(part, 23)) * RES);
    const u = (ix % CHUNK) - Math.round((23 + 59 * grain(part, 7)) * RES);
    const tower = u >= 0 && u < width;
    const crown = Math.round((115 + 20 * grain(part, 15) + 4 * grain(u >> 3, part)) * RES);
    const arch = (u - width * 0.52) / (width * 0.19);
    for (let iy = tower ? Math.min(crown, hill) : hill; iy < FLOOR_ROW; iy++) {
      let c = iy === hill ? mix(ridge, rim, 0.23) : ridge;
      const opening = arch * arch + ((iy - crown - 27) / 13) ** 2 < 1 && iy < hill;
      if (tower && iy >= crown && !opening) {
        c = u >= width - 2 || iy === crown ? rim : body;
        if ((iy + part * 3) % (6 * RES) === 0) c = scale(c, 0.89);
      } else if (iy < hill) {
        continue;
      }
      ruins[(iy - RUIN_ROW) * STRIP + ix] = scale(c, 0.92 + grain(ix >> 1, iy >> 1) * 0.14);
    }
  }
}

export function adventureBackdrop(base: Uint32Array, cameraX: number, palette: ScenePalette): Uint32Array {
  if (lastPalette !== palette) paintRuins(palette);
  backdrop.set(base);
  const near = Math.round(cameraX * RES);
  const parallax = Math.round(near * RUIN_PARALLAX);
  const ruinShift = ((parallax % STRIP) + STRIP) % STRIP;
  for (let iy = RUIN_ROW; iy < FLOOR_ROW; iy++) {
    const row = iy * FW;
    const layer = (iy - RUIN_ROW) * STRIP;
    for (let x = 0, rx = ruinShift; x < FW; x++) {
      const c = ruins[layer + rx];
      if (c) backdrop[row + x] = c;
      rx++;
      if (rx === STRIP) rx = 0;
    }
  }
  const tile = ((near % FW) + FW) % FW;
  for (let row = FLOOR_ROW * FW; row < FN; row += FW) {
    backdrop.set(base.subarray(row + tile, row + FW), row);
    backdrop.set(base.subarray(row, row + tile), row + FW - tile);
  }
  return backdrop;
}
