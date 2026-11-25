import { FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { noise } from "../../../scene/eras/rain/noise";
import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, smooth } from "../../../utils/math";
import { GLACIER as G } from "../colors";
import { facetAt } from "./facets";
import { fallAt } from "./falls";
import { FOSSIL, fossilAt } from "./fossils";
import { auroraColor, dithered } from "./tone";
import { CRACKS, crackFoot, crackHalf, crackX, VAULT } from "./vault";

const WALL_RAMP = [G.cave[3], ...G.ice.slice(0, 5)];
const SHAFT = { lean: 0.42, width: 7, spread: 0.2, strength: 0.15, reach: 150 } as const;

function crackLight(x: number, y: number, k: number, ix: number, iy: number): Color {
  let near = Number.POSITIVE_INFINITY;
  let half = 1;
  for (const cx of CRACKS) {
    const d = Math.abs(x - crackX(cx, y));
    if (d < near) {
      near = d;
      half = crackHalf(cx, y);
    }
  }
  if (near > half + 0.6) return 0;
  if (near > half) return G.ice[6];
  const u = near / half;
  if (u < 0.3) return y < 6 ? G.glint : auroraColor(k, 2);
  return bayerAt(ix, iy) < 0.5 + u * 0.3 ? auroraColor(k, 1) : auroraColor(k);
}

function vault(x: number, y: number, depth: number, ix: number, k: number, iy: number): Color {
  const light = crackLight(x, y, k, ix, iy);
  if (light) return light;
  const right = VAULT[Math.min(FW - 1, ix + 2)];
  const left = VAULT[Math.max(0, ix - 2)];
  if (depth - y < 0.6) return G.ice[4];
  if (right < y) return y > depth - 3 ? G.ice[5] : G.ice[3];
  if (depth - y < 1.6) return G.ice[2];
  if (left < y) return G.cave[2];
  return dithered(G.cave, 0.1 + 0.3 * noise(x * 0.2, y * 0.25), ix, iy);
}

function shafts(x: number, y: number): number {
  let sum = 0;
  for (const cx of CRACKS) {
    const top = crackFoot(cx);
    const along = y - top;
    if (along <= 0 || along > SHAFT.reach) continue;
    const off = Math.abs(x - (cx - along * SHAFT.lean));
    const width = SHAFT.width + along * SHAFT.spread;
    if (off < width) sum += (1 - off / width) * (1 - along / SHAFT.reach);
  }
  return sum * SHAFT.strength;
}

function wall(x: number, y: number, depth: number, ix: number, iy: number, k: number, P: ScenePalette): Color {
  const f = facetAt(x, y * 0.7, 44);
  const streak = noise(x * 0.45, y * 0.014) - 0.5;
  const mass = noise(x * 0.014 + 3, y * 0.022);
  let t = 0.12 + (f.tone - 0.5) * 0.1 + streak * 0.22 + mass * 0.22 + (y / GROUND) * 0.16;
  t -= 0.22 * smooth(depth + 34, depth, y);
  let c = dithered(WALL_RAMP, t, ix, iy);
  if (f.edge < 0.45 && f.lit && mass > 0.35) c = mix(c, G.ice[4], 0.55);
  const part = fossilAt(x, y);
  if (part === FOSSIL.body) c = mix(c, G.fossil[noise(x * 0.4, y * 0.4) > 0.55 ? 1 : 0], 0.7);
  else if (part === FOSSIL.rim) c = mix(c, G.fossilBone, 0.5);
  else if (part === FOSSIL.socket) c = G.void;
  if (part !== FOSSIL.none && streak > 0.2) c = mix(c, G.ice[2], 0.3);
  const fall = y > depth - 3 ? fallAt(x, y) : -1;
  if (fall >= 0) c = dithered(G.ice, 0.3 + fall * 0.62, ix, iy);
  c = mix(c, auroraColor(k), clamp(shafts(x, y)));
  c = mix(c, P.sky[4], smooth(104, GROUND, y) * 0.4);
  if (grain(ix * 0.37, iy * 0.53) > 0.9985 && part === FOSSIL.none) c = G.ice[6];
  return c;
}

export function paintCave(paint: PlatePaint, k: number, P: ScenePalette): void {
  const rows = GROUND * RES;
  for (let iy = 0; iy < rows; iy++) {
    const y = (iy + 0.5) / RES;
    for (let ix = 0; ix < FW; ix++) {
      const x = (ix + 0.5) / RES;
      const depth = VAULT[ix];
      paint.plate[iy * FW + ix] = y < depth ? vault(x, y, depth, ix, k, iy) : wall(x, y, depth, ix, iy, k, P);
    }
  }
}
