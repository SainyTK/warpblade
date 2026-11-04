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

/** cloud banks from the far, hazy one near the horizon to the heavy one overhead: top edge, body, lit underside */
export const CLOUD_LIGHT: readonly (readonly [Color, Color, Color])[] = [
  [hex("#6c7888"), hex("#748090"), hex("#8894a2")],
  [hex("#5c6878"), hex("#626e7e"), hex("#7c8898")],
  [hex("#4c5666"), hex("#525c6c"), hex("#6e7a8a")],
  [hex("#3c4554"), hex("#434c5b"), hex("#5e6979")],
];
export const CLOUD_DARK: readonly (readonly [Color, Color, Color])[] = [
  [hex("#465060"), hex("#4c5666"), hex("#5e6878")],
  [hex("#3a4351"), hex("#3f4856"), hex("#545e6e")],
  [hex("#2e3642"), hex("#333b48"), hex("#4a5464")],
  [hex("#232a34"), hex("#283039"), hex("#3e4856")],
];

export const RAIN_COLORS = {
  drop: hex("#b4c0d0"),
  dropFar: hex("#7e8a9c"),
  splash: hex("#c8d4e2"),
  puddle: hex("#2a3442"),
  puddleSky: hex("#4e5a6c"),
  puddleLip: hex("#b8c6d6"),
  stain: hex("#20252d"),
  sheen: hex("#d0dae6"),
  sunHaze: hex("#b4bcc6"),
  sunGlow: hex("#8a8e9a"),
  boltCore: hex("#f2eeff"),
  boltEdge: hex("#a89ce8"),
  boltGlow: hex("#7c74c8"),
  steam: hex("#8a8e98"),
};
