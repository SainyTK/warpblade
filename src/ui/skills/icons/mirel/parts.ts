import { COIN_GOLD, PAL, SAND } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/**
 * Small drawing parts for Mirel's 16 x 16 icons: her staff and its clock ring, clock faces and hands, tick rings,
 * hourglasses of sand, gears, clockwork wrens, sundials, falling blades, dust and the hour keeper herself.
 */
type S = SpriteCanvas;
type Point = readonly [number, number];
/** her clock teal, dark to pale: the ring, the Stillfield, echoes and Rewind */
export const HOUR = PAL.hour;
/** her accent: the clock ring's lit edge */
export const ACCENT = hex("#6fe0c8");
export { SAND };
/** the gold of an evolved icon */
export const GOLD = COIN_GOLD[3];
export const GOLD_LIGHT = COIN_GOLD[4];
export const GOLD_DARK = COIN_GOLD[2];
/** her robe in slate plum, its sand-gold trim, her skin and silver hair, and the staff's dark wood */
export const ROBE = hex("#4e3c5c");
export const ROBE_LIGHT = hex("#6e5a7e");
export const TRIM = hex("#d8b060");
export const SKIN = hex("#6a4028");
export const HAIR = hex("#d8dce6");
export const WOOD = hex("#4a2e1c");
export const WOOD_LIGHT = hex("#7a5434");
/** the life Second Chance winds back */
export const HEART = hex("#e0405a");
export const HEART_LIGHT = hex("#ffd0d8");
/** the ember of a dying star */
export const EMBER = [hex("#5a1a12"), hex("#a8401e"), hex("#e07a3a"), hex("#ffc27a")] as const;

/** a clock hand from the pivot (cx, cy) at angle a (0 points right, -PI / 2 up), len long, its tip lit */
export function hand(s: S, cx: number, cy: number, a: number, len: number, c: Color, tip: Color = WHITE): void {
  fill(s, () => {
    const x = cx + Math.cos(a) * len;
    const y = cy + Math.sin(a) * len;
    seg(s, cx, cy, x, y, c);
    s.set(Math.round(x), Math.round(y), tip);
  });
}

/** twelve tick marks round (cx, cy) at radius r, the four quarters lit */
export function ticks(s: S, cx: number, cy: number, r: number, c: Color, quarter: Color = WHITE): void {
  fill(s, () => {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      s.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), i % 3 ? c : quarter);
    }
  });
}

/** a thin ring of radius r round (cx, cy), one pixel wide, lit from the top left */
export function hoop(s: S, cx: number, cy: number, r: number, c: Color, light: Color): void {
  fill(s, () => {
    const n = Math.ceil(r * 10);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      const lit = Math.cos(a - 1.25 * Math.PI) > 0.45;
      s.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), lit ? light : c);
    }
  });
}

/** her clock ring, the Stillfield's shape: a teal hoop with twelve ticks inside; `gold` lights it for an evolved icon */
export function clockRing(s: S, cx: number, cy: number, r: number, gold = false): void {
  hoop(s, cx, cy, r, gold ? GOLD_DARK : HOUR[3], gold ? GOLD_LIGHT : ACCENT);
  ticks(s, cx, cy, r - 1.6, gold ? HOUR[4] : HOUR[2], gold ? GOLD_LIGHT : HOUR[5]);
}

/** a clock face, a dark teal disc in a rim with twelve ticks; `gold` rims it gold */
export function clockFace(s: S, cx: number, cy: number, r: number, gold = false, face: Color = HOUR[1]): void {
  fill(s, () => {
    s.dot(cx, cy, r, gold ? GOLD_DARK : HOUR[3]);
    s.dot(cx, cy, r - 1, face);
    for (let k = 0; k < 8; k++) {
      const a = Math.PI * (1.05 + (k / 7) * 0.4);
      s.set(
        Math.round(cx + Math.cos(a) * (r - 0.5)),
        Math.round(cy + Math.sin(a) * (r - 0.5)),
        gold ? GOLD_LIGHT : ACCENT,
      );
    }
    if (r < 4.5) return;
    for (let i = 0; i < 12; i += 3) {
      const a = (i / 12) * TAU;
      s.set(
        Math.round(cx + Math.cos(a) * (r - 2)),
        Math.round(cy + Math.sin(a) * (r - 2)),
        gold ? GOLD_LIGHT : HOUR[4],
      );
    }
  });
}

/** a pivot pin at (cx, cy) */
export function pivot(s: S, cx: number, cy: number, c: Color = WHITE): void {
  fill(s, () => s.set(cx, cy, c));
}

/** her staff from the heel at (x0, y0) to the clock ring at (x1, y1): dark wood and a ring with one hand inside */
export function staff(s: S, x0: number, y0: number, x1: number, y1: number, gold = false, r = 2.6): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => {
    s.stroke(x0, y0, x1 - ux * r, y1 - uy * r, 0.55, WOOD);
    seg(s, x0 - uy * 0.4, y0 + ux * 0.4, x1 - ux * (r + 1) - uy * 0.4, y1 - uy * (r + 1) + ux * 0.4, WOOD_LIGHT);
    s.set(x1 - ux * (r + 0.8), y1 - uy * (r + 0.8), gold ? GOLD : TRIM);
  });
  hoop(s, x1, y1, r, gold ? GOLD_DARK : HOUR[3], gold ? GOLD_LIGHT : ACCENT);
  fill(s, () => {
    seg(s, x1, y1, x1 + 1, y1 - 1, gold ? GOLD_LIGHT : HOUR[5]);
    s.set(x1, y1, WHITE);
  });
}

/** a crescent smear of a staff blow round (cx, cy), thick in the middle; ghost draws the pale echo of one */
export function smear(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color, edge: Color): void {
  fill(s, () => {
    const n = 24;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const a = a0 + (a1 - a0) * u;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.35 + Math.sin(Math.PI * u) * 0.9, c);
    }
    for (let i = 2; i <= n - 2; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      s.set(cx + Math.cos(a) * (r + 0.6), cy + Math.sin(a) * (r + 0.6), edge);
    }
  });
}

/** a dotted echo of a smear: every other pixel of an arc, pale and faint */
export function echoArc(s: S, cx: number, cy: number, r: number, a0: number, a1: number, c: Color): void {
  fill(s, () => {
    const n = Math.ceil(Math.abs(a1 - a0) * r * 1.4);
    for (let k = 0; k <= n; k += 2) {
      const a = a0 + ((a1 - a0) * k) / n;
      s.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), c);
    }
  });
}

/** an hourglass of warm sand, its top at (x, y), w across and h tall; `full` is how much sand is still on top, 0 to 1 */
export function hourglass(s: S, x: number, y: number, w: number, h: number, full = 0.5, gold = false): void {
  const half = w / 2;
  const mid = y + h / 2;
  const frame = gold ? GOLD : TRIM;
  fill(s, () => {
    s.poly(
      [
        [x - half + 1, y + 1],
        [x + half, y + 1],
        [x + 0.9, mid],
        [x + half, y + h - 1],
        [x - half + 1, y + h - 1],
        [x + 0.1, mid],
      ],
      HOUR[4],
    );
  });
  fill(s, () => {
    const top = y + 1 + (h / 2 - 1) * (1 - full);
    for (let yy = Math.ceil(top); yy < mid; yy++) {
      const k = (mid - yy) / (h / 2 - 1);
      const hw = Math.max(0, (half - 1) * k);
      seg(s, x - hw + 0.5, yy, x + hw, yy, yy === Math.ceil(top) ? SAND.light : SAND.shade);
    }
    seg(s, x, mid, x, y + h - 2, SAND.light);
    const pile = Math.max(1, Math.round((h / 2 - 1) * (1 - full)));
    for (let j = 0; j < pile; j++) {
      const yy = y + h - 2 - j;
      const hw = Math.max(0.5, half - 1.5 - j);
      seg(s, x - hw + 1, yy, x + hw - 0.5, yy, j === pile - 1 ? SAND.light : SAND.shade);
    }
    s.set(x - half + 2, y + 2, WHITE);
  });
  fill(s, () => {
    seg(s, x - half, y, x + half, y, frame);
    seg(s, x - half, y + h, x + half, y + h, frame);
    s.set(x - half, y - 0, gold ? GOLD_LIGHT : SAND.light);
  });
}

/** warm sand motes at these points */
export function motes(s: S, pts: readonly Point[], c: Color = SAND.light, shade: Color = SAND.shade): void {
  fill(s, () => {
    for (const [i, [x, y]] of pts.entries()) s.set(x, y, i % 3 === 2 ? shade : c);
  });
}

/** a gear of radius r round (cx, cy), `teeth` teeth, with an axle hole */
export function gear(s: S, cx: number, cy: number, r: number, c: Color, light: Color, teeth = 6, turn = 0): void {
  fill(s, () => {
    s.dot(cx, cy, r - 0.6, c);
    for (let i = 0; i < teeth; i++) {
      const a = turn + (i / teeth) * TAU;
      if (r >= 4) s.dot(cx + Math.cos(a) * (r - 0.2), cy + Math.sin(a) * (r - 0.2), r * 0.28, c);
      else s.set(cx + Math.cos(a) * (r + 0.4), cy + Math.sin(a) * (r + 0.4), c);
    }
    s.set(cx - r * 0.45, cy - r * 0.45, light);
    s.set(cx, cy, 0);
  });
}

/** a four-point glint centred on the pixel (x, y), its arms r long, white at the heart */
export function glint(s: S, x: number, y: number, r: number, c: Color = WHITE): void {
  fill(s, () => {
    seg(s, x - r, y, x + r, y, c);
    seg(s, x, y - r, x, y + r, c);
    s.set(x, y, WHITE);
  });
}

/** the clockwork wren, twelve pixels wide, facing right: a sand-brass body, a teal wing and tail, a winding key on its back */
const WREN = [
  "...KKK.HH...",
  "....K.HHEHbb",
  "T...KBBHH...",
  "TTBBWWWBB...",
  ".TBBBWWBB...",
  "...BBBBB....",
  "....L..L....",
] as const;
/** a wren a third the size, in flight */
const TINY_WREN = ["W.....", "WW.HH.", ".BBHEb", "..BB.."] as const;
/** the wren with its body lit gold */
const wrenColors = (gold: boolean): Record<string, Color> => ({
  K: gold ? GOLD_LIGHT : HOUR[4],
  H: gold ? GOLD_LIGHT : SAND.light,
  B: gold ? GOLD : SAND.shade,
  W: HOUR[3],
  T: HOUR[2],
  E: WHITE,
  b: TRIM,
  L: WOOD,
});
const flip = (rows: readonly string[]): string[] => rows.map((r) => [...r].reverse().join(""));

/** a clockwork wren, its feet at (x, y); face -1 turns it to the left */
export function wren(s: S, x: number, y: number, gold = false, face = 1): void {
  fill(s, () => s.pixels(face < 0 ? flip(WREN) : WREN, wrenColors(gold), x - 6, y - 6));
}

/** a small wren in flight, its top left corner at (x, y) */
export function tinyWren(s: S, x: number, y: number, gold = false, face = 1): void {
  fill(s, () => s.pixels(face < 0 ? flip(TINY_WREN) : TINY_WREN, wrenColors(gold), x, y));
}

/** the hour keeper, thirteen pixels tall, facing right: a silver bun, deep brown skin, a slate plum robe trimmed sand-gold */
const MAGE = [
  ".hH....",
  "hHHH...",
  "hHSS...",
  ".HSE...",
  "..SS...",
  ".RTR...",
  ".RRRS..",
  ".rRRR..",
  ".rRT...",
  ".rRRR..",
  "rrRRR..",
  "rrRRRR.",
  "TTTTTT.",
] as const;
const MAGE_COLORS: Record<string, Color> = {
  h: hex("#9aa0b0"),
  H: HAIR,
  S: SKIN,
  E: WHITE,
  R: ROBE_LIGHT,
  r: ROBE,
  T: TRIM,
};
/** her ghost, an echo of her in pale teal */
const GHOST_COLORS: Record<string, Color> = {
  h: HOUR[3],
  H: HOUR[4],
  S: HOUR[3],
  E: HOUR[5],
  R: HOUR[3],
  r: HOUR[2],
  T: HOUR[4],
};

/** the hour keeper with her staff upright before her, her hem at (x, y); a ghost draws her in pale teal */
export function mage(s: S, x: number, y: number, ghost = false, withStaff = true): void {
  if (withStaff) {
    fill(s, () => seg(s, x + 2, y - 10, x + 2, y, ghost ? HOUR[2] : WOOD_LIGHT));
    fill(s, () => {
      const c = ghost ? HOUR[4] : ACCENT;
      s.pixels([".c.", "c.c", ".c."], { c }, x + 1, y - 13);
    });
  }
  fill(s, () => s.pixels(MAGE, ghost ? GHOST_COLORS : MAGE_COLORS, x - 3, y - 12));
}

/** the hour keeper drawn small, five pixels wide and ten tall, for icons that hold several of her */
const SMALL_MAGE = [".hH..", "hHSS.", ".HSE.", "..S..", ".RTR.", "rRRR.", "rRRR.", "rRTR.", "rRRRR", "TTTTT"] as const;

/** the small hour keeper, her hem at (x, y); a ghost draws her in pale teal */
export function smallMage(s: S, x: number, y: number, ghost = false): void {
  fill(s, () => s.pixels(SMALL_MAGE, ghost ? GHOST_COLORS : MAGE_COLORS, x - 2, y - 9));
}

/**
 * a big clock hand from its pivot at (cx, cy) to the tip at (x, y): a shaft swelling to a diamond near the tip, with a
 * tail ring behind the pivot
 */
export function clockHand(s: S, cx: number, cy: number, x: number, y: number, c: Color, light: Color): void {
  const L = Math.hypot(x - cx, y - cy) || 1;
  const ux = (x - cx) / L;
  const uy = (y - cy) / L;
  const dx = cx + ux * (L - 3);
  const dy = cy + uy * (L - 3);
  fill(s, () => {
    s.stroke(cx - ux * 1.5, cy - uy * 1.5, dx, dy, 0.5, c);
    s.poly(
      [
        [x + 0.5, y + 0.5],
        [dx - uy * 1.8 + 0.5, dy + ux * 1.8 + 0.5],
        [cx + ux * (L - 5) + 0.5, cy + uy * (L - 5) + 0.5],
        [dx + uy * 1.8 + 0.5, dy - ux * 1.8 + 0.5],
      ],
      c,
    );
    seg(s, cx + ux * (L - 4.5), cy + uy * (L - 4.5), x - ux, y - uy, light);
    s.set(x, y, WHITE);
  });
  fill(s, () => {
    s.dot(cx, cy, 1.3, SAND.shade);
    s.set(cx, cy, WHITE);
  });
}

/** a teal blade falling point down, its point at (x, y), len long */
export function blade(s: S, x: number, y: number, len: number, gold = false): void {
  fill(s, () => {
    s.poly(
      [
        [x + 0.5, y + 0.5],
        [x + 2, y - 2],
        [x + 1.5, y - len],
        [x - 0.5, y - len],
        [x - 1, y - 2],
      ],
      gold ? HOUR[4] : HOUR[3],
    );
    seg(s, x, y - 1, x, y - len + 1, gold ? WHITE : HOUR[5]);
    seg(s, x - 1.5, y - len, x + 2.5, y - len, gold ? GOLD : TRIM);
  });
}

/** a backwards arrow round (cx, cy): an arc from a0 back to a1 with its head at a1, turning anticlockwise */
export function rewindArrow(
  s: S,
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  c: Color,
  light: Color,
): void {
  fill(s, () => {
    const n = Math.ceil(Math.abs(a1 - a0) * r * 2);
    for (let k = 0; k <= n; k++) {
      const a = a0 + ((a1 - a0) * k) / n;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.5, k < n * 0.4 ? c : light);
    }
  });
  const dir = Math.sign(a1 - a0);
  const tx = cx + Math.cos(a1) * r;
  const ty = cy + Math.sin(a1) * r;
  const vx = -Math.sin(a1) * dir;
  const vy = Math.cos(a1) * dir;
  const nx = Math.cos(a1);
  const ny = Math.sin(a1);
  fill(s, () => {
    s.poly(
      [
        [tx + vx * 2.2 + 0.5, ty + vy * 2.2 + 0.5],
        [tx + nx * 2 + 0.5, ty + ny * 2 + 0.5],
        [tx - nx * 2 + 0.5, ty - ny * 2 + 0.5],
      ],
      light,
    );
    s.set(tx + vx * 1.5, ty + vy * 1.5, WHITE);
  });
}

/** a sundial lying on the floor round (cx, y): a pale stone ellipse rx across and ry deep, hour marks, and a gnomon casting its shadow */
export function sundial(s: S, cx: number, y: number, rx: number, ry: number, gold = false): void {
  const ellipse = (rr: number, k: number): Point[] =>
    Array.from({ length: 24 }, (_, i): Point => {
      const a = (i / 24) * TAU;
      return [cx + Math.cos(a) * rr, y + Math.sin(a) * rr * k];
    });
  fill(s, () => {
    s.poly(ellipse(rx, ry / rx), gold ? GOLD_DARK : SAND.shade);
    s.poly(
      ellipse(rx, ry / rx).map(([px, py]): Point => [px, py - 1]),
      gold ? GOLD_LIGHT : SAND.light,
    );
  });
  fill(s, () => {
    for (let k = 0; k < 7; k++) {
      const a = Math.PI + (k / 6) * Math.PI;
      s.set(Math.round(cx + Math.cos(a) * (rx - 1.5)), Math.round(y - 1 + Math.sin(a) * (ry - 1.2)), HOUR[2]);
    }
    seg(s, cx, y - 1, cx + rx * 0.7, y - 1 + ry * 0.35, HOUR[1]);
  });
  fill(s, () => {
    s.poly(
      [
        [cx - 2.5, y - 0.5],
        [cx + 1.5, y - 0.5],
        [cx - 2.5, y - ry - 4.5],
      ],
      gold ? GOLD : HOUR[3],
    );
    seg(s, cx - 2, y - ry - 3, cx - 2, y - 1, gold ? WHITE : HOUR[5]);
  });
}

/** a sun of radius r round (cx, cy) with eight short rays */
export function sun(s: S, cx: number, cy: number, r: number, rays = r + 2): void {
  fill(s, () => {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      seg(
        s,
        cx + Math.cos(a) * (r + 0.8),
        cy + Math.sin(a) * (r + 0.8),
        cx + Math.cos(a) * rays,
        cy + Math.sin(a) * rays,
        GOLD,
      );
    }
  });
  fill(s, () => {
    s.dot(cx, cy, r, GOLD);
    s.dot(cx - r * 0.25, cy - r * 0.25, r * 0.6, GOLD_LIGHT);
    s.set(cx - r * 0.45, cy - r * 0.45, WHITE);
  });
}

/** grey dust settling at these points */
export function dust(s: S, pts: readonly Point[]): void {
  fill(s, () => {
    for (const [i, [x, y]] of pts.entries()) s.set(x, y, i % 2 ? hex("#8a8496") : hex("#c4bcc8"));
  });
}
