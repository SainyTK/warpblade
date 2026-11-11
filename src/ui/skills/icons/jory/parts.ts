import { COIN_GOLD, DRUM, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, mix, WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { arc, fill } from "../parts";

/**
 * Small drawing parts for Jory's 16 x 16 icons: his felt mallets and oxblood war drum, beat rings and sound waves,
 * cymbals, boots, notes, the gong, the tuning fork, the iron metronome, the war horn, an ear, the curtain and the
 * drummer himself. An evolved icon draws the same parts lit in gold.
 */
type S = SpriteCanvas;
type Point = readonly [number, number];
/** his cobalt, deep to white-hot */
export const B = PAL.beat;
export { DRUM };
export const GOLD = COIN_GOLD[3];
export const GOLD_LIGHT = COIN_GOLD[4];
export const GOLD_DARK = COIN_GOLD[2];
/** the mallet shafts' dark wood */
export const WOOD = hex("#4a2e1c");
export const WOOD_LIGHT = hex("#7a5236");
/** the drum's pale hide heads and pewter hoops */
export const HIDE = hex("#e8dcc0");
export const HIDE_SHADE = hex("#bcae90");
export const PEWTER = hex("#9a9ca8");
export const PEWTER_LIGHT = hex("#d4d6de");
export const PEWTER_DARK = hex("#5e606c");
/** the metronome's iron */
export const IRON = hex("#4a4c5a");
export const IRON_LIGHT = hex("#7e8094");
/** cymbal and gong bronze */
export const BRONZE = hex("#c08a3a");
export const BRONZE_LIGHT = hex("#f0c878");
export const BRONZE_DARK = hex("#7a5222");
/** his boots' leather */
export const BOOT = hex("#5a3a26");
export const BOOT_LIGHT = hex("#8a5e3e");
export const SKIN = hex("#b07a52");
export const SKIN_LIGHT = hex("#d8a47a");
/** his tunic */
export const TUNIC = hex("#3a3e5e");
/** the clash of Dissonance */
export const CLASH = hex("#ff6a5a");

/** the cobalt of a plain icon, the gold of an evolved one, and their light */
export const cobalt = (gold: boolean): Color => (gold ? GOLD : B[3]);
export const glint = (gold: boolean): Color => (gold ? GOLD_LIGHT : B[5]);
export const pale = (gold: boolean): Color => (gold ? GOLD_LIGHT : B[4]);

/** the night blue of the disc behind his icons */
export const DISC = mix(B[0], B[1], 0.55);

/** the beat behind every one of his icons: a soft cobalt disc, lit at its upper edge */
export function beatDisc(s: S, gold = false): void {
  fill(s, () => s.dot(8, 8.5, 7, DISC));
  fill(s, () => {
    for (let a = -2.6; a <= -0.5; a += 0.25) s.set(8 + Math.cos(a) * 7, 8.5 + Math.sin(a) * 7, gold ? GOLD : B[2]);
  });
}

/** a line one pixel wide from (x0, y0) to (x1, y1), in pixel coordinates */
export function seg(s: S, x0: number, y0: number, x1: number, y1: number, c: Color): void {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))));
  for (let i = 0; i <= n; i++) s.set(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), c);
}

/** a floor line from x0 to x1 at y */
export function floor(s: S, x0: number, x1: number, y: number, c: Color = B[2]): void {
  fill(s, () => seg(s, x0, y, x1, y, c));
}

/** a mallet from the grip at (x0, y0) to its felt head at (x1, y1): a dark wood shaft, a round cobalt head lit at its
 *  top */
export function mallet(s: S, x0: number, y0: number, x1: number, y1: number, gold = false, head = 1.8): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => {
    s.stroke(x0, y0, x1 - ux * head, y1 - uy * head, 0.6, WOOD_LIGHT);
    s.set(x0, y0, WOOD);
  });
  fill(s, () => {
    s.dot(x1, y1, head, cobalt(gold));
    s.set(x1 - 0.8, y1 - 0.2, pale(gold));
    s.set(x1 - 0.2, y1 - 0.8, pale(gold));
    s.set(x1 - 0.8, y1 - 0.8, gold ? WHITE : B[5]);
  });
}

/**
 * The war drum standing with its bottom hoop at row `bottom`, 2r wide round cx and h rows from bottom to top hoop:
 * a pale hide head seen from above in a pewter rim, an oxblood shell laced in a cobalt zigzag between the hoops.
 */
export function drum(s: S, cx: number, bottom: number, r: number, h: number, gold = false): void {
  const x0 = Math.round(cx - r);
  const x1 = Math.round(cx + r) - 1;
  const top = bottom - h;
  const lace = cobalt(gold);
  fill(s, () => {
    for (let x = x0 + 2; x <= x1 - 2; x++) s.set(x, top - 2, PEWTER);
    s.set(x0 + 1, top - 1, PEWTER_LIGHT);
    s.set(x1 - 1, top - 1, PEWTER);
    for (let x = x0 + 2; x <= x1 - 2; x++) s.set(x, top - 1, x <= x0 + 3 ? WHITE : x >= x1 - 3 ? HIDE_SHADE : HIDE);
    for (let x = x0; x <= x1; x++) s.set(x, top, x <= x0 + 1 ? PEWTER_LIGHT : x === x1 ? PEWTER_DARK : PEWTER);
    for (let y = top + 1; y < bottom; y++)
      for (let x = x0; x <= x1; x++) s.set(x, y, x === x0 ? DRUM[3] : x >= x1 - 1 ? DRUM[1] : DRUM[2]);
    const span = bottom - top - 2;
    if (span > 0)
      for (let x = x0; x <= x1; x++) {
        const k = (x - x0) % (2 * span);
        s.set(x, top + 1 + (k <= span ? k : 2 * span - k), lace);
      }
    for (let x = x0; x <= x1; x++) s.set(x, bottom, x === x0 ? PEWTER_LIGHT : x >= x1 - 1 ? PEWTER_DARK : PEWTER);
  });
}

/** a ring of sound round (cx, cy), from angle a0 to a1, cobalt or gold */
export function soundRing(s: S, cx: number, cy: number, r: number, gold = false, w = 0.45, a0 = 0, a1 = TAU): void {
  arc(s, cx, cy, r, a0, a1, cobalt(gold), w);
}

/** a flat ring lying on the floor round (cx, y), rx across and ry deep */
export function beatRing(s: S, cx: number, y: number, rx: number, ry: number, c: Color): void {
  fill(s, () => {
    const n = Math.ceil(rx * 7);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      s.set(Math.round(cx + Math.cos(a) * rx - 0.5), Math.round(y + Math.sin(a) * ry), c);
    }
  });
}

/** n sound wave arcs opening from (x, y) along dir (1 right, -1 left), brightest nearest */
export function waves(
  s: S,
  x: number,
  y: number,
  dir: number,
  n: number,
  gold = false,
  r0 = 2,
  step = 2,
  spread = 0.8,
): void {
  const ramp = gold ? [GOLD_LIGHT, GOLD, GOLD_DARK] : [B[5], B[4], B[3]];
  const mid = dir > 0 ? 0 : Math.PI;
  for (let i = 0; i < n; i++)
    arc(s, x, y, r0 + i * step, mid - spread, mid + spread, ramp[Math.min(i, ramp.length - 1)], 0.45);
}

/** a cymbal tipped over (cx, cy), r across, its edge lit and a dome at its middle */
export function cymbal(s: S, cx: number, cy: number, r: number, tilt: number, gold = false): void {
  fill(s, () => {
    s.stroke(cx - r, cy + tilt, cx + r, cy - tilt, 0.85, gold ? GOLD : BRONZE);
    s.stroke(
      cx - r + 1,
      cy + tilt * 0.8 - 0.6,
      cx + r - 1,
      cy - tilt * 0.8 - 0.6,
      0.35,
      gold ? GOLD_LIGHT : BRONZE_LIGHT,
    );
  });
  fill(s, () => {
    s.dot(cx, cy - 0.8, 1, gold ? GOLD : BRONZE);
    s.set(cx - 0.4, cy - 1.2, WHITE);
  });
}

/** short white crash lines bursting out of (x, y) */
export function crash(s: S, x: number, y: number, r: number, c: Color = WHITE): void {
  fill(s, () => {
    for (let k = 0; k < 8; k += 1) {
      const a = (k / 8) * TAU + 0.4;
      seg(s, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, x + Math.cos(a) * r, y + Math.sin(a) * r, c);
    }
  });
}

/** a boot six pixels wide and five tall, sole at y and heel at x, toe pointing along dir; gold lights its cuff and sole */
const BOOT_ROWS = ["ccc...", "LBB...", "LBBB..", "LBBBBB", "dddddd"] as const;
const flipRows = (rows: readonly string[]): string[] => rows.map((r) => [...r].reverse().join(""));
export function boot(s: S, x: number, y: number, dir = 1, gold = false): void {
  const rows = dir < 0 ? flipRows(BOOT_ROWS) : BOOT_ROWS;
  fill(s, () =>
    s.pixels(
      rows,
      { c: gold ? GOLD : BOOT_LIGHT, L: BOOT_LIGHT, B: BOOT, d: gold ? GOLD_LIGHT : WOOD },
      dir < 0 ? x - 5 : x,
      y - 4,
    ),
  );
}

/** an eighth note, its head at (x, y): a round head, a stem and a flag */
export function note(s: S, x: number, y: number, c: Color, light: Color = WHITE, flag = true): void {
  fill(s, () => {
    s.dot(x, y, 1.3, c);
    seg(s, x + 1, y, x + 1, y - 5, c);
    if (flag) seg(s, x + 2, y - 4, x + 3, y - 2, c);
    s.set(x - 1, y - 1, light);
  });
}

/** a gong hanging in its wooden frame: two posts on the floor, a crossbar, cords and a bronze disc lit at its rim */
export function gong(s: S, cx: number, cy: number, r: number, gold = false): void {
  const top = cy - r - 2;
  fill(s, () => {
    s.block(Math.round(cx - r - 2), top, WOOD_LIGHT, 1, 15 - top);
    s.block(Math.round(cx + r + 1), top, WOOD_LIGHT, 1, 15 - top);
    s.block(Math.round(cx - r - 3), top, WOOD_LIGHT, Math.round(2 * r + 6), 1);
  });
  fill(s, () => {
    s.dot(cx, cy, r, gold ? GOLD : BRONZE);
  });
  fill(s, () => {
    s.dot(cx, cy, r - 1.6, gold ? GOLD_DARK : BRONZE_DARK);
  });
  fill(s, () => {
    s.dot(cx, cy, 1.1, gold ? GOLD_LIGHT : BRONZE_LIGHT);
    s.set(cx - r * 0.6, cy - r * 0.6, WHITE);
  });
}

/** a tuning fork standing on its stem at (x, bottom): a short stem, a U and two tall tines */
export function fork(s: S, x: number, bottom: number, h: number, gold = false): void {
  const c = gold ? GOLD : PEWTER;
  const light = gold ? GOLD_LIGHT : PEWTER_LIGHT;
  fill(s, () => {
    s.block(x, bottom - 3, c, 1, 4);
    s.block(x - 1, bottom - 4, c, 3, 1);
    s.block(x - 2, bottom - h, light, 1, h - 4);
    s.block(x + 2, bottom - h, c, 1, h - 4);
    s.set(x - 1, bottom - 4, light);
  });
}

/** an iron metronome on its base at (x, bottom), h tall: a tapering body lit down its left edge, a dark face slot,
 *  its arm swung `lean` pixels over at the tip with a cobalt weight on it */
export function metronome(s: S, x: number, bottom: number, h: number, lean: number, gold = false): void {
  const pivot = bottom - 2;
  const tipY = bottom - h - 3;
  fill(s, () => {
    s.poly(
      [
        [x - 1, bottom - h],
        [x + 2, bottom - h],
        [x + 4, bottom + 1],
        [x - 3, bottom + 1],
      ],
      IRON,
    );
    seg(s, x - 1, bottom - h, x - 3, bottom, IRON_LIGHT);
    s.block(x, bottom - h + 2, B[0], 1, h - 3);
  });
  fill(s, () => {
    s.stroke(x + 0.5, pivot, x + 0.5 + lean, tipY, 0.4, gold ? GOLD_LIGHT : WHITE);
  });
  const u = 0.6;
  const wx = Math.round(x + lean * u);
  const wy = Math.round(pivot + (tipY - pivot) * u);
  fill(s, () => {
    s.block(wx - 1, wy - 1, cobalt(gold), 3, 2);
    s.set(wx - 1, wy - 1, glint(gold));
  });
}

/** a ghostly war horn from its fine tip at (x0, y0) to its bell at (x1, y1), sagging in a curve between them, a band
 *  round its middle and the bell's mouth bright */
export function horn(s: S, x0: number, y0: number, x1: number, y1: number, gold = false): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => s.taper(x0, y0, x1, y1, 0.6, 2.4, gold ? GOLD : B[3], -2.2));
  fill(s, () => {
    s.stroke(x1 + uy * 2.4, y1 - ux * 2.4, x1 - uy * 2.4, y1 + ux * 2.4, 0.55, glint(gold));
  });
  fill(s, () => {
    const mx = (x0 + x1) / 2 - uy * 2.2;
    const my = (y0 + y1) / 2 + ux * 2.2;
    s.stroke(mx + uy * 1.6, my - ux * 1.6, mx - uy * 1.6, my + ux * 1.6, 0.4, gold ? GOLD_DARK : B[2]);
  });
}

/** a crescent moon opening to the right round (cx, cy), thickest at its middle */
export function moon(s: S, cx: number, cy: number, r: number, gold = false): void {
  fill(s, () => {
    for (let u = 0; u <= 1; u += 0.05) {
      const a = Math.PI * 0.4 + Math.PI * 1.2 * u;
      s.dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.3 + Math.sin(Math.PI * u) * 0.75, gold ? GOLD : B[4]);
    }
  });
  fill(s, () => s.set(cx - r, cy, gold ? GOLD_LIGHT : B[5]));
}

/** an ear seen from the side, its lobe at the bottom, opening to the right */
const EAR_ROWS = [".SSSS.", "SLLLSS", "SL..SS", "SL.S.S", "SL.SS.", ".SL.S.", "..SSS.", "..SS.."] as const;
export function ear(s: S, x: number, y: number): void {
  fill(s, () => s.pixels(EAR_ROWS, { S: SKIN, L: SKIN_LIGHT }, x, y));
}

/** the drummer from the front, nine wide and twelve tall: mallets raised either side of his head, broad shoulders,
 *  the drum on his belly and his legs planted */
const DRUMMER = [
  "F.......F",
  "Fa.....aF",
  ".a.HHH.a.",
  ".a.HHH.a.",
  ".abbbbba.",
  "..bbbbb..",
  ".phhhhhp.",
  ".DlDDDlD.",
  ".DDlDlDD.",
  ".ppppppp.",
  "..bb.bb..",
  "..bb.bb..",
] as const;
/** a small drummer, five wide and eight tall, for icons that hold several */
const SMALL_DRUMMER = ["F...F", "a.H.a", ".bbb.", "phhhp", "DlDlD", "ppppp", ".b.b.", ".b.b."] as const;

/** the drummer's colours: a man of flesh, or a ghost of cobalt light whose mallets, hoops and lacing gold lights */
const drummerColors = (ghost: boolean, gold: boolean): Record<string, Color> =>
  ghost
    ? {
        F: glint(gold),
        a: B[3],
        H: B[4],
        b: B[2],
        p: pale(gold),
        h: B[5],
        D: B[2],
        l: cobalt(gold),
      }
    : {
        F: B[3],
        a: SKIN,
        H: SKIN,
        b: TUNIC,
        p: PEWTER,
        h: HIDE,
        D: DRUM[2],
        l: B[3],
      };

/** the drummer, feet centred at (x, y); ghost draws him in cobalt light, gold lights a ghost for an evolution */
export function drummer(s: S, x: number, y: number, ghost = false, gold = false): void {
  fill(s, () => s.pixels(DRUMMER, drummerColors(ghost, gold), x - 4, y - 11));
}

/** a small drummer, feet centred at (x, y) */
export function smallDrummer(s: S, x: number, y: number, ghost = false, gold = false): void {
  fill(s, () => s.pixels(SMALL_DRUMMER, drummerColors(ghost, gold), x - 2, y - 7));
}

/** a stage curtain hanging from the top: a valance and two drapes gathered in at their middles, folds dark */
export function curtain(s: S, gold = false): void {
  const drape = (pts: readonly Point[]): void => {
    s.poly(pts, DRUM[2]);
  };
  fill(s, () => {
    drape([
      [1, 2],
      [6, 2],
      [3.5, 9],
      [5, 15],
      [1, 15],
    ]);
    drape([
      [10, 2],
      [15, 2],
      [15, 15],
      [11, 15],
      [12.5, 9],
    ]);
    seg(s, 3, 3, 2, 14, DRUM[1]);
    seg(s, 13, 3, 14, 14, DRUM[1]);
    seg(s, 1, 4, 1, 14, DRUM[3]);
    seg(s, 11, 4, 11, 8, DRUM[3]);
  });
  fill(s, () => {
    s.block(1, 1, DRUM[1], 14, 2);
    for (let x = 1; x < 15; x += 2) s.set(x, 1, DRUM[3]);
  });
  fill(s, () => {
    s.set(3, 9, gold ? GOLD : PEWTER_LIGHT);
    s.set(12, 9, gold ? GOLD : PEWTER_LIGHT);
  });
}

/** a big note with a jagged stem, its head at (x, y): the clashing note of Dissonance */
export function jaggedNote(s: S, x: number, y: number, c: Color, light: Color = WHITE): void {
  fill(s, () => {
    s.dot(x, y, 2, c);
    seg(s, x + 2, y, x + 1, y - 3, c);
    seg(s, x + 1, y - 3, x + 3, y - 6, c);
    seg(s, x + 3, y - 6, x + 2, y - 9, c);
    seg(s, x + 2, y - 9, x + 5, y - 6, c);
    s.set(x - 1, y - 1, light);
  });
}
