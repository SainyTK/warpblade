import type { Color, Ramp } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";
import type { ScenePalette } from "../sceneDef";

/** The storm's colors at its first wave (a grey drizzle) and its last (a dark downpour); waves between mix the two. */

type Flat = Omit<ScenePalette, "sky">;

const LIGHT: Flat = {
  starDim: hex("#3a4352"),
  starBright: hex("#717d8c"),
  ridgeTop: hex("#5c6676"),
  ridge: hex("#3c4452"),
  towerRim: hex("#505868"),
  towerTop: hex("#565e6c"),
  tower: hex("#2c323c"),
  windowLit: hex("#ffc46a"),
  windowLow: hex("#b07a3a"),
  windowDark: hex("#181c24"),
  groundLip: hex("#9eacbc"),
  groundEdge: hex("#56606e"),
  stone: hex("#2c323c"),
  stoneTop: hex("#3a424e"),
  mortar: hex("#1a1e26"),
  moss: hex("#3a5a46"),
  mossTip: hex("#5a8456"),
  vine: hex("#2a4436"),
  slabLip: hex("#a6b4c4"),
  slabEdge: hex("#5e6878"),
  slab: hex("#343c48"),
  slabUnder: hex("#14181f"),
  ironLip: hex("#7a6c5e"),
  iron: hex("#34312f"),
  ironEdge: hex("#12141a"),
  mist: hex("#9aa6b8"),
};

const DARK: Flat = {
  ...LIGHT,
  starDim: hex("#252c38"),
  starBright: hex("#4e5868"),
  ridgeTop: hex("#424b5a"),
  ridge: hex("#2a313c"),
  towerRim: hex("#3c4350"),
  towerTop: hex("#414856"),
  tower: hex("#1f242c"),
  groundLip: hex("#8e9cb0"),
  groundEdge: hex("#465060"),
  stone: hex("#232830"),
  stoneTop: hex("#2f3640"),
  mortar: hex("#14171e"),
  moss: hex("#2e4a3c"),
  mossTip: hex("#4a7050"),
  vine: hex("#22382e"),
  slabLip: hex("#96a6ba"),
  slabEdge: hex("#4e586a"),
  slab: hex("#2a303c"),
  slabUnder: hex("#101318"),
  mist: hex("#8a96aa"),
};

const SKY_LIGHT = ramp(["#384150", "#424c5c", "#4d5868", "#586474", "#647080", "#6f7b8a"]);
const SKY_DARK = ramp(["#20262f", "#282f3a", "#303844", "#39424f", "#434c5a", "#4c5664"]);

const mixRamp = (a: Ramp, b: Ramp, k: number): Ramp => a.map((c, i) => mix(c, b[i], k));

/** the stage palette at storm progress k */
export function rainPalette(k: number): ScenePalette {
  const out = { sky: mixRamp(SKY_LIGHT, SKY_DARK, k) } as ScenePalette;
  for (const key of Object.keys(LIGHT) as (keyof Flat)[])
    (out as unknown as Record<string, Color>)[key] = mix(LIGHT[key], DARK[key], k);
  return out;
}

/** the cloud banks from the heavy one overhead to the far, hazy one over the horizon, each from its belly to its lit rim */
export const CLOUD_LIGHT: readonly Ramp[] = [
  ramp(["#2c3440", "#363f4c", "#434c5b", "#566170", "#727e8e"]),
  ramp(["#3a4350", "#454f5d", "#525c6c", "#66717f", "#838f9e"]),
  ramp(["#4a5462", "#56606f", "#626e7e", "#75818f", "#909caa"]),
  ramp(["#5c6776", "#667282", "#748090", "#84909e", "#9aa6b2"]),
];
export const CLOUD_DARK: readonly Ramp[] = [
  ramp(["#161b23", "#1e242d", "#283039", "#364050", "#4e5a6c"]),
  ramp(["#1f252e", "#283039", "#333b48", "#434d5c", "#5c6878"]),
  ramp(["#2a313c", "#333b47", "#3f4856", "#4e5868", "#667282"]),
  ramp(["#353d4a", "#3f4856", "#4c5666", "#5a6474", "#6e7a8a"]),
];

export const RAIN_COLORS = {
  drop: hex("#b4c0d0"),
  dropFar: hex("#7e8a9c"),
  splash: hex("#c8d4e2"),
  puddle: hex("#2a3442"),
  puddleSky: hex("#4e5a6c"),
  puddleLip: hex("#b8c6d6"),
  sheen: hex("#d0dae6"),
  sunHaze: hex("#b4bcc6"),
  sunGlow: hex("#8a8e9a"),
  boltCore: hex("#f2eeff"),
  boltEdge: hex("#a89ce8"),
  boltGlow: hex("#7c74c8"),
  steam: hex("#8a8e98"),
};
