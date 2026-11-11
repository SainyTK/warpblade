import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { VOID } from "./colors";
import type { Pt } from "./paint";
import type { SovereignBody } from "./sovereignBody";
import { ARMOUR, GRIP } from "./sovereignColors";

/**
 * The great blade, along its length from the front hand: the pommel behind the hand, the guard ahead of it, the
 * blade's full length past the guard, and its half width at the guard, at its broadest and at the point.
 */
export const BLADE = { pommel: 4.6, guard: 1.8, length: 40, root: 1.8, broad: 3.2, broadAt: 0.2 } as const;
/** the guard's wings, each this long, raked toward the blade */
const WING = { reach: 4.6, rake: 1.4, root: 1.3 } as const;
/**
 * the smear a swing leaves: its inner edge as a share of the blade's reach at its head and at its tail, the angle each
 * band of it spans, the shares of its depth that burn bright and mid along the outer edge, and the share of it toward
 * the tail that breaks up; a swing that has swept less than `full` radians leaves a smear that much thinner
 */
const SMEAR = {
  innerHead: 0.78,
  innerTail: 0.95,
  step: 0.07,
  bright: 0.35,
  mid: 0.7,
  broken: 0.35,
  full: 1.6,
} as const;
/** the star at the point while it calls the pillars, fully gathered: its core's radius and its arms' reach */
const STAR = { core: 1.8, arm: 5 } as const;
/** the blade's tones, edge to core, at rest and hot: hot when a blow gathers and always once it is enraged */
const TONES = {
  cool: [VOID[1], VOID[2], VOID[3], VOID[4]],
  hot: [VOID[2], VOID[3], VOID[4], VOID[5]],
} as const;

/** a point along the blade's line, this far from the front hand, pushed off the line to its left by `off` */
function along(b: SovereignBody, d: number, off = 0): Pt {
  const [gx, gy] = b.sunk(b.pose.grip);
  const c = Math.cos(b.pose.angle);
  const s = Math.sin(b.pose.angle);
  return [gx + c * d + s * off, gy + s * d - c * off];
}

/** the hilt: a pommel with a void gem, the wrapped grip, and a guard of two raked iron wings */
export function drawHilt(b: SovereignBody): void {
  const { g } = b;
  const pommel = along(b, -BLADE.pommel);
  const guard = along(b, BLADE.guard);
  b.g.s.begin();
  g.stroke(...pommel, ...guard, 0.75, GRIP);
  b.g.s.commit();
  b.g.s.begin();
  g.dot(...pommel, 1.2, ARMOUR.base);
  for (const side of [-1, 1]) {
    const tip = along(b, BLADE.guard + WING.rake, side * WING.reach);
    g.taper(...guard, ...tip, WING.root, 0.3, ARMOUR.base, side * 0.5);
  }
  b.g.s.shadeEdges(ARMOUR.base, ARMOUR.sheen, ARMOUR.dark);
  g.set(...pommel, b.hot ? VOID[5] : VOID[3]);
  g.dot(...guard, 0.6, VOID[3]);
  g.set(...guard, VOID[5]);
  b.g.s.commit();
}

/**
 * The blade of void light: a leaf of crimson from a narrow root to its broad shoulder and down to the point, layered
 * from a dark edge to a white core that flickers along its length, with sparks crawling up its edges. It burns hotter
 * as a blow gathers and white hot once the Sovereign is enraged.
 */
export function drawBlade(b: SovereignBody): void {
  const { g, pose, time, hot } = b;
  const tones = hot ? TONES.hot : TONES.cool;
  const start = BLADE.guard + 0.6;
  const end = BLADE.guard + BLADE.length;
  const shoulder = start + BLADE.length * BLADE.broadAt;
  /** the blade's outline scaled to this share of its width, the inner layers stopping short of the point */
  const leaf = (share: number): Pt[] => [
    along(b, start, BLADE.root * share),
    along(b, shoulder, BLADE.broad * share),
    along(b, end - (1 - share) * 2.5, 0),
    along(b, shoulder, -BLADE.broad * share),
    along(b, start, -BLADE.root * share),
  ];
  b.g.s.begin();
  g.poly(leaf(1), tones[0]);
  g.poly(leaf(0.72), tones[1]);
  g.poly(leaf(0.42), tones[2]);
  // the core: a white line that breaks and joins as the light runs along it
  const steps = Math.ceil(BLADE.length * g.s.res);
  for (let i = 0; i < steps - 3; i++) {
    const d = start + (i / steps) * BLADE.length;
    const flicker = Math.sin(time * 17 - i * 0.55) + Math.sin(time * 5.3 + i * 0.21);
    const c: Color = flicker > 1.2 ? tones[2] : hot || flicker > -0.4 ? WHITE : tones[3];
    g.set(...along(b, d, 0), c);
  }
  // sparks crawl up the edges toward the point
  for (let k = 0; k < 4; k++) {
    const u = (time * 0.9 + k * 0.27 + (k % 2) * 0.11) % 1;
    const side = k % 2 ? 1 : -1;
    const half =
      u < BLADE.broadAt ? BLADE.root + (BLADE.broad - BLADE.root) * (u / BLADE.broadAt) : BLADE.broad * (1 - u) * 1.25;
    g.set(...along(b, start + u * BLADE.length, side * half * 0.85), hot ? WHITE : VOID[5]);
  }
  // the light it gathers at its point to call the pillars: a star that swells and burns white
  if (pose.charge > 0) {
    const [px, py] = along(b, end);
    const arm = STAR.arm * pose.charge;
    g.dot(px, py, STAR.core * pose.charge + 0.5, VOID[4]);
    g.hairline(px - arm, py, px + arm, py, VOID[4]);
    g.hairline(px, py - arm * 1.4, px, py + arm * 0.6, VOID[4]);
    g.dot(px, py, STAR.core * pose.charge * 0.5, WHITE);
    g.set(px, py - arm * 1.4, WHITE);
  }
  b.g.s.commit(false);
}

/**
 * The smear of a swing: a crescent of void light from where the blade started to where it is now, broad and white at
 * its leading edge where the blade is, thinning and darkening toward its tail. Through the follow-through the tail
 * draws in after the blade and the whole smear dims, so the cut reads on its fastest frame and is gone soon after.
 */
export function drawSmear(b: SovereignBody): void {
  const { g, pose } = b;
  const smear = pose.smear;
  if (!smear || smear.thin >= 1) return;
  const span = smear.to - smear.from;
  const n = Math.max(1, Math.ceil(Math.abs(span) / SMEAR.step));
  const reach = BLADE.guard + BLADE.length;
  const [gx, gy] = b.sunk(pose.grip);
  const dim = smear.thin > 0.5 ? 1 : 0;
  const grown = clamp(Math.abs(span) / SMEAR.full);
  /** the point at this angle and distance from the grip */
  const at = (a: number, r: number): Pt => [gx + Math.cos(a) * r, gy + Math.sin(a) * r];
  /** a band of the crescent between two angles and two distances from the grip */
  const band = (a0: number, a1: number, r0: number, r1: number, c: Color): void =>
    g.poly([at(a0, r0), at(a0, r1), at(a1, r1), at(a1, r0)], c);
  b.g.s.begin();
  for (let i = 0; i < n; i++) {
    // u runs from the tail (0) to the head (1), the blade itself
    const u = (i + 1) / n;
    if (u < smear.thin) continue;
    // the tail breaks up into a dashed edge
    if (u < SMEAR.broken && i % 2 === 1) continue;
    const a0 = smear.from + (span * i) / n;
    const a1 = smear.from + span * u;
    const inner = reach * (1 - (1 - SMEAR.innerTail - (SMEAR.innerHead - SMEAR.innerTail) * u) * grown);
    const bright = reach - (reach - inner) * SMEAR.bright;
    const mid = reach - (reach - inner) * SMEAR.mid;
    const fade = (u > 0.7 ? 0 : u > 0.4 ? 1 : 2) + dim;
    // the broken tail keeps only its bright outer edge
    if (u >= SMEAR.broken) {
      band(a0, a1, inner, mid, VOID[Math.max(1, 2 - fade)]);
      band(a0, a1, mid, bright, VOID[Math.max(2, 4 - fade)]);
    }
    band(a0, a1, bright, reach, VOID[Math.max(3, 5 - fade)]);
    if (u > 0.5 && !dim) {
      const [x0, y0] = at(a0, reach - 0.3);
      const [x1, y1] = at(a1, reach - 0.3);
      g.hairline(x0, y0, x1, y1, u > 0.8 ? WHITE : VOID[5]);
    }
  }
  b.g.s.commit(false);
}

/** where the blade's line crosses the floor, if its point is below it: a scrape of white light and a lick of sparks */
export function drawScrape(b: SovereignBody): void {
  const { g, pose, time } = b;
  const [gx, gy] = b.sunk(pose.grip);
  const s = Math.sin(pose.angle);
  if (s <= 0.05 || pose.sink > 0) return;
  const d = -gy / s;
  if (d > BLADE.guard + BLADE.length || d < 0) return;
  const x = gx + Math.cos(pose.angle) * d;
  const flick = Math.sin(time * 23) > 0 ? 1 : 0;
  b.g.s.begin();
  g.hairline(x - 2.5, -0.25, x + 2.5, -0.25, VOID[3]);
  g.hairline(x - 1.5, -0.25, x + 1.5, -0.25, VOID[5]);
  g.set(x, -0.5, WHITE);
  g.set(x - 1 - flick, -1, VOID[4]);
  g.set(x + 1 + flick, -1.5, VOID[4]);
  b.g.s.commit(false);
}
