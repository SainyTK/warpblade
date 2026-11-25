import { FH, FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { BLIGHT } from "../colors";
import type { SceneTones } from "./tones";

const FLOOR = GROUND * RES;
const wave = (ix: number, cycles: number, phase: number): number => Math.sin((ix / FW) * TAU * cycles + phase);

const ROOTS: readonly (readonly [number, number, number, number])[] = [
  [5, 3, 0.4, 2.2],
  [11, 5, 2.1, 1.6],
  [17, 2, 4.2, 2.6],
  [21, 7, 1.1, 1.4],
];

const BONES: readonly (readonly [number, number, "skull" | "bone"])[] = [
  [90, 12, "skull"],
  [250, 18, "bone"],
  [400, 10, "bone"],
  [520, 16, "skull"],
  [600, 21, "bone"],
];

const wrap = (ix: number): number => ((ix % FW) + FW) % FW;

function soil(ix: number, iy: number, P: ScenePalette, T: SceneTones): Color {
  const row = (iy - FLOOR) / RES;
  const lipLine = 1.2 + wave(ix, 23, 0.4) * 0.4 + (grain(ix >> 1, 3) - 0.5) * 0.8;
  if (row < lipLine - 0.6) return grain(ix, 11) > 0.6 ? P.mossTip : P.groundLip;
  if (row < lipLine + 0.5) return P.groundEdge;
  if (row < lipLine + 1.4) return grain(ix >> 1, 13) > 0.5 ? P.moss : T.root;
  for (const [y, cycles, phase, thick] of ROOTS) {
    const centre = y + wave(ix, cycles, phase) * 1.6 + wave(ix, cycles * 3, phase * 2) * 0.5;
    const d = row - centre;
    if (Math.abs(d) < thick / 2)
      return d < -thick / 2 + 0.6 ? T.rootLit : d > thick / 2 - 0.6 ? scale(T.root, 0.7) : T.root;
  }
  const depth = Math.min(1, row / 24);
  const base = mix(T.loam, T.loamDeep, Math.floor(depth * 4 + bayerAt(ix, iy) * 0.9) / 4);
  const speck = grain(ix >> 1, iy >> 1);
  if (speck > 0.94) return mix(base, P.stoneTop, 0.6);
  if (speck < 0.04) return scale(base, 0.7);
  return base;
}

function boneAt(paint: PlatePaint, x: number, row: number, kind: "skull" | "bone"): void {
  const iy0 = FLOOR + row * RES;
  const B = BLIGHT.bone;
  if (kind === "skull") {
    for (let dy = -5; dy <= 5; dy++)
      for (let dx = -6; dx <= 6; dx++) {
        const r = (dx / 6) ** 2 + (dy / 5) ** 2;
        if (r > 1) continue;
        const c = r > 0.75 ? B[0] : dy < -2 ? B[3] : B[2];
        paint.put(wrap(x + dx), iy0 + dy, c);
      }
    for (const [ex, ey] of [
      [-2, 0],
      [2, 0],
    ])
      for (let k = 0; k < 4; k++) paint.put(wrap(x + ex * 1.2 + (k % 2) - 1), iy0 + ey + (k >> 1), BLIGHT.outline);
    for (let dx = -3; dx <= 3; dx += 2) paint.put(wrap(x + dx), iy0 + 4, B[0]);
    return;
  }
  for (let dx = -8; dx <= 8; dx++) {
    const knob = Math.abs(dx) > 6;
    paint.put(wrap(x + dx), iy0, B[2]);
    paint.put(wrap(x + dx), iy0 - 1, knob ? B[3] : B[2]);
    if (knob) paint.put(wrap(x + dx), iy0 + 1, B[1]);
  }
}

function fungusSpecks(paint: PlatePaint, T: SceneTones): void {
  for (let i = 0; i < 14; i++) {
    const ix = Math.floor(grain(i, 21) * FW);
    const iy = FLOOR + 6 + Math.floor(grain(i, 23) * 36);
    const c = i % 3 ? T.glowA : BLIGHT.sap[2];
    paint.put(ix, iy, c);
    paint.put(wrap(ix + 1), iy, scale(c, 0.7));
  }
}

export function paintFloor(paint: PlatePaint, P: ScenePalette, T: SceneTones): void {
  for (let iy = FLOOR; iy < FH; iy++) for (let ix = 0; ix < FW; ix++) paint.put(ix, iy, soil(ix, iy, P, T));
  for (const [x, row, kind] of BONES) boneAt(paint, x, row, kind);
  fungusSpecks(paint, T);
}
