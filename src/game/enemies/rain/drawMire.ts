import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { RAIN_FOES as C } from "./colors";
import { MIRE_WINDUP, tongueLength } from "./mire";

const canvas = new SpriteCanvas(80, 36, 26, 32);
/** the toad is drawn on a small grid and scaled up to stand a little under half Kael's height */
const K = 1.25;

/** a squat swamp toad lit on its back, warts glowing violet; its throat swells before it lashes or spits */
export function drawMire(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const hop = e.state === "hop";
  const rising = hop && e.vy < 0;
  const winding = e.state === "wind";
  const puff = winding ? clamp(e.st / ((e.n ? MIRE_WINDUP.spit : MIRE_WINDUP.lash) * waveScale(game.wave).windup)) : 0;
  const breathe = e.state === "walk" ? Math.sin(time * 4) * 0.3 : 0;
  // body height off the floor: stretched in a hop, pressed down while it puffs
  const lift = hop ? (rising ? 1.5 : 0.5) : winding ? -0.6 * puff : 0;
  const by = -lift;
  const dot = (x: number, y: number, r: number, c: number) => s.dot(x * K, y * K, r * K, c);
  const stroke = (x0: number, y0: number, x1: number, y1: number, r: number, c: number) =>
    s.stroke(x0 * K, y0 * K, x1 * K, y1 * K, r * K, c);
  const set = (x: number, y: number, c: number) => s.set(x * K, y * K, c);
  s.clear();
  // far legs, in shadow
  s.begin();
  if (hop) stroke(-4, by - 3, rising ? -11 : -9, rising ? -1 : -2, 1.2, C.toadDark);
  else dot(-6, -2.5, 2.6, C.toadDark);
  stroke(4, by - 3, 5.5, 0, 0.8, C.toadDark);
  s.commit();
  // body: a wide low dome with the head rising forward, the eye in a bump on top
  s.begin();
  dot(-1.5, by - 5 + breathe, 5.2, C.toad);
  dot(4, by - 5, 4.3, C.toad);
  dot(5, by - 8.6, 1.9, C.toad);
  dot(-2.5, by - 6.5 + breathe, 3.2, C.toadLight);
  dot(3, by - 7, 2.2, C.toadLight);
  stroke(-4, by - 1.2, 7.5, by - 2, 1, C.belly);
  for (let a = -2.8; a < -0.6; a += 0.18) set(-1.5 + Math.cos(a) * 5, by - 5 + breathe + Math.sin(a) * 5, C.toadRim);
  set(4.2, by - 10.2, C.toadRim);
  for (const [x, y] of [
    [-4, -6],
    [-1, -8],
    [1, -5],
    [-5, -3],
    [2, -9],
  ])
    set(x, by + y, Math.sin(time * 3 + x) > 0 || winding ? C.wart : mix(C.wart, C.toad, 0.5));
  // the wide mouth line and the eye
  for (let x = 2; x <= 8; x++) set(x, by - 4 + (x - 5) * (x - 5) * 0.04, C.toadDark);
  set(5.2, by - 9.2, winding ? WHITE : C.eye);
  set(6, by - 9.2, winding ? WHITE : C.eye);
  set(6, by - 8.4, C.outline);
  s.commit();
  // throat sac swells under the jaw during the wind-up
  if (puff > 0 || e.state === "shoot") {
    s.begin();
    const r = e.state === "shoot" ? 1.6 : 1.2 + puff * 2.4 + Math.sin(t * 30) * 0.25 * puff;
    dot(6, by - 2.2, r, mix(C.sac, C.sacHot, puff));
    set(6.5, by - 3, WHITE);
    s.commit();
  }
  // the tongue whips out straight ahead
  const L = tongueLength(e) / K;
  if (L > 0) {
    s.begin();
    stroke(8, by - 4, 8 + L, by - 5, 0.5, C.tongue);
    dot(8 + L, by - 5, 1.2, C.tongueTip);
    s.commit();
  }
  // near legs: a folded haunch and a forefoot, or kicked out behind in a hop
  s.begin();
  if (hop) {
    stroke(-3, by - 3, rising ? -10 : -8, rising ? 0 : -1, 1.4, C.toad);
    stroke(5, by - 2, 8, rising ? 0 : -0.5, 0.9, C.toad);
  } else {
    dot(-4, -3.2 + breathe * 0.5, 2.8, C.toad);
    set(-5, -5.6, C.toadRim);
    stroke(-6, -0.4, -0.5, -0.4, 0.7, C.toadLight);
    stroke(6.5, -3, 7.5, -0.5, 0.8, C.toad);
    stroke(7, -0.4, 9, -0.4, 0.5, C.toadLight);
  }
  s.commit();
  s.outline(C.outline);
  return s;
}
