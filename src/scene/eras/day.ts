import { GROUND, N, W } from "../../constants/stage";
import { glow, place } from "../../engine/frame";
import type { Color } from "../../types/color";
import { hex, mix, ramp } from "../../utils/color";
import type { Rng } from "../../utils/rng";
import { type SkyColors, skyColors } from "./day/colors";
import { paintDayDetail } from "./day/detail";
import { drawBirds, drawButterflies, drawDriftingClouds, drawSeedsAndMotes, drawStalks, setStalks } from "./day/life";
import { sunAt } from "./day/sky";
import type { SceneDef, ScenePalette } from "./sceneDef";

/** Waves 1 to 5: the sunlit meadow ruins under a clear blue sky, warming toward late afternoon by the fifth wave. */

const NOON: Record<keyof ScenePalette, string | readonly string[]> = {
  sky: ["#4f8fdc", "#5e9de2", "#71ace8", "#88bdee", "#a3cff2", "#c4e2f6"],
  starDim: "#c4e2f6",
  starBright: "#ffffff",
  ridgeTop: "#b2d49a",
  ridge: "#86b08a",
  towerRim: "#dfe8f0",
  towerTop: "#c2d0e0",
  tower: "#93a4bc",
  windowLit: "#4a5672",
  windowLow: "#3a4460",
  windowDark: "#4a5672",
  groundLip: "#eee2c4",
  groundEdge: "#c8b894",
  stone: "#a29478",
  stoneTop: "#b6a888",
  mortar: "#6e6452",
  moss: "#4e9a38",
  mossTip: "#8cd24a",
  vine: "#3f8034",
  slabLip: "#f2e8cc",
  slabEdge: "#cfc2a0",
  slab: "#aa9c80",
  slabUnder: "#5c5244",
  ironLip: "#9a8a74",
  iron: "#5a4e44",
  ironEdge: "#2e2620",
  mist: "#ffffff",
};
/** the same scene in the low gold light of late afternoon */
const DUSK: typeof NOON = {
  ...NOON,
  sky: ["#5a82c8", "#6c92cc", "#86a6d0", "#a8bcd2", "#d2cdc8", "#f2dcb8"],
  ridgeTop: "#c8cc8a",
  ridge: "#8ea47c",
  towerRim: "#f4dcc0",
  towerTop: "#d0c4c4",
  tower: "#9a9cb4",
  groundLip: "#f8dcb0",
  groundEdge: "#d4b48a",
  stone: "#a88e70",
  stoneTop: "#bca282",
  mossTip: "#a8d048",
  slabLip: "#fae2bc",
  slabEdge: "#d8bc96",
  slab: "#b09678",
};

const asColors = (v: string | readonly string[]): Color | readonly Color[] =>
  typeof v === "string" ? hex(v) : ramp(v as string[]);
const BASE = { noon: NOON, dusk: DUSK };
const memo = new Map<number, ScenePalette>();

/** the day palette at progress k: noon at the first wave, a warm late afternoon by the last */
export function dayPalette(k: number): ScenePalette {
  const hit = memo.get(k);
  if (hit) return hit;
  const u = k * 0.85;
  const out = {} as Record<string, Color | readonly Color[]>;
  for (const key of Object.keys(NOON) as (keyof ScenePalette)[]) {
    const a = asColors(BASE.noon[key]);
    const b = asColors(BASE.dusk[key]);
    out[key] = Array.isArray(a) ? a.map((c, i) => mix(c, (b as Color[])[i], u)) : mix(a as Color, b as Color, u);
  }
  const p = out as unknown as ScenePalette;
  memo.set(k, p);
  return p;
}

const RIFT = hex("#b673e8");
const RIFT_HOT = hex("#ecc8ff");
/** where the static scene shows faint violet rift cracks in the floor, so the ambient light can make them breathe */
const CRACKS: readonly (readonly [number, number])[] = [
  [128, 164],
  [262, 170],
];

/** the rift has split the floor in two places; the cracks hold a faint violet light */
function riftCracks(bg: Uint32Array, r: Rng): void {
  for (const [cx, cy] of CRACKS) {
    let x = cx;
    let y = cy;
    for (let k = 0; k < 9; k++) {
      bg[y * W + x] = k < 3 ? RIFT_HOT : RIFT;
      x += r.pick([-1, 1, 1]);
      y += r.pick([0, 0, 1, -1]);
    }
  }
}

/** the art pixel at the top of each tower window, read from the art pixel picture */
function findWindows(bg: Uint32Array, window: Color): [number, number][] {
  const found: [number, number][] = [];
  for (let y = 1; y < GROUND; y++)
    for (let x = 0; x < W; x++) if (bg[y * W + x] === window && bg[(y - 1) * W + x] !== window) found.push([x, y]);
  return found;
}

let colors: SkyColors = skyColors(0);
/** the art pixel picture as the last static step left it, kept for the detail pass that follows */
const artPicture = new Uint32Array(N);
let windows: [number, number][] = [];

export const day: SceneDef = {
  palette: dayPalette,
  stars: 0,
  windows: 0,
  braziers: 0,
  mist: 0,
  decorate(bg, r, k) {
    windows = findWindows(bg, dayPalette(k).windowDark);
    riftCracks(bg, r);
    artPicture.set(bg);
  },
  detail(paint, r, k) {
    const P = dayPalette(k);
    colors = skyColors(k);
    const stalks = paintDayDetail(paint, r, k, colors, P, { picture: artPicture, windows });
    setStalks(stalks, { foot: P.vine, stem: P.moss, tip: P.mossTip });
  },
  ambient(t, k) {
    place();
    const sun = sunAt(k);
    glow(sun.x, sun.y, 64, colors.halo, 0.22 + k * 0.06);
    glow(sun.x, sun.y, 22, colors.core, 0.3);
    drawDriftingClouds(t, colors);
    drawBirds(t);
    drawButterflies(t);
    drawStalks(t);
    for (const [cx, cy] of CRACKS) glow(cx + 3, cy, 9, RIFT, 0.18 + Math.sin(t * 1.4 + cx) * 0.06);
  },
  weather: drawSeedsAndMotes,
};
