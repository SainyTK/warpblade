import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_FOES as C } from "../colors";
import { JELLY_TIMES } from "./update";

const canvas = detailCanvas(40, 50, 20, 16);
const STRANDS = [-6.2, -3.6, 3.6, 6.2] as const;
const ARMS = [-1.4, 1.6] as const;

interface BellTones {
  base: Color;
  lit: Color;
  dark: Color;
  core: Color;
  vein: Color;
}

function tonesOf(e: Enemy, time: number): BellTones {
  if (e.state === "beam") return { base: C.bell[4], lit: WHITE, dark: C.bell[3], core: WHITE, vein: WHITE };
  if (e.state === "recover")
    return { base: C.bell[1], lit: C.bell[2], dark: C.bellDeep, core: C.bell[3], vein: C.bell[2] };
  if (e.state === "wind") {
    const u = clamp(e.st / (JELLY_TIMES.windup * waveScale(game.wave).windup));
    const rate = 10 + u * 34;
    const lit = Math.sin(e.st * rate) > 0.2 - u * 0.4;
    if (lit) return { base: C.bell[3], lit: C.volt[4], dark: C.bell[2], core: WHITE, vein: C.volt[4] };
  }
  const shimmer = Math.sin(time * 5) > 0.7;
  return { base: C.bell[2], lit: C.bell[3], dark: C.bell[1], core: C.jellyCore, vein: shimmer ? C.volt[4] : C.volt[3] };
}

function strand(s: SpriteCanvas, x: number, time: number, i: number, length: number, limp: boolean): void {
  let px = x;
  let py = 2;
  const sway = limp ? 0.4 : 1.4;
  s.begin();
  for (let k = 1; k <= 6; k++) {
    const u = k / 6;
    const nx = x + Math.sin(time * 2.4 - u * 3 + i * 1.7) * sway * u * 2 - x * 0.12 * u;
    const ny = 2 + length * u;
    s.stroke(px, py, nx, ny, 0.55 - u * 0.25, k < 3 ? C.bell[2] : C.frill);
    px = nx;
    py = ny;
  }
  s.commit(false);
  s.set(px, py, C.volt[3]);
}

function arm(s: SpriteCanvas, x: number, time: number, i: number, limp: boolean): void {
  const wave = (u: number) => Math.sin(time * 1.8 - u * 4 + i * 2.1) * (limp ? 0.4 : 1.1) * u;
  s.begin();
  for (let u = 0; u < 1; u += 0.1) {
    s.dot(x + wave(u), 2 + u * 11, 1.1 - u * 0.5, C.bell[3]);
  }
  s.shadeEdges(C.bell[3], C.bell[4], C.bell[2]);
  for (let u = 0.15; u < 1; u += 0.22) {
    s.set(x + wave(u) + 0.8 - u * 0.4, 2 + u * 11, C.frill);
  }
  s.commit();
}

function bell(s: SpriteCanvas, T: BellTones, time: number, squash: number): void {
  const rim: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI + (i / 20) * Math.PI;
    rim.push([Math.cos(a) * (8 + squash), 1 + Math.sin(a) * (9 - squash)]);
  }
  for (let i = 0; i <= 8; i++) {
    const x = 8 + squash - (i / 8) * (16 + squash * 2);
    rim.push([x, 2 + (i % 2) * 1.2]);
  }
  s.begin();
  s.poly(rim, T.base);
  s.shadeEdges(T.base, T.lit, T.dark, 2);
  s.commit();
  s.begin();
  s.dot(0, -0.5, 4.2, T.dark);
  s.dot(0, -1, 2.1, T.core);
  s.set(-0.5, -1.5, WHITE);
  s.commit();
  s.begin();
  for (let k = 0; k < 4; k++) {
    const a = -Math.PI * 0.9 + k * 0.6 + Math.sin(time * 7 + k) * 0.1;
    const mx = Math.cos(a) * 3.6;
    const my = -1 + Math.sin(a) * 3.2;
    s.hairline(0, -1, mx + 0.8, my + 0.6, T.vein);
    s.hairline(mx + 0.8, my + 0.6, Math.cos(a) * 6.4, -1 + Math.sin(a) * 6.6, T.vein);
  }
  s.hairline(-5.6, -4.8, -2.6, -7.8, T.lit);
  s.set(-6, -3.5, WHITE);
  for (const [x, y] of [
    [3.5, -5],
    [5.5, -2],
    [-3, -3],
    [1.5, -7],
  ] as const) {
    s.set(x, y, T.lit);
  }
  for (let x = -7; x <= 7; x += 2) {
    s.set(x, 1.5, C.frill);
  }
  s.commit(false);
}

export function drawSparkjelly(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const limp = e.state === "recover";
  const T = tonesOf(e, time);
  const squash = e.state === "beam" ? 1.4 : Math.sin(time * 2.6) * 0.7;
  s.clear();
  STRANDS.forEach((x, i) => {
    strand(s, x, time, i, 12 + (i % 2) * 3 + (limp ? 2 : 0), limp);
  });
  ARMS.forEach((x, i) => {
    arm(s, x, time, i, limp);
  });
  bell(s, T, time, squash);
  s.outline(C.outline);
  if (e.state === "wind" || e.state === "beam") {
    for (let k = 0; k < 3; k++) {
      const a = time * 9 + (k / 3) * TAU;
      s.set(Math.cos(a) * 10, -1 + Math.sin(a) * 10, C.volt[4]);
    }
  }
  return s;
}
