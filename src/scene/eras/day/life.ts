import { FH, FW, GROUND, RES, W } from "../../../constants/stage";
import { fleck, glow, putImage, px, shakeOffset } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { hex } from "../../../utils/color";
import { Rng } from "../../../utils/rng";
import { type CloudShape, cloudShape, paintCloud } from "./clouds";
import type { SkyColors } from "./colors";
import type { Stalk } from "./flora";
import { openSky } from "./openSky";

/**
 * The day's moving life: slow high clouds and far birds behind the towers, butterflies by the slabs, tall grass
 * swaying on the lips, seeds, falling leaves and motes.
 */

/** one image pixel of something far off in the sky, hidden where the towers and the ridge stand in front */
function skyPixel(ix: number, iy: number, c: Color): void {
  if (ix < 0 || iy < 0 || ix >= FW || iy >= FH || !openSky[iy * FW + ix]) return;
  const [shx, shy] = shakeOffset();
  putImage(ix + Math.round(shx * RES), iy + Math.round(shy * RES), c);
}

interface Drifter {
  shape: CloudShape;
  y: number;
  v: number;
  x: number;
}
const DRIFT_RNG = new Rng(41);
const DRIFTERS: Drifter[] = [
  { shape: cloudShape(30, 6, DRIFT_RNG), y: 40, v: 1.6, x: 40 },
  { shape: cloudShape(22, 5, DRIFT_RNG), y: 84, v: 2.4, x: 220 },
];
/** image pixels of the drifting clouds, prepainted once per color set and offset as they move */
let cloudPixels: { d: Drifter; at: Int16Array; c: Uint32Array }[] = [];
let cloudColors: SkyColors | null = null;

function prepaint(C: SkyColors): void {
  cloudColors = C;
  cloudPixels = DRIFTERS.map((d) => {
    const at: number[] = [];
    const cs: number[] = [];
    paintCloud(
      (ix, iy, c) => {
        at.push(ix, iy);
        cs.push(c);
      },
      0,
      0,
      d.shape,
      C,
    );
    return { d, at: Int16Array.from(at), c: Uint32Array.from(cs) };
  });
}

/** two small clouds sliding slowly across the open sky, hidden where the towers and ridge stand */
export function drawDriftingClouds(t: number, C: SkyColors): void {
  if (cloudColors !== C) prepaint(C);
  for (const { d, at, c } of cloudPixels) {
    const span = W + d.shape.w + 20;
    const x0 = Math.floor((((((d.x - t * d.v) % span) + span) % span) - d.shape.w - 10) * RES);
    const y0 = d.y * RES;
    for (let j = 0; j < c.length; j++) skyPixel(x0 + at[j * 2], y0 + at[j * 2 + 1], c[j]);
  }
}

const BIRD = hex("#4c5a7c");
const BIRD_WING = hex("#6a789a");
const BIRDS = Array.from({ length: 3 }, (_, i) => ({ y: 30 + i * 9, v: 9 + i * 2.5, p: i * 37, flap: 5 + i }));
/** a far bird's wing: its length in image pixels and how far its tip rises and falls */
const WING = { length: 5, beat: 3 };

/** a small flock far off, wings beating as they cross the sky now and then */
export function drawBirds(t: number): void {
  for (const b of BIRDS) {
    const span = W * 2.2;
    const x = ((((b.p * 7 + t * b.v) % span) + span) % span) - 20;
    if (x < -4 || x > W + 4) continue;
    const ix = Math.floor(x * RES);
    const iy = Math.floor((b.y + Math.sin(t * 0.7 + b.p) * 3) * RES);
    const beat = Math.sin(t * b.flap * 2 + b.p);
    skyPixel(ix, iy, BIRD);
    skyPixel(ix + 1, iy, BIRD);
    for (let j = 1; j <= WING.length; j++) {
      const u = j / WING.length;
      // the wing bends: its inner half follows the beat, its tip trails behind it
      const rise = Math.round(-beat * WING.beat * u * (1.4 - u * 0.4) + (beat < 0 ? u * u : 0));
      const c = j === WING.length ? BIRD_WING : BIRD;
      skyPixel(ix - j, iy + rise, c);
      skyPixel(ix + 1 + j, iy + rise, c);
    }
  }
}

const WINGS: readonly (readonly [Color, Color])[] = [
  [hex("#ffb040"), hex("#c8641c")],
  [hex("#fff8e8"), hex("#c8c0d8")],
  [hex("#ffe860"), hex("#c8a020")],
];
const BUTTERFLY_BODY = hex("#3a2c2a");
const BUTTERFLIES = [
  { x: 74, y: 104, p: 0 },
  { x: 246, y: 100, p: 2.3 },
  { x: 160, y: 138, p: 4.1 },
];
const HALF = 1 / RES;

/** a few butterflies flitting about the slabs and the floor, their wings opening and folding */
export function drawButterflies(t: number): void {
  BUTTERFLIES.forEach((b, i) => {
    const x = b.x + Math.sin(t * 0.43 + b.p) * 26 + Math.sin(t * 1.7 + b.p * 2) * 4;
    const y = b.y + Math.sin(t * 0.61 + b.p * 3) * 9 + Math.abs(Math.sin(t * 6 + b.p)) * -2;
    const [lit, dark] = WINGS[i % WINGS.length];
    const spread = Math.sin(t * 22 + b.p * 5);
    fleck(x, y, BUTTERFLY_BODY);
    fleck(x, y + HALF, BUTTERFLY_BODY);
    if (spread > 0.3) {
      for (const side of [-1, 1]) {
        fleck(x + side * HALF, y - HALF, lit);
        fleck(x + side * 2 * HALF, y - HALF, lit);
        fleck(x + side * 2 * HALF, y - 2 * HALF, lit);
        fleck(x + side * HALF, y, dark);
        fleck(x + side * 2 * HALF, y + HALF, dark);
      }
    } else if (spread > -0.4) {
      for (const side of [-1, 1]) {
        fleck(x + side * HALF, y - HALF, lit);
        fleck(x + side * HALF, y - 2 * HALF, lit);
        fleck(x + side * HALF, y, dark);
      }
    } else {
      fleck(x, y - HALF, lit);
      fleck(x, y - 2 * HALF, lit);
      fleck(x, y - 3 * HALF, dark);
    }
  });
}

/** the greens of a swaying stalk from its foot to its tip */
export interface StalkColors {
  foot: Color;
  stem: Color;
  tip: Color;
}
let stalks: readonly Stalk[] = [];
let stalkColors: StalkColors | null = null;
/** how far a stalk's tip swings in image pixels, in a slow wave that travels along the floor with a quicker shiver */
const SWAY = { reach: 2.4, wave: 0.9, along: 0.02, shiver: 2.3 };

/** the stalks the scene grew when it was last painted, and their greens */
export function setStalks(grown: readonly Stalk[], colors: StalkColors): void {
  stalks = grown;
  stalkColors = colors;
}

/** tall grass and flowers swaying on the floor and the slab lips, behind the fight */
export function drawStalks(t: number): void {
  if (!stalkColors) return;
  const [shx, shy] = shakeOffset();
  const ox = Math.round(shx * RES);
  const oy = Math.round(shy * RES);
  for (const s of stalks) {
    const wind = Math.sin(t * SWAY.wave - s.ix * SWAY.along) * 0.7 + Math.sin(t * SWAY.shiver + s.phase) * 0.3;
    let x = s.ix + ox;
    for (let j = 0; j < s.height; j++) {
      const u = j / s.height;
      x = s.ix + ox + Math.round(wind * u * u * SWAY.reach);
      putImage(x, s.iy + oy - j, u < 0.3 ? stalkColors.foot : u < 0.75 ? stalkColors.stem : stalkColors.tip);
    }
    if (!s.flower) continue;
    const top = s.iy + oy - s.height;
    putImage(x, top - 1, s.flower[0]);
    putImage(x - 1, top, s.flower[0]);
    putImage(x + 1, top, s.flower[0]);
    putImage(x, top + 1, s.flower[0]);
    putImage(x, top, s.flower[1]);
  }
}

const SEED_FLUFF = hex("#ffffff");
const SEED_STEM = hex("#d8d0b8");
const MOTE = hex("#fff0a8");
const SEEDS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 61) % W,
  y: 20 + ((i * 47) % 130),
  v: 6 + (i % 5) * 2,
  p: i * 1.9,
}));
const MOTES = Array.from({ length: 10 }, (_, i) => ({ x: (i * 89) % W, y: 60 + ((i * 29) % 90), p: i * 2.3 }));
const LEAF_LIT = hex("#a8d858");
const LEAF_DARK = hex("#4e9a38");
const LEAVES = Array.from({ length: 5 }, (_, i) => ({
  x: 30 + i * 67,
  v: 5 + (i % 3) * 2,
  fall: 9 + (i % 2) * 4,
  p: i * 2.7,
}));
/** a falling leaf starts this far above the picture and is gone at the floor */
const LEAF_FALL = GROUND + 30;

/** dandelion seeds drifting on the breeze, leaves tumbling down from the ivy and specks of pollen catching the sun */
export function drawSeedsAndMotes(t: number, warm: number): void {
  for (const s of SEEDS) {
    const span = W + 20;
    const x = ((((s.x - t * s.v) % span) + span) % span) - 10;
    const y = s.y + Math.sin(t * 0.8 + s.p) * 7 - Math.sin(t * 0.13 + s.p) * 10;
    if (y > GROUND - 2) continue;
    const tilt = Math.sin(t * 2 + s.p) > 0 ? HALF : 0;
    px(x, y, SEED_FLUFF);
    fleck(x - HALF, y + tilt, SEED_FLUFF);
    fleck(x + 1, y - HALF + tilt, SEED_FLUFF);
    fleck(x + 1, y + 1, SEED_STEM);
    fleck(x + 1 + HALF, y + 1 + HALF, SEED_STEM);
  }
  for (const l of LEAVES) {
    const y = ((t * l.fall + l.p * 40) % LEAF_FALL) - 20;
    if (y > GROUND - 3) continue;
    const x = l.x - t * l.v * 0.3 + Math.sin(t * 1.1 + l.p) * 9;
    const wrapped = ((x % W) + W) % W;
    const turn = Math.floor(t * 5 + l.p) % 4;
    fleck(wrapped, y, turn < 2 ? LEAF_LIT : LEAF_DARK);
    fleck(wrapped + (turn === 2 ? 0 : HALF), y + (turn === 0 ? 0 : HALF), turn === 1 ? LEAF_DARK : LEAF_LIT);
    if (turn === 0) fleck(wrapped + 2 * HALF, y, LEAF_DARK);
  }
  for (const m of MOTES) {
    const b = Math.sin(t * 1.3 + m.p * 3);
    if (b <= 0.4) continue;
    const x = m.x + Math.sin(t * 0.3 + m.p) * 20;
    const y = m.y + Math.sin(t * 0.5 + m.p * 2) * 8;
    if (b > 0.85) {
      px(x, y, MOTE);
      glow(x, y, 4, MOTE, 0.25 + warm * 0.1);
    } else fleck(x + HALF, y + HALF, MOTE);
  }
}
