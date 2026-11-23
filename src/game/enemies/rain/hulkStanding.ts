import type { SpriteCanvas } from "../../../engine/sprite";
import { mix, WHITE } from "../../../utils/color";
import { RAIN_FOES as C } from "./colors";
import { glint } from "./detail";
import { type Crack, drawCracks } from "./hulkCracks";
import { drawHulkEyes } from "./hulkEyes";
import type { HulkLook, Point } from "./hulkLook";
import { drawMotes } from "./hulkMotes";

const REEDS = [
  [-12, 15, -0.5],
  [-8, 19, -0.2],
  [-4, 14, 0.1],
  [-15, 11, -0.8],
] as const;
const CRACKED_REEDS = REEDS.slice(0, 2);
const MOTES = [
  [-9, -13],
  [-3, -17],
  [-12, -20],
  [1, -9],
  [-6, -8],
] as const;
const BUBBLES = [
  [-12, -14, 0.5],
  [-1.5, -21, 0.4],
  [-9, -8, 0.4],
] as const;
const STREAKS = [
  [-13.5, -18, -13, -16],
  [-5, -12, -4, -11.2],
  [-10, -11, -9.4, -10],
] as const;
const FOLDS = [
  [-5, -15, 9.5, 0.5, 1.9],
  [-7, -19, 6.5, 0.3, 1.5],
  [2, -12, 5.5, 0.9, 2.3],
] as const;
const PEBBLES = [
  [-10.5, -10.5, 1.1],
  [-2, -7.5, 0.9],
  [-13, -15.5, 0.8],
  [0.5, -15, 0.7],
] as const;
const SLUDGE = [
  [-13, -9, 2.6, 0],
  [-9.5, -5.5, 3.2, 0.4],
  [-3.5, -4.8, 2.4, 0.7],
  [1, -5.2, 3, 0.2],
] as const;
const CRACKS: readonly Crack[] = [
  [
    [-5, -31],
    [-8, -28],
    [-7, -26],
    [-11, -23],
    [-12.5, -19],
    [-15, -16],
  ],
  [
    [-1.5, -30],
    [1, -27.5],
    [0, -25],
    [3.5, -23],
    [4, -20.5],
  ],
  [
    [-4.5, -13],
    [-1.5, -11],
    [-2.5, -8.5],
    [1.5, -6.5],
    [2.5, -4.5],
  ],
];
const ELBOW = { near: 1.3, far: 1 };

function drip(s: SpriteCanvas, x: number, y: number, stretch: number): void {
  if (stretch > 0) s.stroke(x, y - stretch, x, y, 0.3, C.mudLight);
  s.dot(x, y + 0.3, 0.6, C.mudLight);
  s.set(x - 0.3, y, C.mudGlint);
}

function drawReeds(s: SpriteCanvas, look: HulkLook): void {
  const { time, crouch, droop } = look;
  const reeds = look.cracked ? CRACKED_REEDS : REEDS;
  s.begin();
  const heads: Point[] = [];
  for (const [x, h, lean] of reeds) {
    const sway = Math.sin(time * 2.4 + x) * 1.2;
    const by = -30 + crouch + Math.abs(x + 8) * 0.4;
    const tx = x + lean * droop * h + sway;
    const ty = by - h * (1.15 - 0.15 * droop);
    s.stroke(x, by, tx, ty, 0.5, C.reed);
    heads.push([tx, ty]);
  }
  s.shadeEdges(C.reed, C.reedLight, C.reedDark);
  s.commit(false);
  s.begin();
  const head = look.cracked ? mix(C.cattail, C.mudDeep, 0.6) : C.cattail;
  reeds.forEach(([, , lean], i) => {
    const [tx, ty] = heads[i];
    s.stroke(tx - lean * 3, ty + 3, tx, ty, 0.9, head);
    if (look.cracked) return;
    s.set(tx, ty - 1, C.reedLight);
    s.set(tx, ty - 0.5, C.reedLight);
  });
  if (look.cracked) s.shadeEdges(head, C.cattail, C.mudDeep);
  else {
    s.shadeEdges(C.cattail, C.cattailLight, C.mudDeep);
    for (const [tx, ty] of heads) glint(s, tx - 0.5, ty + 0.5, C.mudGlint);
  }
  s.commit();
}

function drawFarLimbs(s: SpriteCanvas, look: HulkLook): void {
  const { crouch, step, far } = look;
  s.begin();
  s.taper(-7, -9 + crouch, -8 - step, -1, 3.2, 4.2, C.mudDark);
  s.taper(-1, -24 + crouch, far[0], far[1], 2.8, 3.6, C.mudDark, ELBOW.far);
  s.dot(far[0], far[1], 4.2, C.mudDark);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 2);
  for (let j = -1; j <= 1; j++) s.hairline(far[0] + 2, far[1] + j * 1.6, far[0] + 3.4, far[1] + j * 1.6, C.mudDeep);
  s.commit();
}

function drawMound(s: SpriteCanvas, sink: number): void {
  s.dot(-3, -17 + sink, 13, C.mudDark);
  s.dot(-4, -19 + sink, 12, C.mud);
  s.dot(3, -13 + sink, 8, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 3);
  s.dot(-5.6, -22.6 + sink, 8.4, mix(C.mud, C.mudLight, 0.5));
  s.dot(-6, -23 + sink, 7, C.mudLight);
  s.dot(-7.5, -25 + sink, 3.5, mix(C.mudLight, C.mudRim, 0.5));
  for (let a = 3.5; a < 4.5; a += 0.05) s.set(-6 + Math.cos(a) * 5, -23 + sink + Math.sin(a) * 5, C.wetSky);
  for (let a = 3.7; a < 4.2; a += 0.05) s.set(-6 + Math.cos(a) * 5.5, -23 + sink + Math.sin(a) * 5.5, WHITE);
  glint(s, -9.5, -26 + sink, WHITE);
  for (const [x, y, r, a0, a1] of FOLDS)
    for (let a = a0; a < a1; a += 0.5 / r) {
      s.set(x + Math.cos(a) * r, y + sink + Math.sin(a) * r, C.mudDeep);
      s.set(x + Math.cos(a) * (r - 0.6), y + sink + Math.sin(a) * (r - 0.6), C.mudLight);
    }
  for (const [x, y, r] of PEBBLES) {
    s.dot(x, y + sink, r + 0.4, C.pebbleDark);
    s.dot(x - 0.15, y + sink - 0.15, r, C.pebble);
    s.set(x - 0.4, y + sink - 0.5, C.pebbleLight);
    s.set(x, y + sink - 0.5, C.pebbleLight);
  }
  for (let a = 0.6; a < 2.2; a += 0.05) s.set(3 + Math.cos(a) * 8.2, -13 + sink + Math.sin(a) * 8.2, C.mudDeep);
  for (const [x, y, r] of BUBBLES) {
    s.dot(x, y + sink, r + 0.3, C.mudLight);
    s.dot(x + 0.15, y + sink + 0.15, r, mix(C.mud, C.mudDark, 0.5));
    s.set(x - 0.4, y + sink - 0.4, C.mudGlint);
  }
  for (const [x0, y0, x1, y1] of STREAKS) s.hairline(x0, y0 + sink, x1, y1 + sink, C.mudRim);
}

function drawHood(s: SpriteCanvas, sink: number): void {
  for (let a = -3; a < -0.8; a += 0.12) s.dot(-4 + Math.cos(a) * 11, -19 + sink + Math.sin(a) * 11.5, 1.7, C.moss);
  s.shadeEdges(C.moss, C.mossLight, C.mossDeep);
  for (let a = -2.9; a < -0.9; a += 0.25) {
    const x = -4 + Math.cos(a) * 9.6;
    const y = -19 + sink + Math.sin(a) * 10;
    const len = 0.8 + (((a * 7) % 1) + 1) * 0.5;
    s.stroke(x, y, x + 0.2, y + len, 0.35, C.mossDeep);
    s.set(x, y + len, C.moss);
  }
  for (let a = -2.8; a < -1; a += 0.06) s.set(-4 + Math.cos(a) * 12.4, -19 + sink + Math.sin(a) * 12.8, C.reedLight);
  for (let a = -2.6; a < -1.4; a += 0.3) glint(s, -4 + Math.cos(a) * 11.6, -19 + sink + Math.sin(a) * 12, C.mossLight);
}

function drawBody(s: SpriteCanvas, look: HulkLook): void {
  const { crouch: sink, step } = look;
  s.begin();
  drawMound(s, sink);
  if (look.cracked) drawCracks(s, CRACKS, look.gathered, sink);
  else drawHood(s, sink);
  drawMotes(s, look, MOTES, sink);
  s.taper(4, -8 + sink, 5 + step, -1.2, 3.4, 4.6, C.mud);
  s.stroke(0.5 + step, -0.5, 10 + step, -0.5, 1, C.mudLight);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.shadeEdges(C.mudLight, C.mudRim, C.mudDark);
  glint(s, 2.5, -7 + sink, C.mudGlint);
  for (const x of [3.5, 6, 8.5]) s.hairline(x + step, -1.2, x + step, 0.4, C.mudDark);
  s.commit();
}

function drawSludge(s: SpriteCanvas, look: HulkLook): void {
  const { time, crouch: sink } = look;
  s.begin();
  for (const [x, y, len, phase] of SLUDGE) {
    const d = (time * 0.7 + phase) % 1;
    const reach = len * (0.6 + 0.4 * Math.min(1, d * 3));
    s.taper(x, y + sink - 1, x, y + sink + reach, 1, 0.4, C.mud);
    s.dot(x, y + sink + reach, 0.7, C.mud);
  }
  s.shadeEdges(C.mud, C.mudLight, C.mudDark);
  for (const [x, y, len] of SLUDGE) s.set(x - 0.4, y + sink + len * 0.6, C.wetSky);
  s.commit(false);
}

function drawNearArm(s: SpriteCanvas, look: HulkLook): void {
  const { crouch: sink, near } = look;
  s.begin();
  s.taper(3, -18 + sink, near[0], near[1], 3.2, 4.2, C.mud, ELBOW.near);
  s.dot(near[0], near[1], 5, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.taper(3, -20 + sink, near[0] - 0.5, near[1] - 2.8, 0.9, 1.5, C.mudLight, ELBOW.near);
  s.taper(4, -16 + sink, near[0] + 1, near[1] + 2.4, 0.8, 1.2, C.mudDark, ELBOW.near);
  s.taper(3, -20.6 + sink, near[0] - 0.5, near[1] - 3.6, 0.3, 0.3, C.wetSkyDim, ELBOW.near);
  s.dot(near[0] - 1, near[1] - 1.5, 2.6, C.mudLight);
  s.dot(near[0] - 1.6, near[1] - 2.2, 1.2, mix(C.mudLight, C.mudRim, 0.5));
  glint(s, near[0] - 2.5, near[1] - 3, WHITE);
  for (let j = -1; j <= 1; j++) {
    s.hairline(near[0] + 1.8, near[1] + j * 1.6, near[0] + 3.6, near[1] + j * 1.6, C.mudDeep);
    glint(s, near[0] + 2.2, near[1] + j * 1.6 - 0.6, C.mudRim);
  }
  for (let a = 3.6; a < 5; a += 0.08) s.set(near[0] + Math.cos(a) * 4.7, near[1] + Math.sin(a) * 4.7, C.wetSky);
  glint(s, near[0] + 0.5, near[1] - 4.2, C.mudGlint);
  s.commit();
}

function drawHeldGlob(s: SpriteCanvas, look: HulkLook): void {
  const { near, gathered: u } = look;
  s.begin();
  s.dot(near[0], near[1] - 6, 2.6 + u * 1.4, C.glob);
  s.shadeEdges(C.glob, C.globLight, C.globDeep);
  s.dot(near[0] - 1, near[1] - 7, 1.2 + u * 0.6, C.globLight);
  glint(s, near[0] - 1.8, near[1] - 7.8 - u * 0.4, C.mudGlint);
  s.block(near[0] + 1, near[1] - 5, C.wart);
  s.block(near[0] - 2, near[1] - 4.5, C.wart);
  s.set(near[0] + 1, near[1] - 5, C.wartHot);
  s.commit();
}

function drawHead(s: SpriteCanvas, look: HulkLook): void {
  const { time } = look;
  s.begin();
  const hy = -24 + look.crouch;
  s.dot(10, hy, 5.5, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.dot(9, hy - 2, 3.4, C.mudLight);
  s.stroke(7, hy - 3, 14.5, hy - 2, 1.1, C.mudLight);
  s.shadeEdges(C.mudLight, C.mudRim, C.mudLight);
  s.hairline(8.5, hy - 1.4, 15, hy - 0.6, C.mudDeep);
  for (let a = -2.6; a < -0.5; a += 0.08) s.set(10 + Math.cos(a) * 5.4, hy + Math.sin(a) * 5.4, C.mudRim);
  for (let a = -2.5; a < -1.3; a += 0.08) s.set(10 + Math.cos(a) * 5.4, hy + Math.sin(a) * 5.4, C.wetSky);
  glint(s, 7.5, hy - 3.6, C.mudGlint);
  glint(s, 11, hy - 3.2, C.mudGlint);
  drawHulkEyes(s, look, [
    [12, hy - 0.5],
    [14, hy],
  ]);
  s.taper(10, hy + 3.5, 15, hy + 2.5, 0.7, 1.2, C.maw);
  s.hairline(10.5, hy + 4.4, 14.6, hy + 3.4, C.mudLight);
  const drool = (time * 2) % 1;
  s.stroke(12, hy + 4, 12, hy + 4.5 + drool * 2, 0.3, C.mudLight);
  s.dot(12, hy + 5 + drool * 2, 0.45, C.mudLight);
  s.set(11.8, hy + 4.8 + drool * 2, C.mudGlint);
  s.commit();
}

function drawFistDrips(s: SpriteCanvas, look: HulkLook): void {
  s.begin();
  for (const [x, y, i] of [[...look.near, 0] as const, [...look.far, 1] as const]) {
    const d = (look.time * 1.6 + i * 0.5) % 1;
    drip(s, x - 1 + i * 2, y + 4 + d * 5, d < 0.25 ? d * 8 : 0);
  }
  s.commit(false);
}

function drawMudPile(s: SpriteCanvas, look: HulkLook): void {
  const u = look.gathered;
  s.begin();
  s.dot(15, 0, 1.5 + u * 2, C.mud);
  s.dot(19, 0.4, 1 + u * 1.4, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark);
  glint(s, 14, -1 - u * 1.6, C.wetSky);
  s.commit();
}

export function drawStandingHulk(s: SpriteCanvas, look: HulkLook, holdsGlob: boolean, rushing: boolean): void {
  s.shift(look.rear, look.drop);
  drawReeds(s, look);
  drawFarLimbs(s, look);
  drawBody(s, look);
  drawSludge(s, look);
  drawNearArm(s, look);
  if (holdsGlob) drawHeldGlob(s, look);
  drawHead(s, look);
  drawFistDrips(s, look);
  s.shift(0, 0);
  if (rushing) drawMudPile(s, look);
}
