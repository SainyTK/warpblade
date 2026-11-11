import { GROUND, PLATFORMS, RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale, WHITE } from "../../../utils/color";
import { Rng } from "../../../utils/rng";
import { LAYER, type Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { hairline, halo, type Pt } from "./brush";
import { RUNE_HUES } from "./colors";
import { grownBy } from "./growth";
import { TOWERS } from "./towers";

/** Runes cut into the towers and the slab faces: dark grooves at first, filling with light one by one. */

/** rune glyphs as stroke paths inside a box 6 image pixels wide and 8 tall */
const GLYPHS: readonly (readonly (readonly Pt[])[])[] = [
  [
    [
      [0, 0],
      [2.5, 3],
      [5, 0],
    ],
    [
      [2.5, 0],
      [2.5, 7],
    ],
  ],
  [
    [
      [2.5, 0],
      [5, 2.5],
      [2.5, 5],
      [0, 2.5],
      [2.5, 0],
    ],
    [
      [2.5, 5],
      [2.5, 7],
    ],
  ],
  [
    [
      [0, 0],
      [4, 0],
      [1, 3.5],
      [5, 3.5],
      [1, 7],
    ],
  ],
  [
    [
      [1, 0],
      [1, 7],
    ],
    [
      [1, 1],
      [5, 3],
    ],
    [
      [1, 4],
      [4, 6],
    ],
  ],
  [
    [
      [4, 0],
      [0, 3.5],
      [4, 7],
    ],
    [
      [2, 3.5],
      [5, 3.5],
    ],
  ],
];

export interface Rune {
  /** the top left corner of its box, in art pixels */
  x: number;
  y: number;
  glyph: number;
  hue: number;
  /** the k at which it lights up */
  from: number;
  slab: boolean;
}

const r = new Rng(1616);
export const RUNES: readonly Rune[] = [
  ...TOWERS.flatMap(([tx, tw, top]) =>
    Array.from({ length: tw > 16 ? 3 : 2 }, () => ({
      x: tx + r.int(2, tw - 6),
      y: r.int(top + 6, Math.min(GROUND - 10, top + 50)),
      glyph: r.int(0, GLYPHS.length - 1),
      hue: r.int(0, 1),
      from: r.range(0, 1),
      slab: false,
    })),
  ),
  ...PLATFORMS.flatMap((p) =>
    Array.from({ length: 3 }, (_, i) => ({
      x: Math.round(p.x0 + ((i + 0.5) * (p.x1 - p.x0)) / 3) - 1,
      y: p.y + 3,
      glyph: r.int(0, GLYPHS.length - 1),
      hue: 2 * (i % 2),
      from: r.range(0, 0.9),
      slab: true,
    })),
  ),
];

export const runeLit = (u: Rune, k: number): boolean => grownBy(k, u.from);

const TOWER_ONLY: readonly Layer[] = [LAYER.tower];
const SLAB_ONLY: readonly Layer[] = [LAYER.slab];
const GROOVE = 0.45;
const UNLIT_GROOVE = 0.7;
const STAIN = { radius: 9, strength: 0.2 };
/** runes on the far towers fade this far into the horizon's color */
const TOWER_HAZE = 0.25;

function strokes(paint: PlatePaint, u: Rune, dx: number, dy: number, c: Color, a: number): void {
  const only = u.slab ? SLAB_ONLY : TOWER_ONLY;
  const x0 = u.x * RES + dx;
  const y0 = u.y * RES + dy;
  for (const path of GLYPHS[u.glyph])
    for (let i = 1; i < path.length; i++)
      hairline(paint, x0 + path[i - 1][0], y0 + path[i - 1][1], x0 + path[i][0], y0 + path[i][1], c, a, only);
}

/** every rune's groove cut into the stone, and the lit ones filled with light that stains the stone around them */
export function paintRunes(paint: PlatePaint, k: number, horizon: Color): void {
  for (const u of RUNES) {
    const only = u.slab ? SLAB_ONLY : TOWER_ONLY;
    const under = paint.get(u.x * RES + 2, u.y * RES + 4);
    if (!runeLit(u, k)) {
      strokes(paint, u, 0, 0, scale(under, UNLIT_GROOVE), 1);
      continue;
    }
    const hue = u.slab ? RUNE_HUES[u.hue] : mix(RUNE_HUES[u.hue], horizon, TOWER_HAZE);
    halo(paint, u.x * RES + 3, u.y * RES + 4, STAIN.radius, hue, STAIN.strength * (0.6 + 0.4 * k), only);
    strokes(paint, u, 1, 1, scale(under, GROOVE), 1);
    strokes(paint, u, 0, 0, mix(hue, WHITE, 0.25 + 0.2 * k), 1);
  }
}
