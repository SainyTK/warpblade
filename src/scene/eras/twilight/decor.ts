import { GROUND, PLATFORMS, W } from "../../../constants/stage";
import { hex, mix, ramp } from "../../../utils/color";
import { Rng } from "../../../utils/rng";
import type { ScenePalette } from "../sceneDef";

/** the shared layout's towers (x, width, top), to cut runes only into their stone */
const TOWERS: readonly (readonly [number, number, number])[] = [
  [14, 22, 70],
  [58, 14, 92],
  [96, 18, 60],
  [150, 26, 54],
  [196, 12, 88],
  [232, 20, 66],
  [292, 18, 80],
];
const GLYPHS: readonly (readonly string[])[] = [
  ["#.#", "###", ".#.", ".#."],
  [".#.", "#.#", ".#.", "#.#"],
  ["##.", ".#.", ".##", "..#"],
  ["#..", "##.", "#.#", "#.."],
  [".##", "#..", ".#.", "##."],
];
const RUNE_HUES = [hex("#5ee8f0"), hex("#c08aff"), hex("#ff8ae8")];
export const CRYSTAL = ramp(["#3a1f6a", "#6a3cb0", "#9a6ae8", "#d6b4ff", "#f6ecff"]);

export interface Rune {
  x: number;
  y: number;
  glyph: number;
  hue: number;
  /** the k at which it lights up */
  from: number;
  slab: boolean;
}

const r = new Rng(1616);
/** runes cut into the towers and the slab faces, lighting up one by one as the era goes on */
export const RUNES: readonly Rune[] = [
  ...TOWERS.flatMap(([tx, tw, top]) =>
    Array.from({ length: tw > 16 ? 3 : 2 }, () => ({
      x: tx + r.int(2, tw - 6),
      y: r.int(top + 6, Math.min(GROUND - 10, top + 50)),
      glyph: r.int(0, GLYPHS.length - 1),
      hue: r.int(0, 1),
      from: r.range(0.2, 1),
      slab: false,
    })),
  ),
  ...PLATFORMS.flatMap((p) =>
    Array.from({ length: 3 }, (_, i) => ({
      x: Math.round(p.x0 + ((i + 0.5) * (p.x1 - p.x0)) / 3) - 1,
      y: p.y + 3,
      glyph: r.int(0, GLYPHS.length - 1),
      hue: 2 * (i % 2),
      from: r.range(0.2, 0.9),
      slab: true,
    })),
  ),
];
/** crystal clusters along the floor: x, height, the k they grow at */
export const FLOOR_CRYSTALS: readonly (readonly [number, number, number])[] = [
  [8, 5, 0.5],
  [124, 4, 0.75],
  [196, 3, 1],
  [252, 4, 0.5],
  [314, 6, 0.75],
];

export const runeLit = (u: Rune, k: number): boolean => k + 0.01 >= u.from;

/** cut the lit runes into stone only, a darker halo row under each, then grow the crystals on the floor */
export function drawRunesAndCrystals(bg: Uint32Array, P: ScenePalette, k: number): void {
  for (const u of RUNES) {
    if (!runeLit(u, k)) continue;
    const c = mix(P.tower, RUNE_HUES[u.hue], 0.55 + 0.45 * k);
    GLYPHS[u.glyph].forEach((row, j) => {
      for (let i = 0; i < 3; i++) {
        if (row[i] !== "#") continue;
        const idx = (u.y + j) * W + u.x + i;
        const under = bg[idx];
        if (!u.slab && under !== P.tower) continue;
        if (u.slab && under !== P.slab) continue;
        bg[idx] = c;
      }
    });
  }
  for (const [x, h, from] of FLOOR_CRYSTALS) {
    if (k + 0.01 < from) continue;
    const spikes: readonly (readonly [number, number])[] = [
      [0, h],
      [-2, h - 2],
      [2, h - 1],
    ];
    for (const [dx, sh] of spikes)
      for (let j = 0; j < sh; j++) {
        const y = GROUND - 1 - j;
        const cx = x + dx + (j > sh / 2 ? Math.sign(dx) : 0);
        if (cx < 0 || cx >= W) continue;
        bg[y * W + cx] = j === sh - 1 ? CRYSTAL[4] : dx < 0 ? CRYSTAL[3] : j < 2 ? CRYSTAL[1] : CRYSTAL[2];
      }
  }
}
