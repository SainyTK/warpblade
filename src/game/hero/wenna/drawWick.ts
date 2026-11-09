import { COIN_GOLD, PAL, SMOKE_RAMP, WAX } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import { glow, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Wick } from "../../../types/wenna";
import { WHITE } from "../../../utils/color";
import { clamp, ease, lerp, smooth } from "../../../utils/math";
import { game } from "../../state";
import { LitShape } from "./litShape";

const V = PAL.wick;
const GOLD = COIN_GOLD[3];
/** the dark round every wax figure and its dot eyes */
const INK = V[0];

/** a Wick's body at full size: rows tall, and its columns either side of its middle (which sits half a pixel left) */
const BODY_ROWS = 7;
const BODY_HALF = 3;
/** it never shrinks below this share of its size, so the last seconds still read */
const LEAST_SCALE = 0.55;

/**
 * The flame head, rows top to bottom, five wide from behind to ahead of the Wick's facing: 2 to 5 the lamp violet ramp,
 * G its gold core. Three flicker shapes, the hurt gutter blown back, and the bite stretched forward.
 */
const FLICKER: readonly (readonly string[])[] = [
  ["..3..", "..4..", ".343.", ".454.", ".3G3."],
  [".3...", ".34..", ".343.", ".454.", ".3G3."],
  ["...3.", "..43.", ".343.", ".454.", ".3G3."],
];
const GUTTER = ["3....", ".32..", ".343.", ".454.", ".3G3."];
const BITE = ["...34", "..445", ".3454", ".455.", ".3G3."];

/** a flame letter's colour, lifted brighter by `lift` steps (a bite's flash, a paler extra Wick) */
function flameColor(ch: string, lift: number): Color {
  if (ch === "G") return lift >= 2 ? WHITE : GOLD;
  const i = Number(ch) + lift;
  return i > 5 ? WHITE : V[i];
}

/** what a Wick is doing this frame, read from its fields */
interface WickLook {
  /** its size from the shrink of its last seconds */
  scale: number;
  /** 0 to 1 out of its pool, and 0 to 1 into its puddle */
  risen: number;
  melted: number;
  /** the waddle's frame, or -1 standing */
  waddle: number;
  /** 0 to 1 into a bite's lean */
  lean: number;
  hurt: boolean;
}

function lookOf(w: Wick): WickLook {
  const walking = w.ground && Math.abs(w.vx) > 1;
  return {
    scale: clamp(w.life / WICK.shrink, LEAST_SCALE, 1),
    risen: w.t < WICK.rise ? ease.outQuad(clamp(w.t / WICK.rise)) : 1,
    melted: w.melt >= 0 ? clamp(w.melt / WICK.melt) : 0,
    waddle: walking ? Math.floor(game.t * 8) % 2 : -1,
    lean: w.lunge > 0 ? Math.sin(clamp(w.lunge / WICK.lunge) * Math.PI * 0.5 + 0.35) : 0,
    hurt: w.hurt > 0,
  };
}

/** a wax pool round the feet: a flat oval lit along its top, `half` pixels either side */
function pool(x: number, y: number, half: number, alpha = 1): void {
  for (let dx = -half; dx <= half - 1; dx++) {
    const edge = dx === -half || dx === half - 1;
    px(x + dx, y - 1, edge ? WAX[0] : WAX[1], alpha);
    if (Math.abs(dx + 0.5) < half - 1.5) px(x + dx, y - 2, dx < 0 ? WAX[3] : WAX[2], alpha);
  }
}

/** a curl of smoke rising from a melt, thinning as it goes */
function smokeCurl(x: number, y: number, k: number, puffs: number, spread: number): void {
  for (let i = 0; i < puffs; i++) {
    const u = clamp(k * 1.4 - i * 0.12);
    if (u <= 0) continue;
    const rise = u * (6 + i * 3) * spread;
    const sway = Math.sin(u * 7 + i * 1.7) * 1.5 * spread;
    px(x + sway, y - rise, SMOKE_RAMP[Math.min(SMOKE_RAMP.length - 1, 1 + i)], (1 - u) * 0.85);
  }
}

/** the row of three health pips over a hurt Wick, on a dark strip */
function healthPips(x: number, y: number, share: number): void {
  for (let dx = -3; dx <= 3; dx++) px(x + dx, y, INK);
  for (let i = 0; i < 3; i++) {
    const fill = clamp(share * 3 - i);
    px(x - 2 + i * 2, y, fill >= 0.999 ? V[4] : fill > 0 ? V[3] : V[1]);
  }
}

/**
 * A Wick in the world, about 12 px tall: an ivory wax body with a darker base and a drip down its lit side, two stubby
 * arms, two dark dot eyes and a violet flame for a head with a gold core, facing its way. It rises out of a pool when
 * lit, waddles as it walks, leans in with its flame stretched forward to bite, gutters back when hurt, shrinks over its
 * last seconds, shows three health pips once hurt, and melts into a puddle with a curl of smoke at its end. A Wick lit
 * past the cap glows a touch paler.
 */
export function drawWick(w: Wick): void {
  place();
  const o = lookOf(w);
  const x = Math.round(w.x);
  const y = Math.round(w.y);
  const f = w.face < 0 ? -1 : 1;
  /** a column `u` ahead of the Wick's middle, in the world */
  const at = (u: number): number => (f > 0 ? x + u : x - 1 - u);
  const narrow = o.scale < 0.75;
  const half = narrow ? BODY_HALF - 1 : BODY_HALF;
  const full = Math.max(4, Math.round(BODY_ROWS * o.scale)) - (o.waddle === 1 ? 1 : 0);
  const rows = Math.max(1, Math.round(full * (1 - o.melted)));
  const spread = Math.round(o.melted * 4);
  const sink = Math.round((1 - o.risen) * (full + 5));
  const leanBy = (row: number) => Math.round(o.lean * 2 * (row / Math.max(1, rows - 1)));
  const shape = new LitShape();
  for (let row = 0; row < rows; row++) {
    const yy = y - 1 - row + sink;
    const top = row === rows - 1 && rows > 2;
    const wide = half + (row === 0 ? 1 : 0) + Math.round(spread * (1 - row / rows));
    const from = -wide + (top ? 1 : 0);
    const to = wide - 1 - (top ? 1 : 0);
    const shift = leanBy(row) * f;
    const base = row < 2;
    for (let u = from; u <= to; u++)
      shape.lit(x + u + shift, yy, base ? WAX[1] : WAX[2], base ? WAX[2] : WAX[3], base ? WAX[0] : WAX[1]);
  }
  const topY = y - rows + sink;
  if (o.melted < 0.5 && rows >= 4) {
    // a drip running down the lit side, the arms, and the eyes two rows under the top
    shape.lit(x - half - 1 + leanBy(rows - 2) * f, topY + 2, WAX[3], WAX[3], WAX[2]);
    shape.lit(x - half - 1 + leanBy(rows - 3) * f, topY + 3, WAX[2], WAX[3], WAX[1]);
    const armRow = (side: number) => topY + 3 - (o.waddle >= 0 && (o.waddle === 0) === side > 0 ? 1 : 0);
    const reach = o.lean > 0.4 ? 2 : 1;
    const shift = leanBy(rows - 3) * f;
    for (let k = 1; k <= reach; k++)
      shape.lit(at(half - 1 + k) + shift, armRow(1) - (k > 1 ? 1 : 0), WAX[2], WAX[3], WAX[1]);
    shape.lit(at(-half) + shift, armRow(-1), WAX[2], WAX[3], WAX[1]);
    const eyeShift = leanBy(rows - 2) * f;
    shape.set(at(-1) + eyeShift, topY + 1, INK);
    shape.set(at(1) + eyeShift, topY + 1, INK);
  }
  if (o.risen < 1 || o.melted > 0)
    pool(x, y, half + 2 + Math.round(o.melted * 4), o.risen < 1 ? 1 : 1 - o.melted * 0.3);
  shape.draw(INK, o.risen < 1 ? y - 1 : Number.POSITIVE_INFINITY);
  const flameRows = o.melted > 0 ? Math.round(5 * (1 - o.melted * 2.5)) : o.scale < 0.65 ? 3 : o.scale < 0.82 ? 4 : 5;
  const flameAt = { x: at(0) + leanBy(rows) * f, y: topY - 1 };
  if (flameRows > 0) {
    const flash = o.lean > 0.6 ? 2 : o.lean > 0 ? 1 : 0;
    const lift = flash + (w.extra ? 1 : 0);
    const flick = Math.floor(game.t * 10 + w.id * 0.7) % FLICKER.length;
    const art = o.hurt ? GUTTER : o.lean > 0 ? BITE : FLICKER[flick];
    const lines = art.slice(art.length - flameRows);
    const back = o.waddle === 1 ? -1 : 0;
    lines.forEach((line, j) => {
      const yy = flameAt.y - (lines.length - 1 - j);
      if (o.risen < 1 && yy >= y - 1) return;
      for (let c = 0; c < line.length; c++) {
        if (line[c] === ".") continue;
        const u = c - 2 + (j < lines.length - 2 ? back : 0);
        px(at(u) + leanBy(rows) * f, yy, flameColor(line[c], lift));
      }
    });
    const r = (o.lean > 0 ? 12 : 8) * o.scale;
    const k = (o.lean > 0 ? 0.55 : 0.3) * (1 - o.melted);
    glow(flameAt.x + 0.5, flameAt.y - 1, r, w.extra ? V[4] : V[3], k);
  }
  if (o.melted > 0.15) smokeCurl(at(0), topY - 1, (o.melted - 0.15) / 0.85, 4, 1);
  if (w.hp < w.max && w.melt < 0 && o.risen >= 1) healthPips(x, topY - 7, clamp(w.hp / w.max));
}

/** the giant's measure: its body rows and half widths at the foot and the shoulders, its flame, its arm */
const GREAT = { body: 34, foot: 10, shoulder: 7, flame: 14, arm: 20, fist: 3 } as const;

/** the great arm's angle ahead of the giant (up negative): raised up and back before the swing, down ahead after */
const ARM_FROM = -2.3;
const ARM_TO = 0.9;

/** the giant's flame: a tall tongue of violet, white at its heart and gold at its root, licking side to side */
function greatFlame(cx: number, base: number, size: number, f: number): void {
  const tall = Math.round(GREAT.flame * size);
  for (let v = 0; v < tall; v++) {
    const up = v / tall;
    const hw = 5.5 * size * (1 - up) ** 0.6 * Math.min(1, (up + 0.3) * 2.2);
    const off = Math.sin(game.t * 9 + v * 0.7) * up * 2 * f;
    const y = base - v;
    for (let u = Math.floor(-hw); u <= Math.ceil(hw); u++) {
      const d = Math.abs(u - off) / Math.max(hw, 0.5);
      if (d > 1) continue;
      const c = v < 3 && d < 0.3 ? GOLD : d < 0.35 ? (up > 0.6 ? V[4] : V[5]) : d < 0.65 ? V[4] : d < 0.9 ? V[3] : V[2];
      px(cx + u, y, c);
    }
  }
  glow(cx, base - tall * 0.4, 14 + 18 * size, V[3], 0.28 * size);
}

/** the wax across the giant's body, lit from the top left: a glint band, the body, the shade and the deep edge */
function greatTone(across: number, base: boolean): Color {
  // one step darker than a small Wick, so the ramp still reads under the ultimate's own light
  const step = across < 0.2 ? 2 : across < 0.7 ? 1 : 0;
  return WAX[Math.max(0, step - (base ? 1 : 0))];
}

/** a tapering limb of wax from one point to another */
function limb(shape: LitShape, x0: number, y0: number, x1: number, y1: number, r0: number, r1: number): void {
  const d = Math.hypot(x1 - x0, y1 - y0) || 1;
  for (let s = 0; s <= d; s += 0.5) {
    const u = s / d;
    const r = lerp(r0, r1, u);
    const cx = lerp(x0, x1, u);
    const cy = lerp(y0, y1, u);
    for (let oy = -r; oy <= r; oy++)
      for (let ox = -r; ox <= r; ox++)
        if (ox * ox + oy * oy <= r * r) shape.lit(cx + ox, cy + oy, WAX[1], WAX[2], WAX[0]);
  }
}

/** a violet arc trailing the fist along the path it just swept, brightest at its leading edge */
function smear(reach: (t: number) => readonly [number, number, number, number], k: number): void {
  const trail = 0.45;
  for (let i = 0; i <= 18; i++) {
    const back = (i / 18) * trail;
    const t = k - back;
    if (t < 0) break;
    const [, , x, y] = reach(t);
    const fade = 1 - back / trail;
    const c = i < 3 ? V[5] : i < 8 ? V[4] : V[3];
    px(Math.round(x), Math.round(y), c, 0.9 * fade);
    px(Math.round(x), Math.round(y) - 1, V[3], 0.5 * fade);
    px(Math.round(x), Math.round(y) + 1, V[2], 0.4 * fade);
  }
}

/** the flame lights the giant's crown and its lit shoulder violet */
function flameLight(ix: number, topY: number, rows: number, size: number): void {
  const reach = Math.min(rows, 7);
  for (let r = 0; r < reach; r++) {
    const k = (1 - r / reach) * 0.4 * size;
    for (let u = -GREAT.shoulder + 1; u <= 0; u++) px(ix + u, topY + r, V[4], k * (1 + u / GREAT.shoulder));
  }
}

/**
 * The Great Wick, about 48 px tall, its feet at (x, y): a giant wax figure with drips down its lit side, two dark eyes
 * and a roaring violet flame, rising out of a spreading pool (`rise` 0 to 1), swinging one great arm from up behind its
 * head forward and down across its reach (`swing` 0 to 1, a faint smear trailing the fist) and melting down into its
 * pool with a curl of smoke (`melt` 0 to 1), facing `face`.
 */
export function drawGreatWick(x: number, y: number, rise: number, swing: number, melt: number, face: number): void {
  place();
  const ix = Math.round(x);
  const iy = Math.round(y);
  const f = face < 0 ? -1 : 1;
  const at = (u: number): number => (f > 0 ? ix + u : ix - 1 - u);
  const risen = ease.outQuad(clamp(rise));
  const melted = clamp(melt);
  const rows = Math.max(2, Math.round(GREAT.body * (1 - melted * 0.92)));
  const sink = Math.round((1 - risen) * (GREAT.body + GREAT.flame));
  const spread = melted * 10;
  const shape = new LitShape();
  for (let row = 0; row < rows; row++) {
    const up = row / rows;
    // a heavy foot, a slight waist, rounded shoulders
    const top = Math.max(0, row - (rows - 5));
    const hw = lerp(GREAT.foot, GREAT.shoulder, Math.sqrt(up)) - top * top * 0.3 + spread * (1 - up);
    const yy = iy - 1 - row + sink;
    for (let u = Math.floor(-hw); u <= Math.ceil(hw); u++) {
      if (Math.abs(u + 0.5) > hw) continue;
      shape.lit(ix + u, yy, greatTone((u + 0.5 + hw) / (2 * hw), row < 3), WAX[2], WAX[0]);
    }
  }
  const topY = iy - rows + sink;
  let fist: [number, number] | null = null;
  if (melted < 0.4) {
    // drips run down its lit side and a darker one down its shaded side
    const drips: readonly (readonly [number, number, Color])[] = [
      [-5, 12, WAX[3]],
      [-2, 7, WAX[3]],
      [4, 9, WAX[1]],
    ];
    for (const [u, run, c] of drips) for (let k = 2; k < run; k++) shape.lit(ix + u, topY + k, c, c, c);
    for (const u of [1, 2, 5, 6]) {
      shape.set(at(u), topY + 6, INK);
      shape.set(at(u), topY + 7, INK);
    }
    // the great arm from its leading shoulder, bent at the elbow, the forearm trailing then whipping through
    const k = smooth(0, 1, swing);
    const sx = at(GREAT.shoulder - 2);
    const sy = topY + 10;
    const len = GREAT.arm * (1 - melted);
    const reach = (t: number): [number, number, number, number] => {
      const a = lerp(ARM_FROM, ARM_TO, t) + melted * 1.2;
      const fore = a + lerp(-0.9, 0.25, t);
      const ex = sx + Math.cos(a) * f * len * 0.55;
      const ey = sy + Math.sin(a) * len * 0.55;
      return [ex, ey, ex + Math.cos(fore) * f * len * 0.5, ey + Math.sin(fore) * len * 0.5];
    };
    const [ex, ey, fx, fy] = reach(k);
    limb(shape, sx, sy, ex, ey, 2.8, 2.2);
    limb(shape, ex, ey, fx, fy, 2.2, 1.8);
    for (let oy = -GREAT.fist; oy <= GREAT.fist; oy++)
      for (let ox = -GREAT.fist; ox <= GREAT.fist; ox++)
        if (ox * ox + oy * oy <= GREAT.fist * GREAT.fist + 1) shape.lit(fx + ox, fy + oy, WAX[2], WAX[3], WAX[1]);
    for (let oy = -2; oy <= 2; oy++) shape.lit(at(-GREAT.shoulder - 1), sy + oy, WAX[2], WAX[3], WAX[1]);
    if (k > 0.04 && k < 0.99) fist = [fx, fy];
    if (fist) smear(reach, k);
  }
  if (risen < 1 || melted > 0) pool(ix, iy, GREAT.foot + 5 + Math.round(risen * 4 + melted * 8));
  shape.draw(INK, risen < 1 ? iy - 1 : Number.POSITIVE_INFINITY);
  const flameSize = clamp(1 - melted * 1.7) * (risen < 1 ? clamp(risen * 1.5) : 1);
  if (flameSize > 0.05) greatFlame(at(0), topY - 1, flameSize, f);
  if (flameSize > 0.05) flameLight(ix, topY, rows, flameSize);
  if (fist) glow(fist[0], fist[1], 8, V[3], 0.22);
  if (melted > 0.3) smokeCurl(at(0), topY - 2, (melted - 0.3) / 0.7, 6, 2.2);
}
