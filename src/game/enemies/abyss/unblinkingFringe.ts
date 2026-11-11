import type { SpriteCanvas } from "../../../engine/sprite";
import { VOID } from "./colors";
import { UNB_HIDE } from "./unblinkingColors";
import type { Mirrored } from "./unblinkingMirror";
import type { UnblinkingPose } from "./unblinkingPose";
import { BODY, type BodyFrame, bodyBottom, bodyTop } from "./unblinkingShape";

/** the nerves trailing under the eye: where each leaves the hide, how long it hangs and how thick it is at the root */
const NERVES: readonly (readonly [number, number, number])[] = [
  [-11, 19, 1.5],
  [-5.5, 26, 1.8],
  [0.5, 31, 1.9],
  [6, 25, 1.8],
  [11, 18, 1.5],
];
/**
 * how far the nerves sway, how fast, how far they spread as it gazes, how fast a pulse runs down each, and how far
 * up and out they stream as it falls
 */
const NERVE_MOTION = { sway: 2.2, rate: 1.3, spread: 0.35, pulse: 0.5, streamUp: 1.6, streamOut: 1.2 } as const;

/** lying on the floor, a nerve runs out along it this share of its length */
const SPRAWL = 0.55;

/** the thorns of its crown along the top of the hide: how many, how far out the last one stands, and their lengths */
const CROWN = { count: 11, reach: 19, base: 5, long: 8, short: 0.62, fan: 1.2 } as const;
/** how the thorns sway and how far they droop outward when limp */
const THORN_MOTION = { sway: 0.06, rate: 1.4, droop: 0.85, rise: 0.22, bend: 1 } as const;
/** the short thorns along the bottom corners: where they leave the hide and how long they are */
const UNDER_THORNS: readonly (readonly [number, number])[] = [
  [-18, 3.5],
  [-14, 4.5],
  [14, 4.5],
  [18, 3.5],
];

/**
 * The nerves trailing under the eye, each dark with a thread of void light down its middle, a pulse running down it
 * and a glowing bead at its end. They sway as it hovers, spread taut as it gazes, stream up as it falls and sprawl
 * along the floor where it lies.
 */
export function paintNerves(
  m: Mirrored,
  s: SpriteCanvas,
  p: UnblinkingPose,
  f: BodyFrame,
  time: number,
  floor: number,
  enraged: boolean,
): void {
  const ends: [number, number, number, number, number, number][] = [];
  s.begin();
  NERVES.forEach(([x, long, r], i) => {
    const x0 = f.x + x * f.sx;
    const y0 = f.y + (bodyBottom(x) - 2.5) * f.sy;
    let mx: number;
    let my: number;
    let tx: number;
    let ty: number;
    if (p.lying) {
      const out = x === 0 ? 1 : Math.sign(x);
      mx = f.x + x * 1.25;
      my = floor - 1.2;
      tx = mx + out * long * SPRAWL;
      ty = floor - 0.7;
    } else {
      const sway = Math.sin(time * NERVE_MOTION.rate + i * 1.9) * NERVE_MOTION.sway * (1 - p.fall);
      const spread = 1 + NERVE_MOTION.spread * Math.max(0, p.crown) + NERVE_MOTION.streamOut * p.fall;
      const hang = long * (1 - NERVE_MOTION.streamUp * p.fall);
      mx = f.x + x * 1.1 * spread + sway * 0.4;
      my = y0 + hang * 0.5;
      tx = f.x + x * 1.3 * spread + sway;
      ty = y0 + hang;
    }
    m.taper(x0, y0, mx, my, r, r * 0.65, UNB_HIDE.dark);
    m.taper(mx, my, tx, ty, r * 0.65, 0.35, UNB_HIDE.dark);
    ends.push([x0, y0, mx, my, tx, ty]);
  });
  s.shadeEdges(UNB_HIDE.dark, UNB_HIDE.body, UNB_HIDE.deep);
  const thread = enraged ? VOID[3] : VOID[1];
  for (const [x0, y0, mx, my, tx, ty] of ends) {
    m.hairline(x0, y0, mx, my, thread);
    m.hairline(mx, my, tx, ty, thread);
  }
  s.commit(false);
  s.begin();
  ends.forEach(([x0, y0, mx, my, tx, ty], i) => {
    m.dot(tx, ty, 0.9, VOID[2]);
    m.set(tx, ty, VOID[4]);
    // a pulse of light runs from the root to the bead
    const u = (time * NERVE_MOTION.pulse + i * 0.37) % 1;
    const [px, py] =
      u < 0.5
        ? [x0 + (mx - x0) * u * 2, y0 + (my - y0) * u * 2]
        : [mx + (tx - mx) * (u * 2 - 1), my + (ty - my) * (u * 2 - 1)];
    m.set(px, py, enraged ? VOID[4] : VOID[3]);
  });
  s.commit(false);
}

/**
 * The crown of thorns along the top of the hide, longest in the middle, curving outward and swaying; they stand
 * erect as it gazes and droop outward when it is tired or shut. Short thorns hang from its bottom corners.
 */
export function paintThorns(
  m: Mirrored,
  s: SpriteCanvas,
  p: UnblinkingPose,
  f: BodyFrame,
  time: number,
  enraged: boolean,
): void {
  const tips: [number, number][] = [];
  s.begin();
  for (let i = 0; i < CROWN.count; i++) {
    const x = -CROWN.reach + (2 * CROWN.reach * i) / (CROWN.count - 1);
    const side = x / CROWN.reach;
    const rx = f.x + x * f.sx;
    const ry = f.y + (bodyTop(x) + 1.6) * f.sy;
    const rise = 1 + THORN_MOTION.rise * p.crown;
    const long = (i % 2 === 0 ? 1 : CROWN.short) * (CROWN.base + CROWN.long * (1 - side * side)) * rise;
    const limp = Math.max(0, -p.crown) * THORN_MOTION.droop * Math.sign(side) * Math.sqrt(Math.abs(side));
    const a =
      -Math.PI / 2 +
      side * CROWN.fan * (1 - 0.2 * Math.max(0, p.crown)) +
      limp +
      Math.sin(time * THORN_MOTION.rate + i * 0.8) * THORN_MOTION.sway;
    const tx = rx + Math.cos(a) * long;
    const ty = ry + Math.sin(a) * long;
    m.taper(rx, ry, tx, ty, 1.3, 0.28, UNB_HIDE.lash, -side * THORN_MOTION.bend);
    tips.push([tx, ty]);
  }
  for (const [x, long] of UNDER_THORNS) {
    const side = x / BODY.x;
    const rx = f.x + x * f.sx;
    const ry = f.y + (bodyBottom(x) - 1.2) * f.sy;
    const a = Math.PI / 2 - side * 1.1;
    m.taper(rx, ry, rx + Math.cos(a) * long, ry + Math.sin(a) * long, 1, 0.25, UNB_HIDE.lash);
  }
  s.shadeEdges(UNB_HIDE.lash, UNB_HIDE.lashLight, UNB_HIDE.deep);
  if (enraged) for (const [x, y] of tips) m.set(x, y, VOID[4]);
  s.commit(false);
}
