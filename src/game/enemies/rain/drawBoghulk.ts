import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { HULK_WINDUP } from "./boghulk";
import { RAIN_FOES as C } from "./colors";

const canvas = new SpriteCanvas(100, 66, 50, 60);

type Point = [number, number];

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

/** a hunched hill of bog mud with moss on its back, reeds and cattails rising from it, and two great dripping fists */
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
  for (const [x, h, lean] of [
    [-12, 15, -0.5],
    [-8, 19, -0.2],
    [-4, 14, 0.1],
    [-15, 11, -0.8],
  ]) {
    const sway = Math.sin(time * 2.4 + x) * 1.2;
    const bx = x;
    const by = -30 + sink + Math.abs(x + 8) * 0.4;
    const tx = bx + lean * h + sway;
    const ty = by - h;
    s.stroke(bx, by, tx, ty, 0.5, C.reed);
    s.stroke(tx - lean * 3, ty + 3, tx, ty, 0.9, C.mudDark);
    s.set(tx, ty - 1, C.reedLight);
  }
  s.commit(false);
  // far arm and leg in shadow
  s.begin();
  s.stroke(-7, -9 + sink, -8 - step, 0, 3.6, C.mudDark);
  s.stroke(-1, -24 + sink, far[0], far[1], 3.2, C.mudDark);
  s.dot(far[0], far[1], 4.2, C.mudDark);
  s.commit();
  // the body: a heavy mound leaning forward, lit from above, in shadow underneath
  s.begin();
  s.dot(-3, -17 + sink, 13, C.mudDark);
  s.dot(-4, -19 + sink, 12, C.mud);
  s.dot(3, -13 + sink, 8, C.mud);
  s.dot(-6, -23 + sink, 7, C.mudLight);
  // a mossy hood over the back, its edge lit by the storm
  for (let a = -3; a < -0.8; a += 0.12) s.dot(-4 + Math.cos(a) * 11, -19 + sink + Math.sin(a) * 11.5, 1.7, C.moss);
  for (let a = -2.8; a < -1; a += 0.18) s.set(-4 + Math.cos(a) * 12.4, -19 + sink + Math.sin(a) * 12.8, C.reedLight);
  for (const [x, y] of [
    [-9, -13],
    [-3, -17],
    [-12, -20],
    [1, -9],
    [-6, -8],
  ])
    s.set(x, y + sink, Math.sin(time * 2.5 + x * 0.7) > -0.2 || hot ? C.wart : mix(C.wart, C.mud, 0.5));
  // near leg
  s.stroke(4, -8 + sink, 5 + step, 0, 3.8, C.mud);
  s.stroke(1 + step, -0.5, 9 + step, -0.5, 1, C.mudLight);
  s.commit();
  // near arm: a thick limb ending in a fist of packed mud
  s.begin();
  s.stroke(3, -18 + sink, near[0], near[1], 3.6, C.mud);
  s.stroke(3, -20 + sink, near[0], near[1] - 2.5, 1.2, C.mudLight);
  s.stroke(4, -16 + sink, near[0] + 1, near[1] + 2, 1, C.mudDark);
  s.dot(near[0], near[1], 4.8, C.mud);
  s.dot(near[0] - 1, near[1] - 1.5, 2.6, C.mudLight);
  for (let j = -1; j <= 1; j++) s.set(near[0] + 3, near[1] + j * 1.6, C.mudDark);
  s.set(near[0] - 1, near[1] - 4, C.mudRim);
  s.set(near[0] + 1, near[1] - 4, C.mudRim);
  // a glob of bog held up to be thrown
  if (e.state === "volley") {
    s.dot(near[0], near[1] - 6, 2.6 + u * 1.4, C.glob);
    s.dot(near[0] - 1, near[1] - 7, 1.2 + u * 0.6, C.globLight);
    s.set(near[0] + 1, near[1] - 5, C.wart);
    s.set(near[0] - 2, near[1] - 4, C.wart);
  }
  s.commit();
  // the head thrust forward from the shoulders: a heavy brow, glowing eyes, a slack dripping mouth
  s.begin();
  const hy = -24 + sink;
  s.dot(10, hy, 5.5, C.mud);
  s.dot(9, hy - 2, 3.4, C.mudLight);
  s.stroke(7, hy - 3, 14.5, hy - 2, 1.1, C.mudLight);
  for (let a = -2.6; a < -0.5; a += 0.3) s.set(10 + Math.cos(a) * 5.4, hy + Math.sin(a) * 5.4, C.mudRim);
  const eye = hot ? mix(C.eye, WHITE, u) : C.eye;
  s.set(12, hy - 0.5, eye);
  s.set(14, hy, eye);
  s.set(13, hy, C.kiteVein);
  s.stroke(10, hy + 3.5, 15, hy + 2.5, 0.8, C.outline);
  s.set(12, hy + 5 + ((time * 2) % 1) * 2, C.mudLight);
  s.commit();
  // mud drips from the fists
  s.begin();
  for (const [x, y, i] of [[...near, 0] as const, [...far, 1] as const]) {
    const d = (time * 1.6 + i * 0.5) % 1;
    s.set(x - 1 + i * 2, y + 4 + d * 5, C.mudLight);
  }
  s.commit(false);
  s.outline(C.outline);
  return s;
}
