import { RES } from "../../../constants/stage";
import { glow, place } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { clamp, TAU } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import type { PlatePaint } from "../../platePaint";
import { banded, hair, halo } from "./brush";
import { CORONA, SUN } from "./colors";
import { cloud } from "./noise";

/** The black sun: a dark disc ringed by a thin white limb, a corona of long streamers, and flames looping off its edge. */

/** where the sun hangs and its radius at the era's start, in art pixels */
export const SUN_AT = { x: 246, y: 40, r: 14 } as const;
/** the sun swells by this many art pixels over the era */
const SWELL = 2;
/** directions around the sun the corona's reach and heat are worked out for */
const BINS = 720;
const STREAMERS = 15;
/** how far the corona reaches past the limb, in art pixels, at the era's start and how much further at its end */
const REACH = { base: 9, grow: 7 };
/** where the bead of sunlight breaks past the disc, as an angle */
const BEAD_AT = -0.72;
const PROMINENCES: readonly (readonly [number, number])[] = [
  [2.5, 6],
  [3.6, 9],
  [0.9, 5],
  [5.2, 6],
];

/** the corona has faded out by this many times its typical reach */
const FADES_BY = 4;
/** the bright collar hugging the limb is worked out only this close to it, in image pixels */
const NEAR_REACH = 30;
/** wisps are worked out for rings this many image pixels apart */
const WISP_STEP = 3;

/**
 * wisps that run outward: noise that changes fast around the sun and slowly along a ray, for every direction and
 * for rings out to `depth` image pixels past the limb
 */
function wispTable(depth: number): { table: Float32Array; rings: number } {
  const rings = Math.ceil(depth / WISP_STEP) + 1;
  const table = new Float32Array(BINS * rings);
  for (let b = 0; b < BINS; b++) {
    for (let ring = 0; ring < rings; ring++) {
      table[b * rings + ring] = 0.7 + 0.6 * cloud(b * 0.5, ring * WISP_STEP * 0.08, 1, 5);
    }
  }
  return { table, rings };
}

const sunRadius = (k: number): number => (SUN_AT.r + k * SWELL) * RES;

/** the corona's colour at strength u from 0 to 1, between the stops of its ramp */
function coronaAt(u: number): Color {
  const v = clamp(u) * (CORONA.length - 1);
  const i = Math.min(CORONA.length - 2, Math.floor(v));
  return mix(CORONA[i], CORONA[i + 1], v - i);
}

/** how far the corona reaches and how hot it burns in each direction: a low even glow with long streamers through it */
function streamers(r: Rng): { reach: Float32Array; heat: Float32Array } {
  const reach = new Float32Array(BINS).fill(0.4);
  const heat = new Float32Array(BINS).fill(0.5);
  for (let s = 0; s < STREAMERS; s++) {
    const at = r.range(0, TAU);
    const width = r.range(0.04, 0.2);
    const long = r.range(0.5, 1.5);
    const hot = r.range(0.2, 0.5);
    for (let b = 0; b < BINS; b++) {
      const a = (b / BINS) * TAU;
      const off = Math.abs(((a - at + Math.PI + TAU) % TAU) - Math.PI) / width;
      const g = Math.exp(-off * off);
      reach[b] += long * g;
      heat[b] += hot * g;
    }
  }
  return { reach, heat };
}

/** a tongue of flame off the limb at angle `at`, `size` image pixels high, leaning as it rises and white at its root */
function prominence(p: PlatePaint, cx: number, cy: number, R: number, at: number, size: number): void {
  for (let h = 0; h <= size; h += 0.5) {
    const u = h / size;
    const half = ((1 - u) * size * 0.45) / R;
    const lean = at + u * u * 0.12;
    for (let a = lean - half; a <= lean + half; a += 0.4 / R) {
      const ix = Math.round(cx + Math.cos(a) * (R + 1.5 + h));
      const iy = Math.round(cy + Math.sin(a) * (R + 1.5 + h));
      p.put(ix, iy, u < 0.3 ? SUN.ring : u < 0.65 ? SUN.ringOuter : SUN.prominence);
    }
  }
}

/** the bead where the sun's own light breaks past the disc: a white point with four fine rays */
function bead(p: PlatePaint, cx: number, cy: number, R: number): void {
  const bx = Math.round(cx + Math.cos(BEAD_AT) * (R + 1));
  const by = Math.round(cy + Math.sin(BEAD_AT) * (R + 1));
  halo(p, bx, by, 9, SUN.ringOuter, 0.7);
  for (const [dx, dy, len] of [
    [1, 0, 9],
    [-1, 0, 6],
    [0, 1, 6],
    [0, -1, 9],
  ]) {
    hair(p, bx, by, bx + dx * len, by + dy * len, SUN.ring, 0.75);
    hair(p, bx, by, bx + dx * len * 0.5, by + dy * len * 0.5, SUN.ring);
  }
  for (let v = -1; v <= 1; v++) {
    for (let u = -1; u <= 1; u++) {
      p.put(bx + u, by + v, SUN.ring);
    }
  }
}

/** static: the eclipsed sun at the frame's full detail */
export function paintEclipse(p: PlatePaint, r: Rng, k: number): void {
  const cx = SUN_AT.x * RES;
  const cy = SUN_AT.y * RES;
  const R = sunRadius(k);
  const far = (REACH.base + k * REACH.grow) * RES;
  const { reach, heat } = streamers(r);
  const span = Math.ceil(R + far * FADES_BY);
  const wisps = wispTable(span - R);
  for (let iy = cy - span; iy <= cy + span; iy++) {
    for (let ix = cx - span; ix <= cx + span; ix++) {
      const dx = ix + 0.5 - cx;
      const dy = iy + 0.5 - cy;
      const d = Math.hypot(dx, dy);
      if (d > span) {
        continue;
      }
      if (d <= R) {
        // a faint ember light just inside the edge rounds the black disc
        const edge = clamp((d - R + 7) / 7);
        p.put(ix, iy, mix(SUN.core, SUN.limb, banded(edge * edge * 0.8, ix, iy, 4)));
        continue;
      }
      const out = d - R;
      if (out <= 1.6) {
        p.put(ix, iy, SUN.ring);
        continue;
      }
      const turn = ((Math.atan2(dy, dx) / TAU + 1) % 1) * BINS;
      const b = Math.floor(turn) % BINS;
      const f = turn - Math.floor(turn);
      const long = reach[b] * (1 - f) + reach[(b + 1) % BINS] * f;
      const hot = heat[b] * (1 - f) + heat[(b + 1) % BINS] * f;
      const wisp = wisps.table[b * wisps.rings + Math.min(wisps.rings - 1, Math.floor(out / WISP_STEP))];
      const near = out < NEAR_REACH ? Math.exp(-out / (2.2 * RES)) : 0;
      const u = clamp(hot * wisp * Math.exp(-out / (far * long)) + near * 0.9);
      if (u < 0.02) {
        continue;
      }
      p.blend(ix, iy, coronaAt(u), banded(Math.min(1, u * 1.5), ix, iy, 12));
    }
  }
  for (const [at, size] of PROMINENCES) {
    prominence(p, cx, cy, R, at, size);
  }
  bead(p, cx, cy, R);
}

/** the soft light the whole corona breathes with: how far past the limb it reaches in art pixels, and its strength */
const BREATH = { reach: 19, low: 0.2, swell: 0.08 };

/** each frame: the corona breathes and its brightest lobes drift around the limb */
export function drawEclipseLight(t: number, k: number): void {
  place();
  const R = SUN_AT.r + k * SWELL;
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.8);
  glow(SUN_AT.x, SUN_AT.y, R + BREATH.reach, SUN.glow, BREATH.low + breathe * BREATH.swell);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.31 + t * (i % 2 ? 0.17 : -0.11);
    const flare = 0.5 + 0.5 * Math.sin(t * (1.3 + i * 0.37) + i * 2.1);
    glow(SUN_AT.x + Math.cos(a) * (R + 3), SUN_AT.y + Math.sin(a) * (R + 3), 9, SUN.shimmer, 0.1 + 0.24 * flare);
  }
  const bx = SUN_AT.x + Math.cos(BEAD_AT) * (R + 0.5);
  const by = SUN_AT.y + Math.sin(BEAD_AT) * (R + 0.5);
  glow(bx, by, 7, SUN.ring, 0.25 + 0.2 * Math.sin(t * 2.3) * Math.sin(t * 0.9));
}
