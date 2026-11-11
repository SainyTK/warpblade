import { PAL } from "../../../constants/palette";
import { GREAT_LOOK as G, WICK_WAX as X } from "../../../constants/wenna/wickLook";
import { glow, hairline, place } from "../../../engine/frame";
import { blit, detailCanvas } from "../../../engine/sprite";
import { clamp, ease, lerp, smooth } from "../../../utils/math";
import { game } from "../../state";
import { paintFlame } from "./wickFlame";
import { drawPool, drawSmokeCurl } from "./wickParts";

const V = PAL.wick;

/** the giant's canvas, its feet at the bottom middle so the floor cuts off what has not risen yet */
const figure = detailCanvas(G.canvas.w, G.canvas.h, G.canvas.w / 2, G.canvas.h);

/** how many steps up the body its outline is traced in */
const STEPS = 14;
/** the body's top rounds off over this share of its height */
const DOME = 0.16;
/**
 * the body is lit across its width like a column: each band runs from the last one's edge to this share of its half
 * width, from the lit side to the far side
 */
const BANDS: readonly (readonly [number, keyof typeof X])[] = [
  [-0.56, "light"],
  [0.16, "body"],
  [0.6, "mid"],
  [1, "shade"],
];

/** the giant's measures this frame: its height, how far it is sunk in the floor and how far it has slumped outward */
interface Frame {
  rows: number;
  sink: number;
  spread: number;
}

/** the body's half width at a height from 0 (the foot) to 1 (the crown): a heavy foot, a waist, round shoulders */
function halfWidth(f: Frame, up: number): number {
  const wide = lerp(G.foot, G.shoulder, Math.sqrt(up)) + f.spread * (1 - up);
  const over = (up - (1 - DOME)) / DOME;
  return over > 0 ? wide * Math.sqrt(Math.max(0.02, 1 - over * over)) : wide;
}

/** the outline of the body between two shares of its half width, as a polygon from the foot up and back down */
function slab(f: Frame, from: number, to: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) points.push([halfWidth(f, i / STEPS) * from, f.sink - (i / STEPS) * f.rows]);
  for (let i = STEPS; i >= 0; i--) points.push([halfWidth(f, i / STEPS) * to, f.sink - (i / STEPS) * f.rows]);
  return points;
}

/** the wax body: bands of light across it from its lit side to its far side, with pooled wax round its foot */
function body(f: Frame): void {
  const s = figure;
  s.begin();
  let from = -1;
  for (const [to, tone] of BANDS) {
    s.poly(slab(f, from, to), X[tone]);
    from = to;
  }
  const foot = halfWidth(f, 0);
  s.stroke(-foot - 1, f.sink - 1, foot + 1, f.sink - 1, 1.4, X.mid);
  s.shadeEdges(X.mid, X.body, X.shade, 2);
  s.shadeEdges(X.shade, X.shade, X.deep);
  s.commit();
}

/** long drips down from the shoulders, each ending in a bead: pale on the lit side, darker on the far side */
const DRIPS: readonly (readonly [number, number, boolean])[] = [
  [-2.6, 13, true],
  [-0.2, 7, true],
  [1.8, 10, true],
  [5, 9, false],
];

function drips(f: Frame): void {
  const s = figure;
  const crown = f.sink - f.rows;
  s.begin();
  for (const [x, run, lit] of DRIPS) {
    const c = lit ? X.light : X.mid;
    s.stroke(x, crown + 2.5, x, crown + run, 0.6, c);
    s.dot(x, crown + run + 0.5, 1, c);
  }
  s.shadeEdges(X.light, X.light, X.mid);
  s.shadeEdges(X.mid, X.mid, X.deep);
  s.commit(false);
}

/** the crown under the flame: hot wax in the flame's violet, with a gold pool where the flame sits */
function crown(f: Frame, burn: number): void {
  const s = figure;
  const y = f.sink - f.rows;
  s.begin();
  s.stroke(-G.shoulder * 0.55, y + 2.2, G.shoulder * 0.45, y + 2, 1.3 * burn, X.crown);
  s.stroke(-1.6, y + 1.1, 1.6, y + 1.1, 0.8 * burn, X.melt);
  s.commit(false);
}

/** two deep sockets under a heavy brow, each with an ember of the flame burning in it */
function eyes(f: Frame): void {
  const s = figure;
  const y = f.sink - f.rows + G.eyeDrop;
  s.begin();
  for (const x of G.eyes) {
    s.dot(x, y, G.eye, X.ink);
    s.stroke(x - G.eye, y - G.eye - 0.4, x + G.eye, y - G.eye + 0.2, 0.4, X.shade);
  }
  s.commit(false);
  s.begin();
  for (const x of G.eyes) {
    s.dot(x + 0.2, y + 0.3, G.eye * 0.45, V[3]);
    s.set(x, y, V[5]);
  }
  s.commit(false);
}

/** the great arm's elbow and fist at a share `t` of its swing, from the shoulder: up behind its head, then down ahead */
function reach(f: Frame, len: number, slump: number, t: number): [number, number, number, number] {
  const sx = G.shoulder - 2;
  const sy = f.sink - f.rows + 10;
  const a = lerp(G.armFrom, G.armTo, t) + slump;
  const fore = a + lerp(-0.9, 0.25, t);
  const ex = sx + Math.cos(a) * len * 0.55;
  const ey = sy + Math.sin(a) * len * 0.55;
  return [ex, ey, ex + Math.cos(fore) * len * 0.5, ey + Math.sin(fore) * len * 0.5];
}

/** the swinging arm from its leading shoulder, bent at the elbow, ending in a fist; and the stub of the far arm */
function arms(f: Frame, len: number, slump: number, k: number): void {
  const s = figure;
  const sx = G.shoulder - 2;
  const sy = f.sink - f.rows + 10;
  const [ex, ey, fx, fy] = reach(f, len, slump, k);
  s.begin();
  s.stroke(-G.shoulder - 0.4, sy - 2, -G.shoulder - 1, sy + 3, 1.4, X.body);
  s.shadeEdges(X.body, X.light, X.mid);
  s.commit();
  s.begin();
  s.taper(sx, sy, ex, ey, G.upperArm, G.foreArm, X.body);
  s.taper(ex, ey, fx, fy, G.foreArm, G.foreArm * 0.85, X.body);
  s.dot(fx, fy, G.fist, X.body);
  s.shadeEdges(X.body, X.light, X.mid, 2);
  s.commit();
}

/** how far back along the swing the smear trails, as a share of the swing, and how many steps it is drawn in */
const SMEAR = { trail: 0.45, steps: 20, wide: 3.4 } as const;

/** a violet smear trailing the fist along the path it just swept: widest and palest at the fist, thinning to a hair */
function smear(x: number, y: number, dir: number, f: Frame, len: number, k: number): void {
  let [, , px, py] = reach(f, len, 0, k);
  for (let i = 1; i <= SMEAR.steps; i++) {
    const back = (i / SMEAR.steps) * SMEAR.trail;
    if (k - back < 0) break;
    const [, , qx, qy] = reach(f, len, 0, k - back);
    const fade = 1 - back / SMEAR.trail;
    const wide = Math.round(SMEAR.wide * fade * 2);
    for (let j = 0; j <= wide; j++) {
      const c = j === 0 ? (fade > 0.8 ? V[5] : V[4]) : j < wide * 0.6 ? V[4] : V[3];
      hairline(x + px * dir, y + py + j * 0.5, x + qx * dir, y + qy + j * 0.5, c, fade * (1 - (j / (wide + 1)) * 0.6));
    }
    px = qx;
    py = qy;
  }
}

/**
 * The Great Wick, about 48 px tall, its feet at (x, y), drawn at full detail: a giant wax figure lit down one side with
 * long beaded drips, two deep eyes and a roaring violet flame, rising out of a spreading pool (`rise` 0 to 1), swinging
 * one great arm from up behind its head forward and down across its reach (`swing` 0 to 1, a violet smear trailing the
 * fist) and melting down into its pool with a curl of smoke (`melt` 0 to 1), facing `face`.
 */
export function drawGreatWick(x: number, y: number, rise: number, swing: number, melt: number, face: number): void {
  place();
  const dir = face < 0 ? -1 : 1;
  const risen = ease.outQuad(clamp(rise));
  const melted = clamp(melt);
  const f: Frame = {
    rows: Math.max(2, G.body * (1 - melted * 0.92)),
    sink: (1 - risen) * (G.body + G.flame.tall),
    spread: melted * 10,
  };
  const burn = clamp(1 - melted * 1.7) * (risen < 1 ? clamp(risen * 1.5) : 1);
  const k = smooth(0, 1, swing);
  const len = G.arm * (1 - melted);
  const whole = melted < 0.4;
  if (risen < 1 || melted > 0) drawPool(x, y, G.foot + 5 + risen * 4 + melted * 8);
  const s = figure;
  s.clear();
  body(f);
  if (whole) {
    drips(f);
    if (burn > 0.05) crown(f, burn);
    eyes(f);
    arms(f, len, melted * 1.2, k);
  }
  s.outline(X.ink);
  const top = f.sink - f.rows;
  if (burn > 0.05) {
    s.begin();
    paintFlame(s, {
      x: 0,
      y: top - 0.3,
      tall: G.flame.tall * burn,
      wide: G.flame.wide * burn,
      bend: 1.5,
      lift: 0,
      t: Math.floor(game.t * 14) / 14,
      seed: 0,
    });
    s.commit(false);
  }
  const swinging = whole && k > 0.04 && k < 0.99;
  if (swinging) smear(x, y, dir, f, len, k);
  blit(s, x, y, dir < 0);
  if (burn > 0.05) glow(x, y + top - G.flame.tall * 0.4 * burn, 14 + 18 * burn, V[3], 0.28 * burn);
  if (swinging) {
    const [, , fx, fy] = reach(f, len, melted * 1.2, k);
    glow(x + fx * dir, y + fy, 8, V[3], 0.22);
  }
  if (melted > 0.3) drawSmokeCurl(x, y + top - 2, (melted - 0.3) / 0.7, 6, 2.2);
}
