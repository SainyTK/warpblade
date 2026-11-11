import { GROUND, H, PLATFORMS, W } from "../../../constants/stage";
import { fleck, glow, hairline, px } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { lerp, TAU } from "../../../utils/math";
import { Rng } from "../../../utils/rng";
import { RAIN_COLORS as RC } from "./palette";
import { inPuddle, PUDDLES } from "./puddles";

/** Rain in front of the fight, splashes on the floor and the slab tops, drips from the slab edges, rings in puddles. */

const r = new Rng(6061);

/** the rain's three depths, far to near: speed in art pixels a second, streak length, and the share of drops at that depth */
const DEPTHS = [
  { speed: 150, length: 3, share: 0.45 },
  { speed: 200, length: 5.5, share: 0.4 },
  { speed: 270, length: 9, share: 0.15 },
] as const;
const MAX_DROPS = 210;
const MIN_DROPS = 60;
/** the field the drops wrap around in, wider and taller than the stage so the slant never leaves a gap */
const FIELD = { w: W + 60, h: H + 20 };
const DROPS = Array.from({ length: MAX_DROPS }, () => {
  const roll = r.next();
  return {
    x: r.range(0, FIELD.w),
    y: r.range(0, FIELD.h),
    v: r.range(0.85, 1.15),
    depth: roll < DEPTHS[0].share ? 0 : roll < DEPTHS[0].share + DEPTHS[1].share ? 1 : 2,
  };
});
/** how far the wind's gusts swing the slant of the streaks, and how fast */
const GUST = { swing: 0.07, pace: 0.6 };

const tailFade = (u: number): number => 0.15 + u * 0.75;

/** how far left a drop drifts for each art pixel it falls: steeper in the storm, swinging with the gusts */
const slantAt = (t: number, k: number): number =>
  lerp(0.18, 0.42, k) + Math.sin(t * GUST.pace) * Math.sin(t * GUST.pace * 2.7 + 1) * GUST.swing * (0.4 + k);

/**
 * slanted streaks at three depths: fine dim ones far off, brighter ones between, and a few long thick ones close to
 * the eye; few and short in the drizzle, many, long and wind-driven in the storm
 */
export function drawRain(t: number, k: number): void {
  const n = Math.round(lerp(MIN_DROPS, MAX_DROPS, k));
  const drift = lerp(0.18, 0.42, k);
  const slant = slantAt(t, k);
  const stretch = 1 + k * 0.5;
  for (let i = 0; i < n; i++) {
    const d = DROPS[i];
    const depth = DEPTHS[d.depth];
    const speed = depth.speed * d.v * (1 + k * 0.25);
    const y = ((d.y + t * speed) % FIELD.h) - 10;
    if (y > GROUND + 14) continue;
    const x = ((((d.x - t * speed * drift) % FIELD.w) + FIELD.w) % FIELD.w) - 30;
    const len = depth.length * stretch;
    const tx = x + slant * len;
    if (d.depth === 0) hairline(tx, y - len, x, y, RC.dropFar, 0.55);
    else hairline(tx, y - len, x, y, RC.drop, tailFade);
    // a near drop is a full art pixel thick along its lower half, with a bright head
    if (d.depth === 2) {
      hairline(x + slant * len * 0.5 + 0.5, y - len * 0.5, x + 0.5, y, RC.drop, 0.8);
      fleck(x, y, RC.splash);
    }
  }
}

interface Splash {
  x: number;
  y: number;
  t: number;
  ring: boolean;
}
const SPLASHES: Splash[] = Array.from({ length: 64 }, () => ({ x: 0, y: 0, t: 9, ring: false }));
let next = 0;
const SPLASH_LIFE = 0.22;
const RING_LIFE = 0.5;

/** drips hang from the slab undersides, swell, fall and burst on the floor */
const DRIPS = PLATFORMS.flatMap((p) =>
  Array.from({ length: 3 }, (_, i) => ({
    x: Math.floor(lerp(p.x0 + 6, p.x1 - 6, (i + r.range(0.1, 0.9)) / 3)),
    y: p.y + 9,
    period: r.range(1.4, 2.6),
    phase: r.range(0, 3),
  })),
);
const DRIP_GRAVITY = 420;

let clock = 0;

/** spawn splashes at a rate that grows with the storm */
export function updateRain(dt: number, k: number): void {
  clock += dt;
  for (const s of SPLASHES) s.t += dt;
  let n = dt * lerp(26, 90, k);
  while (n > 0) {
    if (n < 1 && r.next() > n) break;
    n--;
    const s = SPLASHES[next];
    next = (next + 1) % SPLASHES.length;
    const slab = r.chance(0.28) ? PLATFORMS[r.int(0, PLATFORMS.length - 1)] : null;
    s.x = slab ? r.range(slab.x0 + 1, slab.x1 - 1) : r.range(0, W);
    s.y = slab ? slab.y : GROUND + r.range(0, 3);
    s.ring = !slab && inPuddle(s.x);
    s.t = 0;
  }
}

/** a ripple in standing water: a fine oval ring, its near half brighter than its far half */
function ripple(x: number, y: number, rx: number, ry: number, a: number): void {
  const n = Math.ceil(rx * 8);
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU;
    const s = Math.sin(g);
    fleck(x + Math.cos(g) * rx, y + s * ry, s > 0 ? RC.puddleLip : RC.puddleSky, a);
  }
}

/** splashes as a little crown of two flying beads, rings where they land in a puddle, and the drips */
export function drawSplashes(): void {
  for (const s of SPLASHES) {
    if (s.ring) {
      if (s.t >= RING_LIFE) continue;
      const u = s.t / RING_LIFE;
      ripple(s.x, GROUND + 1.25, 1 + u * 4, 0.5 + u * 0.7, 1 - u * 0.6);
      continue;
    }
    if (s.t >= SPLASH_LIFE) continue;
    const u = s.t / SPLASH_LIFE;
    const h = Math.sin(u * Math.PI) * 2.5;
    const a = 1 - u * 0.6;
    if (u < 0.3) px(s.x, s.y - 1, RC.splash);
    else fleck(s.x + 0.5, s.y - 0.5 - h * 1.4, RC.splash, a);
    px(s.x - 1 - u * 3, s.y - 1 - h, RC.splash, a);
    px(s.x + 1 + u * 3, s.y - 1 - h, RC.splash, a);
    fleck(s.x - 2 - u * 5, s.y - 0.5 - h * 0.5, RC.drop, a);
    fleck(s.x + 2.5 + u * 5, s.y - 0.5 - h * 0.5, RC.drop, a);
  }
  for (const d of DRIPS) {
    const cyc = (clock + d.phase) % d.period;
    const hang = d.period * 0.55;
    if (cyc < hang) {
      if (cyc > hang * 0.4) px(d.x, d.y, RC.drop, 0.9);
      continue;
    }
    const f = cyc - hang;
    const y = d.y + 0.5 * DRIP_GRAVITY * f * f;
    if (y < GROUND) {
      px(d.x, y, RC.splash);
      px(d.x, y - 1, RC.drop, 0.5);
    } else {
      const g = f - Math.sqrt((2 * (GROUND - d.y)) / DRIP_GRAVITY);
      if (g < 0.12) {
        px(d.x - 1 - g * 20, GROUND - 1 - Math.sin((g / 0.12) * Math.PI) * 2, RC.splash);
        px(d.x + 1 + g * 20, GROUND - 1 - Math.sin((g / 0.12) * Math.PI) * 2, RC.splash);
      }
    }
  }
}

/** the puddles catch a little of the sky's light, more under a lightning flash */
export function drawPuddleLight(flash: number, k: number): void {
  for (const [x0, w] of PUDDLES) {
    const c = mix(RC.puddleSky, RC.boltCore, flash);
    glow(x0 + w / 2, GROUND + 2, w * 0.6, c, 0.05 + 0.02 * (1 - k) + flash * 0.4);
  }
}
