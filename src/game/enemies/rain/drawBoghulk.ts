import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { HULK_WINDUP } from "./boghulk";
import { RAIN_FOES as C } from "./colors";
import { glint } from "./detail";

const canvas = detailCanvas(100, 66, 50, 60);

type Point = [number, number];

/** the reeds behind the back: root x, height and lean */
const REEDS = [
  [-12, 15, -0.5],
  [-8, 19, -0.2],
  [-4, 14, 0.1],
  [-15, 11, -0.8],
] as const;
/** the violet rift motes sunk in the mud, from the feet */
const MOTES = [
  [-9, -13],
  [-3, -17],
  [-12, -20],
  [1, -9],
  [-6, -8],
] as const;
/** bubbles rising through the mud on the body's lit side, from the feet */
const BUBBLES = [
  [-12, -14, 0.5],
  [-1.5, -21, 0.4],
  [-9, -8, 0.4],
] as const;
/** wet streaks where the storm light catches the mud, from the feet: start and end */
const STREAKS = [
  [-13.5, -18, -13, -16],
  [-5, -12, -4, -11.2],
  [-10, -11, -9.4, -10],
] as const;

/** folds where one flow of mud has slid over another, from the feet: centre, radius and the arc's start and end angle */
const FOLDS = [
  [-5, -15, 9.5, 0.5, 1.9],
  [-7, -19, 6.5, 0.3, 1.5],
  [2, -12, 5.5, 0.9, 2.3],
] as const;
/** stones packed in the mud, from the feet: x, y and radius */
const PEBBLES = [
  [-10.5, -10.5, 1.1],
  [-2, -7.5, 0.9],
  [-13, -15.5, 0.8],
  [0.5, -15, 0.7],
] as const;
/** sludge hanging from the belly and the back, from the feet: x, y, length and its place in the drip cycle */
const SLUDGE = [
  [-13, -9, 2.6, 0],
  [-9.5, -5.5, 3.2, 0.4],
  [-3.5, -4.8, 2.4, 0.7],
  [1, -5.2, 3, 0.2],
] as const;
/** how far the elbow pushes out of the straight line from shoulder to fist */
const ELBOW = { near: 1.3, far: 1 };

/** where the near and far fists are for the state: low at rest, raised for the slam, back for a scoop or a lob */
function fists(e: Enemy, step: number, u: number): [Point, Point] {
  switch (e.state) {
    case "wind":
      return [
        [4 - u * 4, -30 - u * 14],
        [-2 - u * 4, -30 - u * 12],
      ];
    case "swipe":
      return [
        [26, -3],
        [21, -3],
      ];
    case "charge":
      return [
        [-6 - u * 10, -3],
        [-10 - u * 8, -4],
      ];
    case "volley":
      return [
        [-4 - u * 8, -32 - u * 10],
        [6, -6],
      ];
    case "shoot":
      return e.st < 0.2
        ? [
            [24, -12],
            [18, -6],
          ]
        : [
            [16, -6],
            [10, -5],
          ];
    default:
      return [
        [12, -4 - step],
        [6, -4 + step],
      ];
  }
}

/** how far the current wind-up has gathered, 0 to 1 */
function gathered(e: Enemy): number {
  const fast = e.hp < e.max * 0.5 ? 0.75 : 1;
  const w =
    e.state === "wind"
      ? HULK_WINDUP.slam
      : e.state === "charge"
        ? HULK_WINDUP.wave
        : e.state === "volley"
          ? HULK_WINDUP.globs
          : 0;
  return w ? clamp(e.st / (w * fast * waveScale(game.wave).windup)) : 0;
}

/** a teardrop of wet mud hanging at this point, a thread above it while it stretches */
function drip(s: SpriteCanvas, x: number, y: number, stretch: number): void {
  if (stretch > 0) s.stroke(x, y - stretch, x, y, 0.3, C.mudLight);
  s.dot(x, y + 0.3, 0.6, C.mudLight);
  s.set(x - 0.3, y, C.mudGlint);
}

/**
 * A hunched hill of wet bog mud lit from the top left, glossy where the storm catches it, with a mossy hood on its
 * back, reeds and cattails rising from it, violet rift motes and bubbles in the mud, glowing eyes under a heavy brow
 * and two great dripping fists.
 */
export function drawBoghulk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const step = e.state === "walk" ? (Math.floor(time * 3) % 2) * 2 - 1 : 0;
  const u = gathered(e);
  const [near, far] = fists(e, step, u);
  const hot = e.state === "wind" || e.state === "charge" || e.state === "volley";
  const sink = e.state === "swipe" ? 2 : hot ? u * 1.5 : 0;
  s.clear();
  // reeds and cattails behind the back, swaying in the storm
  s.begin();
  const heads: Point[] = [];
  for (const [x, h, lean] of REEDS) {
    const sway = Math.sin(time * 2.4 + x) * 1.2;
    const by = -30 + sink + Math.abs(x + 8) * 0.4;
    const tx = x + lean * h + sway;
    const ty = by - h;
    s.stroke(x, by, tx, ty, 0.5, C.reed);
    heads.push([tx, ty]);
  }
  s.shadeEdges(C.reed, C.reedLight, C.reedDark);
  s.commit(false);
  s.begin();
  REEDS.forEach(([, , lean], i) => {
    const [tx, ty] = heads[i];
    s.stroke(tx - lean * 3, ty + 3, tx, ty, 0.9, C.cattail);
    s.set(tx, ty - 1, C.reedLight);
    s.set(tx, ty - 0.5, C.reedLight);
  });
  s.shadeEdges(C.cattail, C.cattailLight, C.mudDeep);
  for (const [tx, ty] of heads) glint(s, tx - 0.5, ty + 0.5, C.mudGlint);
  s.commit();
  // far arm and leg in shadow
  s.begin();
  s.taper(-7, -9 + sink, -8 - step, -1, 3.2, 4.2, C.mudDark);
  s.taper(-1, -24 + sink, far[0], far[1], 2.8, 3.6, C.mudDark, ELBOW.far);
  s.dot(far[0], far[1], 4.2, C.mudDark);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 2);
  for (let j = -1; j <= 1; j++) s.hairline(far[0] + 2, far[1] + j * 1.6, far[0] + 3.4, far[1] + j * 1.6, C.mudDeep);
  s.commit();
  // the body: a heavy mound leaning forward, lit from the top left, in deep shadow underneath
  s.begin();
  s.dot(-3, -17 + sink, 13, C.mudDark);
  s.dot(-4, -19 + sink, 12, C.mud);
  s.dot(3, -13 + sink, 8, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep, 3);
  // the mound's lit crown with a wet gloss on it, and a fold of shadow where the front bulge meets it
  s.dot(-5.6, -22.6 + sink, 8.4, mix(C.mud, C.mudLight, 0.5));
  s.dot(-6, -23 + sink, 7, C.mudLight);
  s.dot(-7.5, -25 + sink, 3.5, mix(C.mudLight, C.mudRim, 0.5));
  for (let a = 3.5; a < 4.5; a += 0.05) s.set(-6 + Math.cos(a) * 5, -23 + sink + Math.sin(a) * 5, C.wetSky);
  for (let a = 3.7; a < 4.2; a += 0.05) s.set(-6 + Math.cos(a) * 5.5, -23 + sink + Math.sin(a) * 5.5, WHITE);
  glint(s, -9.5, -26 + sink, WHITE);
  // folds where one flow of mud has slid over another: a dark crease with a wet lip above it
  for (const [x, y, r, a0, a1] of FOLDS)
    for (let a = a0; a < a1; a += 0.5 / r) {
      s.set(x + Math.cos(a) * r, y + sink + Math.sin(a) * r, C.mudDeep);
      s.set(x + Math.cos(a) * (r - 0.6), y + sink + Math.sin(a) * (r - 0.6), C.mudLight);
    }
  // stones packed in the mud, wet on top
  for (const [x, y, r] of PEBBLES) {
    s.dot(x, y + sink, r + 0.4, C.pebbleDark);
    s.dot(x - 0.15, y + sink - 0.15, r, C.pebble);
    s.set(x - 0.4, y + sink - 0.5, C.pebbleLight);
    s.set(x, y + sink - 0.5, C.pebbleLight);
  }
  for (let a = 0.6; a < 2.2; a += 0.05) s.set(3 + Math.cos(a) * 8.2, -13 + sink + Math.sin(a) * 8.2, C.mudDeep);
  // small bubbles and wet streaks in the mud
  for (const [x, y, r] of BUBBLES) {
    s.dot(x, y + sink, r + 0.3, C.mudLight);
    s.dot(x + 0.15, y + sink + 0.15, r, mix(C.mud, C.mudDark, 0.5));
    s.set(x - 0.4, y + sink - 0.4, C.mudGlint);
  }
  for (const [x0, y0, x1, y1] of STREAKS) s.hairline(x0, y0 + sink, x1, y1 + sink, C.mudRim);
  // a mossy hood over the back, its fringe hanging in strands, its edge lit by the storm
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
  // the rift motes glow in turn, all at once while it gathers, each with a hot core
  for (const [x, y] of MOTES) {
    const lit = Math.sin(time * 2.5 + x * 0.7) > -0.2 || hot;
    s.block(x, y + sink, lit ? C.wart : mix(C.wart, C.mud, 0.5));
    if (lit) s.set(x, y + sink, C.wartHot);
  }
  // near leg, a heavy stump with toes of packed mud
  s.taper(4, -8 + sink, 5 + step, -1.2, 3.4, 4.6, C.mud);
  s.stroke(0.5 + step, -0.5, 10 + step, -0.5, 1, C.mudLight);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.shadeEdges(C.mudLight, C.mudRim, C.mudDark);
  glint(s, 2.5, -7 + sink, C.mudGlint);
  for (const x of [3.5, 6, 8.5]) s.hairline(x + step, -1.2, x + step, 0.4, C.mudDark);
  s.commit();
  // sludge hanging from the belly, each strand stretching and letting go in turn
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
  // near arm: a thick limb ending in a fist of packed mud, glossy on its knuckles
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
  // a glob of bog held up to be thrown, rift motes glowing in it
  if (e.state === "volley") {
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
  // the head thrust forward from the shoulders: a heavy lit brow, glowing eyes, a slack dripping mouth
  s.begin();
  const hy = -24 + sink;
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
  // the eyes: a violet glow around a pale core with a white hot centre, burning whiter as an attack gathers
  const eye = hot ? mix(C.eye, WHITE, u) : C.eye;
  for (const [x, y] of [
    [12, hy - 0.5],
    [14, hy],
  ]) {
    s.dot(x + 0.25, y + 0.25, 0.9, hot ? mix(C.kiteVein, C.wartHot, u) : C.kiteVein);
    s.block(x - 0.25, y - 0.25, eye);
    s.set(x - 0.25, y - 0.25, WHITE);
  }
  // the slack mouth, a lit lower lip, and mud drooling from it
  s.taper(10, hy + 3.5, 15, hy + 2.5, 0.7, 1.2, C.maw);
  s.hairline(10.5, hy + 4.4, 14.6, hy + 3.4, C.mudLight);
  const drool = (time * 2) % 1;
  s.stroke(12, hy + 4, 12, hy + 4.5 + drool * 2, 0.3, C.mudLight);
  s.dot(12, hy + 5 + drool * 2, 0.45, C.mudLight);
  s.set(11.8, hy + 4.8 + drool * 2, C.mudGlint);
  s.commit();
  // mud drips from the fists
  s.begin();
  for (const [x, y, i] of [[...near, 0] as const, [...far, 1] as const]) {
    const d = (time * 1.6 + i * 0.5) % 1;
    drip(s, x - 1 + i * 2, y + 4 + d * 5, d < 0.25 ? d * 8 : 0);
  }
  s.commit(false);
  s.outline(C.outline);
  return s;
}
