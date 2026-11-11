import { GROUND, PLATFORMS, W } from "../../../constants/stage";
import { fleck, glow, glowLine, hairline, line } from "../../../engine/frame";
import { lerp } from "../../../utils/math";
import { Rng } from "../../../utils/rng";
import { ridgeTopAt } from "../../terrain";
import { RAIN_COLORS as RC } from "./palette";
import { TOWER_EDGES } from "./towers";

/**
 * Far lightning on a fixed schedule from the clock: one possible strike per slot, the slots shorten as the storm
 * builds, and a strike falls only in the first quarter of its slot, so two are always at least five seconds apart.
 */

/** gaps between the towers where a far bolt can reach the ridge */
const GAPS = [47, 84, 132, 186, 220, 272];
const FLASH_LIFE = 0.6;
const BOLT_LIFE = 0.24;

/** the flash at its brightest, stronger in the storm */
const peak = (k: number): number => lerp(0.18, 0.32, k);
/** where the strike lights the cloud bellies around its top: offsets and radius in art pixels */
const CLOUD_LIGHTS = [
  [-46, 6, 44],
  [40, -4, 50],
  [-8, 34, 36],
] as const;
/** the rim light shows only on the brightest pulses, and weakens with distance from the strike */
const RIM_FROM = 0.5;
const RIM_REACH = 220;

const slotLength = (k: number): number => lerp(14, 7, k);
const hash = (n: number, s: number): number => {
  const x = Math.sin(n * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** seconds since the latest strike and its slot, or null when none is showing */
function strike(t: number, k: number): { slot: number; age: number } | null {
  const L = slotLength(k);
  const slot = Math.floor(t / L);
  if (hash(slot, 1) > lerp(0.4, 0.95, k)) return null;
  const age = t - (slot + hash(slot, 2) * 0.25) * L;
  return age >= 0 && age < FLASH_LIFE ? { slot, age } : null;
}

/** a double pulse, brighter in the storm, never above 0.32 */
export function lightningFlash(t: number, k: number): number {
  const s = strike(t, k);
  if (!s) return 0;
  const a = s.age;
  const pulse = a < 0.06 ? 1 : a < 0.12 ? 0.2 : a < 0.2 ? 0.7 : 0.7 * Math.exp(-(a - 0.2) * 9);
  return pulse * peak(k);
}

type Path = [number, number][];
let cached = -1;
let bolt: Path = [];
let forks: Path[] = [];

function jag(R: Rng, x0: number, y0: number, x1: number, y1: number, disp: number, depth: number): Path {
  let pts: Path = [
    [x0, y0],
    [x1, y1],
  ];
  let d = disp;
  for (let n = 0; n < depth; n++) {
    const out: Path = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      out.push([(ax + bx) / 2 + R.range(-d, d), (ay + by) / 2], pts[i]);
    }
    pts = out;
    d *= 0.55;
  }
  return pts;
}

function build(slot: number): void {
  const R = new Rng(slot * 7919 + 13);
  const x1 = GAPS[R.int(0, GAPS.length - 1)] + R.range(-4, 4);
  const x0 = x1 + R.range(-26, 26);
  bolt = jag(R, x0, R.range(30, 46), x1, ridgeTopAt(Math.round(x1)), 12, 4);
  forks = Array.from({ length: R.int(2, 4) }, () => {
    const [fx, fy] = bolt[R.int(3, bolt.length - 6)];
    return jag(R, fx, fy, fx + R.range(-26, 26), fy + R.range(10, 28), 5, 3);
  });
  // each fork may split once more near its middle
  for (const f of [...forks]) {
    if (!R.chance(0.6)) continue;
    const [sx, sy] = f[Math.floor(f.length / 2)];
    forks.push(jag(R, sx, sy, sx + R.range(-12, 12), sy + R.range(6, 14), 3, 2));
  }
  cached = slot;
}

/** the main channel: a white core an art pixel thick with a fine violet edge on either side */
function channel(p: Path, a: number): void {
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    hairline(ax - 0.5, ay, bx - 0.5, by, RC.boltEdge, 0.8 * a);
    hairline(ax + 1.5, ay, bx + 1.5, by, RC.boltEdge, 0.8 * a);
    line(ax, ay, bx, by, RC.boltCore, a);
  }
}

/** a fork: a fine line, white where it leaves the channel and violet toward its tip */
function fork(p: Path, a: number): void {
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    hairline(ax, ay, bx, by, i * 2 < p.length ? RC.boltCore : RC.boltEdge, a);
  }
}

/** the strike's light on the scene: the bellies of the clouds around it, the tower edges and the wet lips that face it */
function lightScene(x: number, y: number, pulse: number, flash: number): void {
  glow(x, y, 56, RC.boltGlow, flash * 1.1);
  for (const [dx, dy, r] of CLOUD_LIGHTS) glow(x + dx, y + dy, r, RC.boltGlow, flash * 0.7);
  if (pulse < RIM_FROM) return;
  const a = (pulse - RIM_FROM) / (1 - RIM_FROM);
  rim(TOWER_EDGES.left, x, -1, 0.25, a);
  rim(TOWER_EDGES.right, x, 1, 0.75, a);
  hairline(0, GROUND + 0.25, W, GROUND + 0.25, RC.boltCore, a * 0.6);
  for (const p of PLATFORMS) hairline(p.x0, p.y + 0.25, p.x1 + 1, p.y + 0.25, RC.boltCore, a * 0.6);
}

/** a fine line of light down the tower edges on the side that faces the strike at x */
function rim(edges: readonly number[], x: number, side: number, inset: number, a: number): void {
  for (let i = 0; i < edges.length; i += 2) {
    const ex = edges[i];
    if ((x - ex) * side <= 0) continue;
    const near = a * (1 - Math.min(1, Math.abs(x - ex) / RIM_REACH) * 0.6);
    fleck(ex + inset, edges[i + 1] + 0.25, RC.boltEdge, near);
    fleck(ex + inset, edges[i + 1] + 0.75, RC.boltEdge, near);
  }
}

/** the forked bolt in the far sky for a few frames, and the light it throws on the clouds, the towers and the wet stone */
export function drawLightning(t: number, k: number): void {
  const s = strike(t, k);
  if (!s) return;
  if (s.slot !== cached) build(s.slot);
  const [x0, y0] = bolt[0];
  const flash = lightningFlash(t, k);
  lightScene(x0, y0, flash / peak(k), flash);
  const a = s.age;
  if (a > BOLT_LIFE || (a > 0.07 && a < 0.12)) return;
  const f = 1 - a / BOLT_LIFE;
  channel(bolt, Math.min(1, f * 1.5));
  for (const fk of forks) fork(fk, f);
  const [x1, y1] = bolt[bolt.length - 1];
  glowLine(x0, y0, x1, y1, 8, RC.boltGlow, 0.22 * f);
  glow(x1, y1, 14, RC.boltCore, 0.3 * f);
}
