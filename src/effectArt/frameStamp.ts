import { FH, FW, RES } from "../constants/stage";
import { color, putImage, toScreenX, toScreenY } from "../engine/frame";
import { pickEffectFrame } from "./frameIndex";
import { effectPixels } from "./pixels";
import type { EffectDrawOptions, EffectSprite } from "./types";

const SOLID = 128;

function addLight(i: number, r: number, g: number, b: number, k: number): void {
  const under = color[i];
  const ur = Math.min(255, ((under >> 16) & 255) + r * k);
  const ug = Math.min(255, ((under >> 8) & 255) + g * k);
  const ub = Math.min(255, (under & 255) + b * k);
  color[i] = (ur << 16) | (ug << 8) | ub || 0x010101;
}

export function stampEffectSprite(
  sprite: EffectSprite,
  x: number,
  y: number,
  { frame = 0, scale = 1, rotation = 0, alpha = 1, blend = "normal", flip = false }: EffectDrawOptions = {},
): void {
  const pixels = effectPixels(sprite.image);
  if (!pixels || alpha <= 0 || scale <= 0) {
    return;
  }
  const [sx, sy, w, h] = pickEffectFrame(sprite, frame);
  const placedMirrored = toScreenX(1) < toScreenX(0);
  const mirror = placedMirrored !== flip ? -1 : 1;
  const cx = toScreenX(x) * RES;
  const cy = toScreenY(y) * RES;
  const turn = placedMirrored ? -rotation : rotation;
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  const reach = (Math.hypot(w, h) / 2) * scale;
  const x0 = Math.max(0, Math.floor(cx - reach));
  const x1 = Math.min(FW - 1, Math.ceil(cx + reach));
  const y0 = Math.max(0, Math.floor(cy - reach));
  const y1 = Math.min(FH - 1, Math.ceil(cy + reach));
  const { data, width } = pixels;
  for (let iy = y0; iy <= y1; iy++) {
    const dy = iy + 0.5 - cy;
    for (let ix = x0; ix <= x1; ix++) {
      const dx = ix + 0.5 - cx;
      const u = Math.floor(((dx * cos + dy * sin) / scale) * mirror + w / 2);
      const v = Math.floor((-dx * sin + dy * cos) / scale + h / 2);
      if (u < 0 || v < 0 || u >= w || v >= h) {
        continue;
      }
      const p = ((sy + v) * width + sx + u) * 4;
      const a = data[p + 3];
      if (a === 0) {
        continue;
      }
      if (blend === "additive") {
        addLight(iy * FW + ix, data[p], data[p + 1], data[p + 2], (a / 255) * alpha);
      } else if (a >= SOLID) {
        putImage(ix, iy, (data[p] << 16) | (data[p + 1] << 8) | data[p + 2] || 0x010101, alpha);
      }
    }
  }
}
