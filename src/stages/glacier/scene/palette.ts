import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { Color } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";

type Shades = Record<keyof ScenePalette, string | readonly string[]>;

const CORRIDOR: Shades = {
  sky: ["#060a16", "#0a1426", "#0f1e38", "#15304e", "#1c4266", "#25557c"],
  starDim: "#3c6c94",
  starBright: "#b8ecff",
  ridgeTop: "#5e9cc8",
  ridge: "#1e4870",
  towerRim: "#8cc8ea",
  towerTop: "#4f8cbc",
  tower: "#24527e",
  windowLit: "#9ef6ff",
  windowLow: "#4cb0d4",
  windowDark: "#123250",
  groundLip: "#f2f8ff",
  groundEdge: "#b6cce6",
  stone: "#2a5f90",
  stoneTop: "#4a86b8",
  mortar: "#143458",
  moss: "#c8dcf0",
  mossTip: "#eef6ff",
  vine: "#7ea4c8",
  slabLip: "#f4faff",
  slabEdge: "#b8d2ea",
  slab: "#3a7cb4",
  slabUnder: "#123058",
  ironLip: "#8cc8ea",
  iron: "#2a5f90",
  ironEdge: "#0e2442",
  mist: "#b8e4ff",
};

const DEN: Shades = {
  ...CORRIDOR,
  sky: ["#08081a", "#0e1030", "#151a44", "#1c2a5a", "#243c70", "#2e4e84"],
  starBright: "#e0d0ff",
  ridgeTop: "#7a9ad4",
  ridge: "#243e78",
  towerRim: "#a6b8f0",
  tower: "#2a4686",
  stone: "#30588e",
  slab: "#4072b0",
  mist: "#cad4ff",
};

const asColors = (v: string | readonly string[]): Color | readonly Color[] =>
  typeof v === "string" ? hex(v) : ramp(v as string[]);

const memo = new Map<number, ScenePalette>();

export function glacierPalette(k: number): ScenePalette {
  const known = memo.get(k);
  if (known) return known;
  const out = {} as Record<string, Color | readonly Color[]>;
  for (const key of Object.keys(CORRIDOR) as (keyof ScenePalette)[]) {
    const a = asColors(CORRIDOR[key]);
    const b = asColors(DEN[key]);
    out[key] = Array.isArray(a) ? a.map((c, i) => mix(c, (b as Color[])[i], k)) : mix(a as Color, b as Color, k);
  }
  const palette = out as unknown as ScenePalette;
  memo.set(k, palette);
  return palette;
}
