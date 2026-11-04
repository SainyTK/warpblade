import { GROUND, H, W } from "../../../constants/stage";
import { glow, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { hex } from "../../../utils/color";
import { Rng } from "../../../utils/rng";
import { type CloudShape, cloudShape, openSky, paintCloud, type SkyColors } from "./sky";

/** The day's moving life: slow high clouds and far birds behind the towers, butterflies by the slabs, seeds and motes. */

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
/** pixels of the drifting clouds, prepainted once per color set and offset as they move */
let cloudPixels: { d: Drifter; px: Int16Array; c: Uint32Array }[] = [];
let cloudColors: SkyColors | null = null;

function prepaint(C: SkyColors): void {
  cloudColors = C;
  cloudPixels = DRIFTERS.map((d) => {
    const xs: number[] = [];
    const cs: number[] = [];
    paintCloud(
      (x, y, c) => {
        xs.push(x, y);
        cs.push(c);
      },
      0,
      0,
      d.shape,
      C,
    );
    return { d, px: Int16Array.from(xs), c: Uint32Array.from(cs) };
  });
}

/** two small clouds sliding slowly across the open sky, hidden where the towers and ridge stand */
export function drawDriftingClouds(t: number, C: SkyColors): void {
  if (cloudColors !== C) prepaint(C);
  for (const { d, px: p, c } of cloudPixels) {
    const span = W + d.shape.w + 20;
    const ox = Math.floor(((((d.x - t * d.v) % span) + span) % span) - d.shape.w - 10);
    for (let j = 0; j < c.length; j++) {
      const x = ox + p[j * 2];
      const y = d.y + p[j * 2 + 1];
      if (x < 0 || y < 0 || x >= W || y >= H || !openSky[y * W + x]) continue;
      px(x, y, c[j]);
    }
  }
}

const BIRD = hex("#4c5a7c");
const BIRDS = Array.from({ length: 3 }, (_, i) => ({ y: 30 + i * 9, v: 9 + i * 2.5, p: i * 37, flap: 5 + i }));

/** a small flock far off, wings beating as they cross the sky now and then */
export function drawBirds(t: number): void {
  for (const b of BIRDS) {
    const span = W * 2.2;
    const x = Math.floor((((b.p * 7 + t * b.v) % span) + span) % span) - 20;
    if (x < -4 || x > W + 4) continue;
    const y = Math.floor(b.y + Math.sin(t * 0.7 + b.p) * 3);
    const up = Math.floor(t * b.flap + b.p) % 2 === 0;
    const pts = up
      ? [
          [-2, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, -1],
        ]
      : [
          [-2, 1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 1],
        ];
    for (const [dx, dy] of pts) {
      const sx = x + dx;
      const sy = y + dy;
      if (sx >= 0 && sx < W && openSky[sy * W + sx]) px(sx, sy, BIRD);
    }
  }
}

const WINGS: readonly (readonly [Color, Color])[] = [
  [hex("#ffb040"), hex("#c8641c")],
  [hex("#fff8e8"), hex("#c8c0d8")],
  [hex("#ffe860"), hex("#c8a020")],
];
const BUTTERFLIES = [
  { x: 74, y: 104, p: 0 },
  { x: 246, y: 100, p: 2.3 },
  { x: 160, y: 138, p: 4.1 },
];

/** a few butterflies flitting about the slabs and the floor */
export function drawButterflies(t: number): void {
  BUTTERFLIES.forEach((b, i) => {
    const x = b.x + Math.sin(t * 0.43 + b.p) * 26 + Math.sin(t * 1.7 + b.p * 2) * 4;
    const y = b.y + Math.sin(t * 0.61 + b.p * 3) * 9 + Math.abs(Math.sin(t * 6 + b.p)) * -2;
    const [lit, dark] = WINGS[i % WINGS.length];
    const open = Math.sin(t * 22 + b.p * 5) > -0.2;
    px(x, y, dark);
    if (open) {
      px(x - 1, y - 1, lit);
      px(x + 1, y - 1, lit);
      px(x - 1, y, dark);
      px(x + 1, y, dark);
    } else {
      px(x, y - 1, lit);
    }
  });
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

/** dandelion seeds drifting on the breeze and specks of pollen catching the sun */
export function drawSeedsAndMotes(t: number, warm: number): void {
  for (const s of SEEDS) {
    const span = W + 20;
    const x = ((((s.x - t * s.v) % span) + span) % span) - 10;
    const y = s.y + Math.sin(t * 0.8 + s.p) * 7 - Math.sin(t * 0.13 + s.p) * 10;
    if (y > GROUND - 2) continue;
    px(x, y, SEED_FLUFF);
    if (Math.sin(t * 2 + s.p) > 0.3) px(x - 1, y, SEED_FLUFF, 0.6);
    px(x + 1, y + 1, SEED_STEM);
  }
  for (const m of MOTES) {
    const b = Math.sin(t * 1.3 + m.p * 3);
    if (b <= 0.4) continue;
    const x = m.x + Math.sin(t * 0.3 + m.p) * 20;
    const y = m.y + Math.sin(t * 0.5 + m.p * 2) * 8;
    px(x, y, MOTE);
    if (b > 0.85) glow(x, y, 4, MOTE, 0.25 + warm * 0.1);
  }
}
