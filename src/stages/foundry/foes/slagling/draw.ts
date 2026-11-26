import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { FORGE } from "../../colors";
import { SLAG_TIMES } from "./behavior";
import { slagScale } from "./size";

type Pt = readonly [number, number];
const canvas = detailCanvas(40, 44, 20, 38);
const M = FORGE.molten;
const C = FORGE.crust;
const DOME_POINTS = 14;
const PLATES: readonly (readonly [number, number])[] = [
  [2.62, 0.3],
  [1.98, 0.3],
  [1.36, 0.28],
  [0.74, 0.26],
];
const BUBBLES: readonly (readonly [number, number, number])[] = [
  [-0.55, 0.35, 0.9],
  [0.5, 0.25, 1.3],
  [-0.1, 0.18, 1.7],
];

interface Blob {
  wide: number;
  tall: number;
  lift: number;
  heat: number;
}

function shapeOf(e: Enemy, time: number): Blob {
  const k = slagScale(e);
  let wide = 8;
  let tall = 10.5;
  let lift = 0;
  let heat = 0;
  if (e.state === "walk") {
    const beat = Math.sin(time * 7);
    wide += beat * 0.6;
    tall -= beat * 0.8;
  } else if (e.state === "wind") {
    const u = clamp(e.st / SLAG_TIMES.wind);
    wide += u * 1.6 + Math.sin(time * 40) * 0.25;
    tall += u * 2.2;
    lift = u * 1.2;
    heat = u;
  } else if (e.state === "lunge") {
    wide -= 1.6;
    tall += 2.6;
    heat = 0.6;
  } else {
    wide += 2.8;
    tall -= 4;
  }
  return { wide: wide * k, tall: tall * k, lift: lift * k, heat };
}

const rim = (b: Blob, a: number, r: number): Pt => [Math.cos(a) * b.wide * r, -Math.sin(a) * b.tall * r];

function body(s: SpriteCanvas, b: Blob): void {
  const points: Pt[] = [[b.wide + 1, 0]];
  for (let i = 0; i <= DOME_POINTS; i++) points.push(rim(b, (i / DOME_POINTS) * Math.PI, 1));
  points.push([-b.wide - 1, 0]);
  s.begin();
  s.poly(points, M[2]);
  s.shadeEdges(M[2], M[3], M[1], 2);
  s.commit();
  s.begin();
  s.dot(-b.wide * 0.1, -b.tall * 0.42, b.wide * 0.5, M[3]);
  s.dot(-b.wide * 0.2, -b.tall * 0.5, b.wide * 0.22, b.heat > 0.6 ? M[5] : M[4]);
  s.commit(false);
}

function plates(s: SpriteCanvas, b: Blob): void {
  const open = 0.06 + b.heat * 0.1;
  for (const [mid, span] of PLATES) {
    const a0 = mid - span + open;
    const a1 = mid + span - open;
    const out = 1.06 + b.lift * 0.08;
    s.begin();
    s.poly([rim(b, a0, 0.6), rim(b, a0, out), rim(b, mid, out + 0.06), rim(b, a1, out), rim(b, a1, 0.6)], C[2]);
    s.shadeEdges(C[2], C[3], C[0]);
    s.commit();
  }
}

function eyes(s: SpriteCanvas, b: Blob): void {
  const y = -b.tall * 0.38;
  s.begin();
  for (const u of [0.32, 0.64]) {
    const x = b.wide * u;
    s.dot(x, y, Math.max(0.9, b.wide * 0.14), C[0]);
  }
  s.commit();
  s.begin();
  for (const u of [0.32, 0.64]) {
    const x = b.wide * u;
    s.block(x - 0.25, y - 0.5, b.heat > 0.5 ? WHITE : FORGE.eye, 0.5, 1);
  }
  s.commit(false);
}

function drips(s: SpriteCanvas, b: Blob, time: number): void {
  s.begin();
  s.hairline(-b.wide, -0.5, b.wide, -0.5, M[4]);
  for (const [u, v, speed] of BUBBLES) {
    const rise = (time * speed) % 1;
    s.set(b.wide * u, -b.tall * (v + rise * 0.3), rise < 0.7 ? M[4] : M[5]);
  }
  s.commit(false);
}

export function drawSlagling(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const b = shapeOf(e, time);
  s.clear();
  s.shift(0, -e.ay);
  body(s, b);
  plates(s, b);
  eyes(s, b);
  drips(s, b, time);
  s.outline(FORGE.outline);
  return s;
}
