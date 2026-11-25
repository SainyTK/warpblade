import { GROUND, RES, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { PlatePaint } from "../../../scene/platePaint";
import { skyBandAt } from "../../../scene/terrain";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { CLOCK, clockAt } from "./clock";
import { FAR_WALL, farWallArt, hallAt } from "./farWall";
import { fbm } from "./noise";
import { ARCHIVE_PALETTE, SCENE } from "./palette";
import { insideWindow, shaftLight, WINDOWS } from "./windows";

const HAZE = { upper: 0.76, lower: 0.68, flood: 0.1, clock: 0.46 } as const;
const CAUSTIC = { depth: 64, most: 0.26 } as const;
const INK_CLOUD = { most: 0.55, scale: 26 } as const;

function caustic(x: number, y: number): number {
  const a = Math.sin(x * 0.19 + Math.sin(y * 0.23 + x * 0.05) * 2.2);
  const b = Math.sin(x * 0.11 - y * 0.31 + Math.sin(x * 0.07) * 1.7);
  const line = clamp(1 - Math.abs(a + b) * 2.4);
  const fade = clamp(1 - y / CAUSTIC.depth) ** 2;
  return line ** 5 * fade * (0.35 + (0.65 * x) / W) * CAUSTIC.most;
}

function windowAt(x: number, y: number): Color {
  for (const w of WINDOWS) {
    const v = insideWindow(w, x, y);
    if (v < 0) {
      const frame = insideWindow({ ...w, half: w.half + 1.5, top: w.top - 1.5, bottom: w.bottom + 1.5 }, x, y);
      if (frame >= 0) return SCENE.windowFrame;
      continue;
    }
    const mullion = Math.abs(x - w.x) < 0.5 || Math.abs(y - (w.top + 22)) < 0.5 || Math.abs(y - (w.top + 34)) < 0.5;
    if (mullion) return SCENE.windowFrame;
    return mix(SCENE.window, SCENE.shaftGlow, v * 0.7);
  }
  return 0;
}

function inkCloud(x: number, y: number, k: number): number {
  const n = fbm(x / INK_CLOUD.scale, y / (INK_CLOUD.scale * 0.6), 4);
  const reach = clamp(1 - y / 90) * clamp(1 - Math.abs(x - 150) / 170);
  return clamp((n - 0.52 + k * 0.06) * 4) * reach * INK_CLOUD.most;
}

export function paintVault(paint: PlatePaint, k: number): void {
  const wall = farWallArt(hallAt(k));
  const flood = HAZE.flood * k;
  for (let iy = 0; iy < GROUND * RES; iy++) {
    const y = (iy + 0.5) / RES;
    const ay = Math.floor(y);
    for (let ix = 0; ix < W * RES; ix++) {
      const x = (ix + 0.5) / RES;
      const th = bayerAt(ix, iy);
      let c = skyBandAt(y, th, ARCHIVE_PALETTE);
      const stone = wall[ay * W + Math.floor(x)];
      if (stone) {
        const haze = (ay < FAR_WALL.balcony + 3 ? HAZE.upper : HAZE.lower) + flood;
        c = mix(stone, SCENE.haze, haze);
      }
      const glass = windowAt(x, y);
      if (glass) c = glass;
      if (paint.bodies) {
        const face = Math.hypot(x - CLOCK.x, y - CLOCK.y) <= CLOCK.r ? clockAt(x, y) : 0;
        if (face) c = mix(face, SCENE.haze, HAZE.clock + flood);
      }
      const cloud = inkCloud(x, y, k);
      if (cloud > th * 0.9) c = mix(c, SCENE.ink[1], cloud);
      const ripple = caustic(x, y) * (1 + k * 0.5);
      if (ripple > 0.01) c = mix(c, ripple > 0.3 ? SCENE.causticHot : SCENE.caustic, ripple);
      const shaft = shaftLight(x, y);
      if (shaft > 0.01) c = mix(c, SCENE.shaft, shaft * (0.85 + 0.3 * th));
      paint.put(ix, iy, c);
    }
  }
}
