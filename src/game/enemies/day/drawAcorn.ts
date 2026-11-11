import { RES } from "../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { DAY_COLORS as DC } from "./colors";

/** How an Oakheart acorn looks in flight, and the mark on the floor where it will land. */

/** the acorn upright, one character per image pixel: stem, cap, lit cap, nut, lit nut, glint and shaded nut */
const ACORN = ["...ss...", ".ccCCcc.", "ccCCcccc", ".nNNnnd.", ".nNgNnd.", ".nNNnnd.", "..nnnd..", "...nd..."];
const TONES: Record<string, Color> = {
  s: DC.bark[1],
  c: DC.acornCap,
  C: DC.acornCapLit,
  n: DC.acorn,
  N: DC.acornLit,
  g: DC.thornTip,
  d: DC.acornShade,
};
const SIZE = ACORN.length;
const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;
/** how many seconds of flight the streak behind the acorn covers */
const STREAK = 0.035;

/** the map's pixel at (i, j) after a quarter turn for each `turns` */
function turned(i: number, j: number, turns: number): string {
  let u = i;
  let v = j;
  for (let n = 0; n < turns; n++) [u, v] = [v, SIZE - 1 - u];
  return ACORN[v]?.[u] ?? ".";
}

/** an acorn tumbling a quarter turn at a time, outlined so it reads against the bright sky, with a streak behind it */
export function drawAcorn(x: number, y: number, spin: number, vx: number, vy: number): void {
  const turns = ((Math.floor(spin / (Math.PI / 2)) % 4) + 4) % 4;
  const at = (i: number): number => (i - SIZE / 2) / RES;
  hairline(x - vx * STREAK, y - vy * STREAK, x, y, DC.pollen[2], (u) => u * 0.7);
  for (let j = 0; j < SIZE; j++)
    for (let i = 0; i < SIZE; i++) {
      if (turned(i, j, turns) === ".") continue;
      for (const [du, dv] of NEIGHBOURS)
        if (turned(i + du, j + dv, turns) === ".") fleck(x + at(i + du), y + at(j + dv), DC.outline);
    }
  for (let j = 0; j < SIZE; j++)
    for (let i = 0; i < SIZE; i++) {
      const tone = turned(i, j, turns);
      if (tone !== ".") fleck(x + at(i), y + at(j), TONES[tone]);
    }
  glow(x, y, 6, DC.pollen[1], 0.25);
}

/** the mark where an acorn will land: a ring that tightens and brightens as it comes down, round a dot at the spot */
export function drawLandingMark(x: number, y: number, reach: number, k: number): void {
  const r = reach * (1.4 - k * 0.6);
  const near = k > 0.75;
  ellipseRing(x, y, r, r * 0.3, near ? DC.pollen[3] : DC.pollen[1], 0.5 + k * 0.5);
  if (near) ellipseRing(x, y, r * 0.55, r * 0.165, DC.pollen[2], 0.6);
  px(x, y, near ? DC.pollen[3] : DC.pollen[1], 0.4 + k * 0.6);
}
