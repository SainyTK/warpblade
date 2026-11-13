import { COIN_GOLD, PAL, WAX } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/**
 * Small drawing parts for Wenna's 16 x 16 icons: her Wicks and the Great Wick, violet flames, her lamp pole and
 * lantern, candles, wax pools and drops, the Quarry ring, flame bolts, lampflies, ghost candles and the lamplighter.
 */
type S = SpriteCanvas;
type Point = readonly [number, number];
/** her lamp violet, deep to glint: Wick flames, the Flare, the warp, Kindle and the Quarry ring */
export const VIOLET = PAL.wick;
/** candle wax, deep to glint: Wick bodies, drips and pools */
export { WAX };
/** her accent: the lantern's light and the Quarry ring's lit edge */
export const ACCENT = hex("#b48cff");
/** the gold of an evolved icon, and the gold core of every Wick flame */
export const GOLD = COIN_GOLD[3];
export const GOLD_LIGHT = COIN_GOLD[4];
export const GOLD_DARK = COIN_GOLD[2];
/** the lamp pole's dark wood and the lantern's iron */
export const WOOD = hex("#3e2a1c");
export const WOOD_LIGHT = hex("#6e4c32");
export const IRON = hex("#4c4a5a");
export const IRON_LIGHT = hex("#8e8ca0");
/** her ash-grey cloak and its violet lining, olive skin and dark auburn hair */
export const CLOAK = hex("#77737e");
export const CLOAK_DARK = hex("#4e4b56");
export const SKIN = hex("#9a7c4c");
export const HAIR = hex("#5c2a1c");
/** the frost a chilling skill adds */
export const FROST = PAL.ice[3];

/** the colours of a Wick: its flame, its gold core and its wax */
const wickColors = (gold: boolean): Record<string, Color> => ({
  f: gold ? GOLD : VIOLET[3],
  F: gold ? GOLD_LIGHT : VIOLET[4],
  c: gold ? WHITE : GOLD_LIGHT,
  W: WAX[2],
  L: WAX[3],
  w: WAX[1],
  d: WAX[0],
  e: VIOLET[0],
});
const flip = (rows: readonly string[]): string[] => rows.map((r) => [...r].reverse().join(""));

/** a Wick, seven pixels wide and nine tall: a violet flame for a head over an ivory wax body with stubby arms */
const WICK = [
  "...f...",
  "..fFf..",
  "..FcF..",
  ".LWWWW.",
  ".WeWeW.",
  "wWWWWWw",
  ".WWWWW.",
  ".wWWWw.",
  ".ddddd.",
] as const;
/** a small Wick, five wide and seven tall, for icons that hold several */
const SMALL_WICK = ["..f..", ".fcF.", ".LWW.", ".eWe.", "wWWWw", ".wWw.", ".ddd."] as const;

/** a Wick, its feet centred at (x, y); gold lights its flame for an evolved icon */
export function wick(s: S, x: number, y: number, gold = false, face = 1): void {
  fill(s, () => s.pixels(face < 0 ? flip(WICK) : WICK, wickColors(gold), x - 3, y - 8));
}

/** a small Wick, its feet centred at (x, y) */
export function smallWick(s: S, x: number, y: number, gold = false, face = 1): void {
  fill(s, () => s.pixels(face < 0 ? flip(SMALL_WICK) : SMALL_WICK, wickColors(gold), x - 2, y - 6));
}

/** a violet flame standing on base at cx, h tall, leaning `lean` pixels at the tip; gold burns it gold */
export function flame(s: S, cx: number, base: number, h: number, gold = false, lean = 0): void {
  fill(s, () => {
    s.poly(
      [
        [cx - h * 0.42, base],
        [cx + h * 0.42 + 1, base],
        [cx + h * 0.32 + 1 + lean * 0.4, base - h * 0.55],
        [cx + 0.5 + lean, base - h],
        [cx - h * 0.3 + lean * 0.4, base - h * 0.5],
      ],
      gold ? GOLD : VIOLET[3],
    );
  });
  fill(s, () => {
    s.poly(
      [
        [cx - h * 0.18, base],
        [cx + h * 0.2 + 1, base],
        [cx + h * 0.1 + 1 + lean * 0.3, base - h * 0.45],
        [cx + 0.5 + lean * 0.6, base - h * 0.68],
        [cx - h * 0.12 + lean * 0.3, base - h * 0.35],
      ],
      gold ? GOLD_LIGHT : VIOLET[4],
    );
    s.set(cx, base - 1, gold ? WHITE : GOLD_LIGHT);
  });
}

/** a candle of wax w wide standing on base at cx, h tall to its rim, with a drip down its side and a flame on top */
export function candle(s: S, cx: number, base: number, h: number, w = 3, gold = false, fh = 4): void {
  const x0 = Math.round(cx - w / 2);
  fill(s, () => {
    s.block(x0, base - h, WAX[2], w, h);
    s.block(x0, base - h, WAX[3], 1, h - 1);
    s.block(x0 + w - 1, base - h + 2, WAX[1], 1, h - 2);
    s.set(x0 + w - 1, base - h + 1, WAX[3]);
  });
  flame(s, x0 + (w - 1) / 2, base - h, fh, gold);
}

/** her lantern, five pixels wide and seven tall, hanging from (cx, top): a pale iron cage round a violet light */
const LANTERN = ["..r..", ".III.", "IVFVi", "iFcFi", "iFFFi", "iVFVi", ".iii."] as const;
/** the lantern with its shutter thrown open: the light spills out of its right side */
const OPEN_LANTERN = ["..r..", ".III.", "IVFF.", "iFcFF", "iFFFF", "iVFF.", ".iii."] as const;

/** the lantern hanging from (cx, top); `open` throws its shutter open, `gold` lights it for an evolved icon */
export function lantern(s: S, cx: number, top: number, open = false, gold = false): void {
  fill(s, () =>
    s.pixels(
      open ? OPEN_LANTERN : LANTERN,
      {
        r: IRON_LIGHT,
        i: gold ? GOLD_DARK : IRON_LIGHT,
        I: gold ? GOLD_LIGHT : WHITE,
        V: gold ? GOLD : VIOLET[3],
        F: gold ? GOLD_LIGHT : VIOLET[4],
        c: WHITE,
      },
      cx - 2,
      top,
    ),
  );
}

/** her lamp pole from the heel at (x0, y0) to the hook at (x1, y1), the lantern hanging `chain` pixels below the hook */
export function lampPole(s: S, x0: number, y0: number, x1: number, y1: number, chain = 1, gold = false): void {
  fill(s, () => {
    s.stroke(x0, y0, x1, y1, 0.5, WOOD);
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    seg(s, x0 + ((x1 - x0) / L) * 1.5, y0 + ((y1 - y0) / L) * 1.5, x1, y1, WOOD_LIGHT);
  });
  const hx = Math.round(x1) + 1;
  fill(s, () => {
    s.set(x1, y1, IRON_LIGHT);
    s.set(hx, Math.round(y1), IRON);
    seg(s, hx, Math.round(y1) + 1, hx, Math.round(y1) + chain, IRON_LIGHT);
  });
  lantern(s, hx, Math.round(y1) + chain + 1, false, gold);
}

/** a thin oval ring round (cx, cy), rx across and ry deep, lit along its top: the Quarry's lamplight ring */
export function quarryRing(s: S, cx: number, cy: number, rx: number, ry: number, gold = false): void {
  fill(s, () => {
    const n = Math.ceil((rx + ry) * 6);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      s.set(
        Math.round(cx + Math.cos(a) * rx),
        Math.round(cy + Math.sin(a) * ry),
        Math.sin(a) < 0 ? (gold ? GOLD_LIGHT : VIOLET[5]) : gold ? GOLD : ACCENT,
      );
    }
  });
}

/** a flat puddle of wax on the floor round (cx, y), rx across, with a lit rim on its far side */
export function pool(
  s: S,
  cx: number,
  y: number,
  rx: number,
  ry = 1.6,
  c: Color = WAX[1],
  light: Color = WAX[3],
): void {
  const ellipse = (r: number, k: number, dy = 0): Point[] =>
    Array.from({ length: 24 }, (_, i): Point => {
      const a = (i / 24) * TAU;
      return [cx + Math.cos(a) * r, y + dy + Math.sin(a) * r * k];
    });
  fill(s, () => {
    s.poly(ellipse(rx, ry / rx), c);
    seg(s, cx - rx * 0.6, y - ry + 0.6, cx + rx * 0.2, y - ry + 0.6, light);
  });
}

/** a burst of n rays round (cx, cy), from r0 out to r1, the long rays lit */
export function burst(
  s: S,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  c: Color,
  light: Color,
  n = 8,
  turn = 0,
): void {
  fill(s, () => {
    for (let i = 0; i < n; i++) {
      const a = turn + (i / n) * TAU;
      const r = i % 2 ? r1 * 0.7 : r1;
      seg(
        s,
        cx + Math.cos(a) * r0,
        cy + Math.sin(a) * r0,
        cx + Math.cos(a) * r,
        cy + Math.sin(a) * r,
        i % 2 ? c : light,
      );
    }
  });
}

/** a flame bolt flying to (x, y) from along the angle `from`, its tail `len` long */
export function flameBolt(s: S, x: number, y: number, from: number, len: number, gold = false): void {
  const ux = Math.cos(from);
  const uy = Math.sin(from);
  fill(s, () => {
    for (let k = len; k >= 1; k--)
      s.set(Math.round(x + ux * k), Math.round(y + uy * k), k > len / 2 ? VIOLET[2] : gold ? GOLD : VIOLET[3]);
    s.dot(x + 0.5, y + 0.5, 1.1, gold ? GOLD_LIGHT : VIOLET[4]);
    s.set(x, y, WHITE);
  });
}

/** a lampfly: a gold-hearted mote of violet light with two pale wings, centred on (x, y) */
export function lampfly(s: S, x: number, y: number, gold = false): void {
  fill(s, () => {
    s.set(x - 1, y - 1, VIOLET[5]);
    s.set(x + 1, y - 1, VIOLET[5]);
    s.set(x, y, gold ? GOLD_LIGHT : VIOLET[4]);
    s.set(x, y + 1, gold ? GOLD : ACCENT);
  });
}

/** a ghost candle: a pale wavering candle with a hollow flame, its ragged foot at (cx, base), h tall */
export function ghostCandle(s: S, cx: number, base: number, h: number, gold = false): void {
  fill(s, () => {
    s.block(cx - 1, base - h, VIOLET[4], 3, h - 1);
    s.block(cx - 1, base - h, VIOLET[5], 1, h - 2);
    s.set(cx - 1, base - 1, VIOLET[3]);
    s.set(cx + 1, base - 1, VIOLET[3]);
    s.set(cx, base - 2, VIOLET[2]);
  });
  fill(s, () => {
    s.pixels([".g.", "g.g", ".g."], { g: gold ? GOLD_LIGHT : VIOLET[5] }, cx - 1, base - h - 3);
  });
}

/** the lamplighter, eleven pixels tall, facing right: a deep grey hood, olive skin, an ash cloak lined violet, wax at its hem */
const LAMPLIGHTER = [
  ".hH...",
  "hHHH..",
  "hHSS..",
  "hhSE..",
  ".VCC..",
  ".VCCC.",
  ".VCCs.",
  "VCCCs.",
  "VCCCC.",
  "VcCCC.",
  "LxLxL.",
] as const;
const LAMPLIGHTER_COLORS: Record<string, Color> = {
  h: CLOAK_DARK,
  H: CLOAK,
  S: SKIN,
  E: HAIR,
  C: CLOAK,
  c: CLOAK_DARK,
  V: VIOLET[2],
  s: WOOD_LIGHT,
  L: WAX[2],
  x: WAX[1],
};

/** the lamplighter, her hem at (x, y); `pole` gives her the lamp pole held upright before her, its lantern hanging */
export function lamplighter(s: S, x: number, y: number, pole = true, face = 1): void {
  fill(s, () =>
    s.pixels(face < 0 ? flip(LAMPLIGHTER) : LAMPLIGHTER, LAMPLIGHTER_COLORS, face < 0 ? x - 2 : x - 3, y - 10),
  );
  if (pole) lampPole(s, x + face * 3, y, x + face * 3, y - 12, 1);
}

/** a dashed flame thread from (x0, y0) to (x1, y1), its dashes alternating violet and pale */
export function thread(s: S, x0: number, y0: number, x1: number, y1: number, gold = false): void {
  fill(s, () => {
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
    for (let i = 0; i <= n; i++) {
      if (i % 3 === 2) continue;
      const c = i % 3 ? (gold ? GOLD_LIGHT : VIOLET[4]) : gold ? GOLD : VIOLET[3];
      s.set(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
    }
  });
}

/** a drop of wax falling, round at the bottom with a point on top, centred on (cx, cy) */
export function waxDrop(s: S, cx: number, cy: number, r: number, gold = false): void {
  fill(s, () => {
    s.dot(cx, cy, r, gold ? GOLD : WAX[2]);
    s.poly(
      [
        [cx - r * 0.7, cy - r * 0.4],
        [cx + r * 0.7 + 1, cy - r * 0.4],
        [cx + 0.5, cy - r * 2.1],
      ],
      gold ? GOLD : WAX[2],
    );
    s.set(cx - Math.max(1, r * 0.5), cy - r * 0.2, gold ? GOLD_LIGHT : WAX[3]);
  });
}

/** a curl of grey smoke rising from (x, y) */
export function smoke(s: S, x: number, y: number): void {
  fill(s, () => {
    s.set(x, y, hex("#8a8496"));
    s.set(x + 1, y - 1, hex("#8a8496"));
    s.set(x, y - 2, hex("#c4bcc8"));
    s.set(x - 1, y - 3, hex("#c4bcc8"));
  });
}

/** frost motes: chilled foes */
export function frost(s: S, pts: readonly Point[]): void {
  fill(s, () => {
    for (const [i, [x, y]] of pts.entries()) s.set(x, y, i % 2 ? PAL.ice[4] : FROST);
  });
}

/** sparks at these points, pale violet and gold */
export function sparks(s: S, pts: readonly Point[], gold = false): void {
  fill(s, () => {
    for (const [i, [x, y]] of pts.entries())
      s.set(x, y, i % 2 ? (gold ? GOLD : VIOLET[4]) : gold ? GOLD_LIGHT : VIOLET[5]);
  });
}

/** the Great Wick, about twelve pixels wide and fifteen tall, its feet centred at (cx, y): a giant Wick swinging one arm up */
export function greatWick(s: S, cx: number, y: number, gold = false): void {
  fill(s, () => {
    s.stroke(cx + 3.5, y - 5, cx + 6.5, y - 10, 0.9, WAX[2]);
    s.set(cx + 6, y - 11, WAX[3]);
  });
  fill(s, () => s.stroke(cx - 4, y - 5, cx - 6, y - 3, 0.9, WAX[1]));
  fill(s, () => {
    s.poly(
      [
        [cx - 5, y + 1],
        [cx + 5 + 1, y + 1],
        [cx + 4 + 1, y - 8],
        [cx - 4, y - 8],
      ],
      WAX[2],
    );
    seg(s, cx - 4, y - 7, cx - 5, y - 1, WAX[3]);
    seg(s, cx + 4, y - 6, cx + 5, y - 1, WAX[1]);
    seg(s, cx - 5, y, cx + 5, y, WAX[0]);
    s.block(cx - 2, y - 6, VIOLET[0], 1, 2);
    s.block(cx + 2, y - 6, VIOLET[0], 1, 2);
  });
  flame(s, cx, y - 8, 7, gold);
}
