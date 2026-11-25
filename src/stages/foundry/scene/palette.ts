import type { ScenePalette } from "../../../scene/eras/sceneDef";
import type { Color } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";

type PaletteSource = Record<keyof ScenePalette, string | readonly string[]>;

const UPPER: PaletteSource = {
  sky: ["#0e0809", "#170c0d", "#22100f", "#301410", "#441a11", "#5c2211", "#7a2e12"],
  starDim: "#6a2a16",
  starBright: "#ffb860",
  ridgeTop: "#5a2414",
  ridge: "#1e1012",
  towerRim: "#b0481c",
  towerTop: "#3a1c16",
  tower: "#2a1614",
  windowLit: "#ffb04a",
  windowLow: "#d8601e",
  windowDark: "#1a0e0e",
  groundLip: "#e8a874",
  groundEdge: "#8c5a42",
  stone: "#3a2c2a",
  stoneTop: "#4a3834",
  mortar: "#1a1212",
  moss: "#7a2a10",
  mossTip: "#ff9a36",
  vine: "#2a1a18",
  slabLip: "#e2b48c",
  slabEdge: "#8a604a",
  slab: "#4c3a36",
  slabUnder: "#1a1010",
  ironLip: "#a88a7a",
  iron: "#4a3a36",
  ironEdge: "#1a1212",
  mist: "#ff6a26",
};

const DEEP: PaletteSource = {
  ...UPPER,
  sky: ["#120809", "#1e0c0c", "#2c100e", "#40160f", "#5a1e10", "#7a2a10", "#9e3a12"],
  ridgeTop: "#7a2e14",
  towerRim: "#d0581c",
  tower: "#2e1614",
  groundLip: "#f4b47a",
  slabLip: "#eebc8c",
  mist: "#ff5a1e",
};

const asColors = (v: string | readonly string[]): Color | readonly Color[] =>
  typeof v === "string" ? hex(v) : ramp(v as string[]);
const memo = new Map<number, ScenePalette>();

export function foundryPalette(k: number): ScenePalette {
  const known = memo.get(k);
  if (known) return known;
  const out = {} as Record<string, Color | readonly Color[]>;
  for (const key of Object.keys(UPPER) as (keyof ScenePalette)[]) {
    const a = asColors(UPPER[key]);
    const b = asColors(DEEP[key]);
    out[key] = Array.isArray(a) ? a.map((c, i) => mix(c, (b as Color[])[i], k)) : mix(a as Color, b as Color, k);
  }
  const palette = out as unknown as ScenePalette;
  memo.set(k, palette);
  return palette;
}

export const SCENE_COLORS = {
  rock: ramp(["#0c0708", "#160e0f", "#211415", "#2e1b19"]),
  rockLit: ramp(["#4a1e12", "#8a3414", "#d0581c"]),
  vein: ramp(["#6a1e0c", "#c8481a", "#ff9a36"]),
  fall: ramp(["#8a240c", "#e0601c", "#ffb04a", "#fff0b8"]),
  farHall: ramp(["#241210", "#2e1612", "#3c1c14", "#5a2816"]),
  nearHall: ramp(["#120a0a", "#1a0f0e", "#241412", "#36190f"]),
  hallRim: ramp(["#5a2010", "#9a3a14", "#e06a20"]),
  window: ramp(["#8a2a0c", "#e06a1c", "#ffb04a", "#ffe8a0"]),
  floorIron: ramp(["#140e0e", "#211817", "#2f2321", "#3f302c", "#55423c"]),
  floorLip: ramp(["#5a3a2c", "#9a6a4e", "#e8a874", "#ffd8a8"]),
  grateGlow: ramp(["#3a0e06", "#8a240a", "#e0581a", "#ffa040"]),
  rivet: hex("#7a6058"),
  rivetLit: hex("#c8a088"),
  chain: ramp(["#0e0909", "#2a1c1a", "#4a3430", "#8a5a40"]),
  ember: ramp(["#ff6a1c", "#ffa040", "#ffe08a", "#fff6d0"]),
  ash: ramp(["#3a2e2c", "#5a4a46", "#8a7a74"]),
  heat: hex("#ff8a3a"),
  glow: hex("#ff6a1e"),
  hot: hex("#ffb04a"),
} as const;
