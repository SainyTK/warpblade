import { glow, glowLine, line } from "../../../engine/frame";
import { lerp } from "../../../utils/math";
import { Rng } from "../../../utils/rng";
import { ridgeTopAt } from "../../terrain";
import { RAIN_COLORS as RC } from "./palette";

/**
 * Far lightning on a fixed schedule from the clock: one possible strike per slot, the slots shorten as the storm
 * builds, and a strike falls only in the first quarter of its slot, so two are always at least five seconds apart.
 */

/** gaps between the towers where a far bolt can reach the ridge */
const GAPS = [47, 84, 132, 186, 220, 272];
const FLASH_LIFE = 0.6;
const BOLT_LIFE = 0.24;

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
  return pulse * lerp(0.18, 0.32, k);
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
  forks = Array.from({ length: R.int(1, 3) }, () => {
    const [fx, fy] = bolt[R.int(3, bolt.length - 6)];
    return jag(R, fx, fy, fx + R.range(-22, 22), fy + R.range(10, 24), 5, 2);
  });
  cached = slot;
}

function stroke(p: Path, k: number, core: boolean): void {
  for (let i = 1; i < p.length; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    if (core) line(ax + 1, ay, bx + 1, by, RC.boltEdge, 0.7 * k);
    line(ax, ay, bx, by, core ? RC.boltCore : RC.boltEdge, k);
  }
}

/** the forked bolt in the far sky for a few frames, and the light it throws on the clouds */
export function drawLightning(t: number, k: number): void {
  const s = strike(t, k);
  if (!s) return;
  if (s.slot !== cached) build(s.slot);
  const [x0, y0] = bolt[0];
  glow(x0, y0, 56, RC.boltGlow, lightningFlash(t, k) * 1.1);
  const a = s.age;
  if (a > BOLT_LIFE || (a > 0.07 && a < 0.12)) return;
  const f = 1 - a / BOLT_LIFE;
  stroke(bolt, Math.min(1, f * 1.5), true);
  for (const fk of forks) stroke(fk, f, false);
  glowLine(x0, y0, bolt[bolt.length - 1][0], bolt[bolt.length - 1][1], 8, RC.boltGlow, 0.22 * f);
}
