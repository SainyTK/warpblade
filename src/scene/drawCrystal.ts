import { CRYSTAL } from "../constants/defense";
import { PAL } from "../constants/palette";
import { GROUND } from "../constants/stage";
import { ellipseRing, fleck, glow, hairline, place, polygon, shade, sparkle } from "../engine/frame";
import type { CrystalView } from "../game/adventure";
import { mix, scale, WHITE } from "../utils/color";
import { grain } from "../utils/grain";
import type { ScenePalette } from "./eras/sceneDef";

const HALF_WIDTH = 8;
const TAPER = 0.45;
const BOB = 1.5;
const PEDESTAL = { half: 13, height: 6, cap: 2 } as const;
const CRACKS: readonly (readonly (readonly [number, number])[])[] = [
  [
    [-2, -9],
    [1, -4],
    [-1, 0],
    [2, 5],
  ],
  [
    [3, -12],
    [5, -7],
    [3, -3],
  ],
  [
    [-4, 2],
    [-1, 6],
    [-3, 10],
  ],
];
const SHARDS: readonly (readonly [number, number, number])[] = [
  [-14, 3, -0.6],
  [-6, 4, 0.4],
  [4, 3, -0.3],
  [12, 4, 0.8],
  [18, 2, 0.2],
];

function halfWidthAt(v: number): number {
  if (v < -TAPER) return ((v + 1) / (1 - TAPER)) * HALF_WIDTH;
  if (v > TAPER) return ((1 - v) / (1 - TAPER)) * HALF_WIDTH;
  return HALF_WIDTH;
}

function pedestal(x: number, palette: ScenePalette): void {
  const top = GROUND - PEDESTAL.height;
  shade(x - PEDESTAL.half, top, x + PEDESTAL.half, GROUND, (px, py, out) => {
    const u = px - (x - PEDESTAL.half);
    const width = PEDESTAL.half * 2;
    if (u < 0 || u >= width || py < top || py >= GROUND) return;
    if (py < top + 1) {
      out.c = palette.slabLip;
      return;
    }
    if (py < top + PEDESTAL.cap) {
      out.c = palette.slabEdge;
      return;
    }
    const tone = 0.86 + grain(Math.floor(px), Math.floor(py)) * 0.14;
    out.c = scale(u < 2 || u >= width - 2 ? palette.slabUnder : palette.slab, tone);
  });
}

function body(x: number, cy: number, flash: number, share: number): void {
  const half = CRYSTAL.height / 2;
  const ramp = PAL.crystal;
  const dim = 0.55 + share * 0.45;
  shade(x - HALF_WIDTH, cy - half, x + HALF_WIDTH, cy + half, (px, py, out) => {
    const v = (py - cy) / half;
    const reach = halfWidthAt(v);
    const u = (px - x) / Math.max(0.01, reach);
    if (Math.abs(v) >= 1 || Math.abs(px - x) >= reach) return;
    const cap = v < -TAPER;
    const facet = u < -0.35 ? 2 : u > 0.35 ? 4 : 3;
    const edge = Math.abs(u - 0.35) < 0.12 || Math.abs(u + 0.35) < 0.08;
    const base = ramp[Math.min(ramp.length - 1, facet + (cap ? 1 : 0) + (edge ? 1 : 0))];
    out.c = mix(scale(base, dim), WHITE, flash * 0.7);
  });
  polygon(
    [
      [x - 1, cy - half + 3],
      [x + 1, cy - half + 3],
      [x + 1, cy + half - 5],
      [x - 1, cy + half - 5],
    ],
    mix(ramp[5], WHITE, flash),
    0.55,
  );
}

function cracks(x: number, cy: number, share: number): void {
  const shown = share < CRYSTAL.lowShare ? CRACKS.length : share < 0.65 ? 1 : 0;
  for (const crack of CRACKS.slice(0, shown)) {
    for (let i = 0; i + 1 < crack.length; i++) {
      const [x0, y0] = crack[i];
      const [x1, y1] = crack[i + 1];
      hairline(x + x0, cy + y0, x + x1, y1 + cy, PAL.crystal[0], 0.9);
    }
  }
}

function shards(x: number): void {
  for (const [dx, lift, tilt] of SHARDS) {
    const sx = x + dx;
    const sy = GROUND - lift;
    polygon(
      [
        [sx, sy - 3],
        [sx + 2 + tilt, sy],
        [sx, sy + 1],
        [sx - 2 + tilt, sy],
      ],
      PAL.crystal[3],
    );
  }
}

export function drawCrystal(view: CrystalView, t: number, palette: ScenePalette): void {
  place();
  const { x, flash, share } = view;
  pedestal(x, palette);
  if (view.shattered) {
    shards(x);
    return;
  }
  const cy = GROUND - CRYSTAL.floatY - CRYSTAL.height / 2 + Math.sin(t * 2) * BOB;
  const pulse = view.low ? 0.5 + 0.5 * Math.sin(t * 9) : 0.75 + 0.1 * Math.sin(t * 2.4);
  glow(x, cy, 34, view.low ? PAL.heart[3] : PAL.crystal[3], 0.32 * pulse);
  ellipseRing(x, GROUND - PEDESTAL.height, 10, 2, PAL.crystal[4], 0.5 * pulse);
  body(x, cy, flash, share);
  cracks(x, cy, share);
  sparkle(x + 3, cy - 9 + Math.sin(t * 3) * 2, 3, PAL.crystal[5], WHITE, 0.4 * pulse);
  for (let i = 0; i < 4; i++) {
    const lift = (t * (7 + i * 2) + i * 11) % 30;
    fleck(x + (grain(i, 9) - 0.5) * 18, GROUND - PEDESTAL.height - lift, PAL.crystal[4], 1 - lift / 30);
  }
}
