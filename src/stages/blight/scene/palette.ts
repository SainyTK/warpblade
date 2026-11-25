import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { Color } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";

type Source = Record<keyof ScenePalette, string | readonly string[]>;

const TUNNEL: Source = {
  sky: ["#0b0611", "#120a18", "#1a1020", "#231828", "#2b222e", "#322d30"],
  starDim: "#2b222e",
  starBright: "#4a4048",
  ridgeTop: "#2e2a2a",
  ridge: "#1a121c",
  towerRim: "#4c3c46",
  towerTop: "#36283a",
  tower: "#20141f",
  windowLit: "#20141f",
  windowLow: "#20141f",
  windowDark: "#20141f",
  groundLip: "#7c9c3e",
  groundEdge: "#44562a",
  stone: "#2a1c24",
  stoneTop: "#34242c",
  mortar: "#150c12",
  moss: "#3e5a22",
  mossTip: "#86a83a",
  vine: "#2a3a1a",
  slabLip: "#92b048",
  slabEdge: "#4f6428",
  slab: "#4a3240",
  slabUnder: "#1a0f18",
  ironLip: "#5e4650",
  iron: "#3e2a36",
  ironEdge: "#170d16",
  mist: "#9ab86a",
};

const MARSH: Source = {
  ...TUNNEL,
  sky: ["#0a0a10", "#111218", "#191c1e", "#222822", "#2c3626", "#36422a"],
  ridgeTop: "#323a28",
  ridge: "#181a16",
  towerRim: "#4a5240",
  towerTop: "#30342a",
  tower: "#1a1c18",
  groundLip: "#8aac42",
  groundEdge: "#48602a",
  stone: "#232620",
  stoneTop: "#2c3026",
  mortar: "#121410",
  slab: "#3e3438",
  mist: "#b0d070",
};

const HEART: Source = {
  ...TUNNEL,
  sky: ["#0b060b", "#130b12", "#1c1119", "#251820", "#2e2026", "#36282a"],
  ridgeTop: "#34242a",
  ridge: "#1a1016",
  towerRim: "#4e3640",
  towerTop: "#34242c",
  tower: "#1e1218",
  groundLip: "#8aa046",
  groundEdge: "#4c4a2a",
  stone: "#2c1820",
  stoneTop: "#381f2a",
  mortar: "#160a10",
  slab: "#4e2c3c",
  slabUnder: "#1c0c16",
  mist: "#c890b0",
};

const KEYS = [TUNNEL, MARSH, HEART] as const;

const asColors = (v: string | readonly string[]): Color | readonly Color[] =>
  typeof v === "string" ? hex(v) : ramp(v as string[]);

const memo = new Map<number, ScenePalette>();

export function blightPalette(k: number): ScenePalette {
  const hit = memo.get(k);
  if (hit) return hit;
  const at = Math.min(1.999, k * 2);
  const i = Math.floor(at);
  const u = at - i;
  const out = {} as Record<string, Color | readonly Color[]>;
  for (const key of Object.keys(TUNNEL) as (keyof ScenePalette)[]) {
    const a = asColors(KEYS[i][key]);
    const b = asColors(KEYS[i + 1][key]);
    out[key] = Array.isArray(a) ? a.map((c, n) => mix(c, (b as Color[])[n], u)) : mix(a as Color, b as Color, u);
  }
  const palette = out as unknown as ScenePalette;
  memo.set(k, palette);
  return palette;
}
