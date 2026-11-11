import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { RAIN_FOES as C } from "./colors";
import { glint } from "./detail";
import { MIRE_WINDUP, tongueLength } from "./mire";

const canvas = detailCanvas(80, 36, 26, 32);
/** the toad is drawn on a small grid and scaled up to stand a little under half Kael's height */
const K = 1.25;
/** dark mottles on the back, on the toad's grid from the body's centre line */
const MOTTLES = [
  [-5.6, -5.4, 0.85],
  [-2.2, -3.8, 0.8],
  [0.4, -7.6, 0.7],
  [3.6, -5.6, 0.8],
  [-0.6, -5.6, 0.6],
] as const;
/** the glowing warts, on the toad's grid */
const WARTS = [
  [-4, -6],
  [-1, -8],
  [1, -5],
  [-5, -3],
  [2, -9],
] as const;

/**
 * A squat swamp toad lit from the top left with a wet sheen on its back, mottled and studded with warts that glow
 * violet; its throat swells before it lashes or spits, and its eye burns white as it does.
 */
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
  const taper = (x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: number, bend = 0) =>
    s.taper(x0 * K, y0 * K, x1 * K, y1 * K, r0 * K, r1 * K, c, bend * K);
  const set = (x: number, y: number, c: number) => s.set(x * K, y * K, c);
  const shine = (x: number, y: number, c: number) => glint(s, x * K, y * K, c);
  const pip = (x: number, y: number, c: number) => s.block(x * K, y * K, c);
  s.clear();
  // far legs, in shadow
  s.begin();
  if (hop) taper(-4, by - 3, rising ? -11 : -9, rising ? -1 : -2, 1.5, 0.7, C.toadDark, rising ? 0.6 : 1.4);
  else dot(-6, -2.5, 2.6, C.toadDark);
  stroke(4, by - 3, 5.5, 0, 0.8, C.toadDark);
  s.shadeEdges(C.toadDark, C.toad, C.toadDeep);
  s.commit();
  // body: a wide low dome with the head rising forward, the eye in a bump on top, a pale belly along the floor
  s.begin();
  dot(-1.5, by - 5 + breathe, 5.2, C.toad);
  dot(4, by - 5, 4.3, C.toad);
  dot(5, by - 8.6, 1.9, C.toad);
  stroke(-4, by - 1.2, 7.5, by - 2, 1, C.belly);
  s.shadeEdges(C.toad, C.toadLight, C.toadDark, 2);
  s.shadeEdges(C.belly, C.bellyLight, C.bellyDark);
  // the back's volume: a lit crown over the dome and the head, mottles in shadow, a storm rim along the top
  dot(-2.7, by - 6.7 + breathe, 3.7, C.toadLight);
  dot(3.2, by - 7.2, 2.3, C.toadLight);
  for (const [x, y, r] of MOTTLES) dot(x, by + y + breathe * 0.5, r, C.toadSpot);
  for (let a = -2.5; a < -0.9; a += 0.06)
    set(-1.5 + Math.cos(a) * 4.95, by - 5 + breathe + Math.sin(a) * 4.95, a < -1.5 ? C.wetSky : C.toadRim);
  for (let a = -2.6; a < -1.2; a += 0.1) set(5 + Math.cos(a) * 1.7, by - 8.6 + Math.sin(a) * 1.7, C.wetSky);
  // a streak of wet running down the flank
  for (let a = -2.9; a < -2.3; a += 0.06)
    set(-1.5 + Math.cos(a) * 3.9, by - 5 + breathe + Math.sin(a) * 3.9, C.toadRim);
  // the wet sheen: glints on the crown and the snout
  shine(-4.2, by - 8.4 + breathe, C.toadGlint);
  shine(-3.4, by - 9 + breathe, C.toadGlint);
  shine(1.8, by - 8.6, C.toadGlint);
  set(-2.2, by - 8 + breathe, C.toadRim);
  // warts glow in turn, all at once while it winds up, each with a hot core
  for (const [x, y] of WARTS) {
    const lit = Math.sin(time * 3 + x) > 0 || winding;
    pip(x, by + y, lit ? C.wart : mix(C.wart, C.toad, 0.5));
    if (lit) set(x, by + y, C.wartHot);
  }
  // the wide mouth line with a lit lip under it
  for (let x = 2; x <= 8.4; x += 0.2) {
    const y = by - 4 + (x - 5) * (x - 5) * 0.04;
    set(x, y - 0.4, C.toadDeep);
    set(x, y, C.toadDeep);
    set(x, y + 0.4, C.toadLight);
  }
  // the eye: a pale ball with a slit pupil and a white glint, all white hot while it winds up
  dot(5.7, by - 9, 0.95, C.outline);
  dot(5.7, by - 9.05, 0.75, winding ? WHITE : C.eye);
  if (winding) {
    set(4.9, by - 9, C.wartHot);
    set(6.5, by - 9, C.wartHot);
  } else {
    for (let y = -9.6; y <= -8.4; y += 0.4) set(6, by + y, C.outline);
    set(5.3, by - 9.5, WHITE);
  }
  s.commit();
  // throat sac swells under the jaw during the wind-up, stretched thin and glossy
  if (puff > 0 || e.state === "shoot") {
    s.begin();
    const r = e.state === "shoot" ? 1.6 : 1.2 + puff * 2.4 + Math.sin(t * 30) * 0.25 * puff;
    const sac = mix(C.sac, C.sacHot, puff);
    dot(6, by - 2.2, r, sac);
    s.shadeEdges(sac, mix(sac, WHITE, 0.45), mix(sac, C.sacDeep, 0.7), 2);
    if (r > 2) {
      dot(6 + r * 0.25, by - 2.2 + r * 0.3, r * 0.45, mix(sac, C.sacDeep, 0.35));
      set(6.2, by - 2.2 - r * 0.5, mix(sac, C.sacDeep, 0.5));
      set(6.2 + r * 0.4, by - 2.2 - r * 0.25, mix(sac, C.sacDeep, 0.5));
    }
    shine(6 - r * 0.45, by - 2.2 - r * 0.45, WHITE);
    set(6 - r * 0.45, by - 2.2 - r * 0.15, WHITE);
    s.commit();
  }
  // the tongue whips out straight ahead, wet and pink with a fat sticky tip
  const L = tongueLength(e) / K;
  if (L > 0) {
    s.begin();
    stroke(8, by - 4, 8 + L, by - 5, 0.5, C.tongue);
    dot(8 + L, by - 5, 1.2, C.tongueTip);
    s.shadeEdges(C.tongueTip, mix(C.tongueTip, WHITE, 0.5), C.tongueDark, 2);
    s.shadeEdges(C.tongue, C.tongueTip, C.tongueDark);
    shine(7.6 + L, by - 5.6, WHITE);
    s.commit();
  }
  // near legs: a folded haunch and a forefoot with splayed toes, or kicked out behind in a hop
  s.begin();
  if (hop) {
    // the hind leg kicks straight as it leaves the floor and folds at the knee as it comes down, toes spread
    const fx = rising ? -10 : -8;
    const fy = rising ? 0 : -1;
    taper(-3, by - 3, fx, fy, 1.9, 0.8, C.toad, rising ? 0.5 : 1.6);
    stroke(fx, fy, fx - 1.8, fy - 0.9, 0.45, C.toad);
    stroke(fx, fy, fx - 2, fy + 0.3, 0.45, C.toad);
    stroke(fx, fy, fx - 1.2, fy + 1.2, 0.45, C.toad);
    taper(5, by - 2, 8, rising ? 0 : -0.5, 1.1, 0.6, C.toad);
    stroke(8, rising ? 0 : -0.5, 9.2, rising ? 0.8 : 0.2, 0.4, C.toad);
    s.shadeEdges(C.toad, C.toadLight, C.toadDark);
    shine(-5, by - 3.4, C.wetSky);
  } else {
    dot(-4, -3.2 + breathe * 0.5, 2.8, C.toad);
    stroke(6.5, -3, 7.5, -0.5, 0.8, C.toad);
    stroke(-6, -0.4, -0.5, -0.4, 0.7, C.toadLight);
    stroke(7, -0.4, 9, -0.4, 0.5, C.toadLight);
    s.shadeEdges(C.toad, C.toadLight, C.toadDark, 2);
    dot(-4.7, -4 + breathe * 0.5, 1.3, C.toadLight);
    shine(-5.4, -5 + breathe * 0.5, C.toadGlint);
  }
  s.commit();
  s.outline(C.outline);
  return s;
}
