import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { RAIN_FOES as C } from "./colors";
import { tongueLength } from "./mire";

const canvas = new SpriteCanvas(72, 32, 22, 28);

/** a squat swamp toad lit on its back, warts glowing violet; its throat swells before it lashes or spits */
export function drawMire(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const hop = e.state === "hop";
  const rising = hop && e.vy < 0;
  const puff = e.state === "wind" ? clamp(e.st / (0.6 * waveScale(game.wave).windup)) : 0;
  const breathe = e.state === "walk" ? Math.sin(time * 4) * 0.4 : 0;
  const squash = hop ? -1.5 : e.state === "wind" ? 0.8 : 0;
  const by = -6 + squash * 0.6;
  s.clear();
  // far legs
  s.begin();
  if (hop) {
    s.stroke(-4, by + 2, rising ? -11 : -8, rising ? 1 : -1, 1.5, C.toadDark);
    s.stroke(3, by + 3, 6, 0, 1.1, C.toadDark);
  } else {
    s.stroke(-5, by + 2, -8, -1, 1.7, C.toadDark);
    s.stroke(-8, -1, -5, -0.5, 1, C.toadDark);
    s.stroke(3, by + 3, 5, -0.5, 1.1, C.toadDark);
  }
  s.commit();
  // body: a wide low dome, the head rising forward, the pale belly under
  s.begin();
  s.dot(-1, by + 0.5, 6.8 + squash * 0.3, C.toad);
  s.dot(4, by - 1.5, 5, C.toad);
  s.dot(-2, by - 2, 4, C.toadLight);
  s.dot(2.5, by - 3.5, 2.6, C.toadLight);
  for (let a = -2.7; a < -0.5; a += 0.22) s.set(-1 + Math.cos(a) * 6.5, by + 0.5 + Math.sin(a) * 6.3, C.toadRim);
  s.stroke(-4, by + 5, 5, by + 4, 1, C.belly);
  for (const [x, y] of [
    [-5, by - 1],
    [-2, by - 4],
    [1, by - 1],
    [-6, by + 2],
  ])
    s.set(x, y, Math.sin(time * 3 + x) > 0.2 ? C.wart : mix(C.wart, C.toad, 0.5));
  // eyes bulge on top of the head
  s.dot(5, by - 5.5, 1.6, C.toadLight);
  s.set(6, by - 6, e.state === "wind" ? WHITE : C.eye);
  s.commit();
  // throat sac swells under the jaw during the wind-up
  if (puff > 0 || e.state === "shoot") {
    s.begin();
    const r = e.state === "shoot" ? 2 : 1.5 + puff * 3 + Math.sin(t * 30) * 0.3 * puff;
    s.dot(6.5, by + 2, r, mix(C.sac, C.sacHot, puff));
    s.set(6, by + 1, WHITE);
    s.commit();
  }
  // the tongue whips out straight ahead
  const L = tongueLength(e);
  if (L > 0) {
    s.begin();
    s.stroke(8, by, 8 + L, by - 1, 0.6, C.tongue);
    s.dot(8 + L, by - 1, 1.4, C.tongueTip);
    s.commit();
  }
  // near legs: a folded haunch, or kicked out behind in a hop
  s.begin();
  if (hop) {
    s.stroke(-3, by + 3, rising ? -9 : -7, rising ? 2 : 0, 1.8, C.toad);
    s.stroke(5, by + 4, 9, rising ? 1 : 0, 1.2, C.toad);
  } else {
    s.dot(-4, by + 3 + breathe, 3, C.toad);
    s.stroke(-6, -1, -1, -0.5, 1.1, C.toadLight);
    s.stroke(5, by + 4, 7, -0.5, 1.2, C.toad);
    s.stroke(7, -0.5, 9, -0.5, 0.7, C.toadLight);
  }
  s.commit();
  s.outline(C.outline);
  return s;
}
