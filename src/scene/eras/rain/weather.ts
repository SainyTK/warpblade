import { GROUND, H, PLATFORMS, W } from "../../../constants/stage";
import { ellipseRing, glow, line, px } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { lerp } from "../../../utils/math";
import { Rng } from "../../../utils/rng";
import { RAIN_COLORS as RC } from "./palette";

/** Rain in front of the fight, splashes on the floor and the slab tops, drips from the slab edges, rings in puddles. */

const r = new Rng(6061);

/** puddles along the floor: left edge and width */
export const PUDDLES: readonly (readonly [number, number])[] = [
  [8, 22],
  [62, 14],
  [118, 30],
  [176, 12],
  [214, 26],
  [268, 18],
  [300, 14],
];
const inPuddle = (x: number): boolean => PUDDLES.some(([x0, w]) => x >= x0 + 2 && x <= x0 + w - 2);

const MAX_DROPS = 150;
const DROPS = Array.from({ length: MAX_DROPS }, () => ({
  x: r.range(0, W + 60),
  y: r.range(0, H + 20),
  v: r.range(0.85, 1.15),
  near: r.chance(0.4),
}));

const nearAlpha = (u: number): number => 0.25 + u * 0.4;

/** slanted streaks; few and short in the drizzle, many, long and wind-driven in the storm */
export function drawRain(t: number, k: number): void {
  const n = Math.round(lerp(34, MAX_DROPS, k));
  const slope = lerp(0.18, 0.42, k);
  for (let i = 0; i < n; i++) {
    const d = DROPS[i];
    const speed = (d.near ? 230 : 170) * d.v * (1 + k * 0.25);
    const y = ((d.y + t * speed) % (H + 20)) - 10;
    const x = ((((d.x - t * speed * slope) % (W + 60)) + W + 60) % (W + 60)) - 30;
    if (y > GROUND + 14) continue;
    const len = (d.near ? 6 : 3.5) * (1 + k * 0.5);
    if (d.near) line(x + slope * len, y - len, x, y, RC.drop, nearAlpha);
    else line(x + slope * len, y - len, x, y, RC.dropFar, 0.4);
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

/** splashes as a little crown of two flying beads, rings where they land in a puddle, and the drips */
export function drawSplashes(): void {
  for (const s of SPLASHES) {
    if (s.ring) {
      if (s.t >= RING_LIFE) continue;
      const u = s.t / RING_LIFE;
      ellipseRing(s.x, GROUND + 1.5, 1 + u * 4, 0.6 + u * 0.8, RC.puddleLip, (1 - u) * 0.8);
      continue;
    }
    if (s.t >= SPLASH_LIFE) continue;
    const u = s.t / SPLASH_LIFE;
    const h = Math.sin(u * Math.PI) * 2.5;
    const a = 1 - u * 0.6;
    px(s.x, s.y - 1, RC.splash, u < 0.3 ? 1 : 0);
    px(s.x - 1 - u * 3, s.y - 1 - h, RC.splash, a);
    px(s.x + 1 + u * 3, s.y - 1 - h, RC.splash, a);
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
