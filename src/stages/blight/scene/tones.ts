import type { Color } from "../../../types/color";
import { hex, mix } from "../../../utils/color";

export interface SceneTones {
  shaft: Color;
  canopy: Color;
  canopyRim: Color;
  trunkFar: Color;
  trunkNear: Color;
  trunkRim: Color;
  glowA: Color;
  glowB: Color;
  loam: Color;
  loamDeep: Color;
  root: Color;
  rootLit: Color;
}

type Source = Record<keyof SceneTones, string>;

const TUNNEL: Source = {
  shaft: "#c8d88a",
  canopy: "#0a050c",
  canopyRim: "#3a2c3a",
  trunkFar: "#2e2230",
  trunkNear: "#1e141f",
  trunkRim: "#5a4858",
  glowA: "#4ec0ac",
  glowB: "#c6e05a",
  loam: "#2a1c24",
  loamDeep: "#140c12",
  root: "#3e2a36",
  rootLit: "#6a5058",
};

const MARSH: Source = {
  ...TUNNEL,
  shaft: "#d0ec7a",
  trunkFar: "#262a22",
  trunkNear: "#171914",
  trunkRim: "#56604a",
  loam: "#222419",
  loamDeep: "#101109",
  root: "#3a3428",
  rootLit: "#64604a",
};

const HEART: Source = {
  ...TUNNEL,
  shaft: "#d8c0a0",
  canopy: "#0a0508",
  canopyRim: "#3e2430",
  trunkFar: "#2e2026",
  trunkNear: "#1c1216",
  trunkRim: "#604250",
  glowA: "#de7ea0",
  glowB: "#c6e05a",
  loam: "#2c1820",
  loamDeep: "#14080e",
  root: "#4a2838",
  rootLit: "#7a4a5c",
};

const KEYS = [TUNNEL, MARSH, HEART] as const;
const memo = new Map<number, SceneTones>();

export function sceneTones(k: number): SceneTones {
  const hit = memo.get(k);
  if (hit) return hit;
  const at = Math.min(1.999, k * 2);
  const i = Math.floor(at);
  const u = at - i;
  const out = {} as Record<keyof SceneTones, Color>;
  for (const key of Object.keys(TUNNEL) as (keyof SceneTones)[])
    out[key] = mix(hex(KEYS[i][key]), hex(KEYS[i + 1][key]), u);
  memo.set(k, out);
  return out;
}
