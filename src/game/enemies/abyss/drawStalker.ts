import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { AC, clipBelow, rimLight, VOID } from "./colors";
import { RISE, SINK } from "./stalker";

const canvas = new SpriteCanvas(64, 54, 32, 46);
type Pt = readonly [number, number];

/** how far below the floor the body is: sinking into its pool, then climbing back out as it rises */
function depth(e: Enemy): number {
  if (e.state === "burrow") return e.n === 0 ? 20 * clamp(e.st / SINK) ** 2 : 20;
  if (e.state === "charge") return 20;
  if (e.state === "hop") return 18 * (1 - clamp(e.st / (RISE * 0.45)));
  return 0;
}

/** the shadow pool it sinks into: a flat ink puddle with a crimson lip, cracking with light before it rises */
function drawPool(s: SpriteCanvas, e: Enemy, t: number): void {
  const time = t + e.seed;
  const heat = e.state === "charge" ? clamp(e.st / (0.65 * waveScale(game.wave).windup)) : 0;
  const fade = e.state === "hop" ? 1 - clamp(e.st / RISE) : e.state === "burrow" && e.n === 0 ? clamp(e.st / SINK) : 1;
  const half = Math.round((7 + heat * 3) * fade);
  if (half < 2) return;
  s.begin();
  for (let x = -half; x <= half; x++) {
    const edge = Math.abs(x) >= half - 1;
    s.set(x, 0, edge ? AC.rimSoft : AC.bodyDark);
    if (Math.abs(x) < half - 2) s.set(x, -1, Math.abs(x) >= half - 4 ? AC.rimSoft : AC.body);
  }
  // ripples crawl across the surface
  const r = Math.round(Math.sin(time * 5) * (half - 3));
  s.set(r, -1, AC.rim);
  s.set(-r, 0, AC.rimSoft);
  if (e.state === "charge") {
    // cracks of void light run out from the middle, brighter as the rise nears
    const c = heat > 0.7 ? VOID[5] : heat > 0.35 ? VOID[4] : VOID[3];
    for (let i = 0; i <= Math.round(heat * half); i++) {
      s.set(i, i % 3 === 0 ? -1 : 0, c);
      s.set(-i, i % 3 === 1 ? -1 : 0, c);
    }
    // claw tips poke out of the pool
    const tip = Math.round(heat * 4);
    for (let y = 0; y < tip; y++) {
      s.set(-3, -2 - y, AC.claw);
      s.set(3, -2 - y, AC.claw);
    }
  }
  if (e.state !== "hop") {
    // the eyes watch from the shadow
    const eye = heat > 0.5 ? AC.eyeHot : AC.eye;
    s.set(1 + Math.sign(e.face), -2, eye);
    s.set(3 + Math.sign(e.face), -2, eye);
  }
  s.commit(false);
}

/** a lean void hound on four long limbs: a spined back, a whip tail and a scythe foreleg it raises before a cut */
export function drawStalker(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const sink = depth(e);
  s.clear();
  if (sink < 20) {
    const step = e.state === "walk" ? Math.floor(time * 7) % 2 : 0;
    const wind = e.state === "wind";
    const prowl = e.state === "walk" ? Math.round(Math.sin(time * 14) * 0.5) : 0;
    const hunch = wind ? -2 : e.state === "swipe" ? 1 : 0;
    const y0 = sink + prowl;
    // rising, it rears up on its hind feet, nose to the sky
    const rear = e.state === "hop" ? -0.75 * (1 - clamp(e.st / RISE) ** 2) : 0;
    const ca = Math.cos(rear);
    const sa = Math.sin(rear);
    const P = (x: number, y: number): Pt => [-6 + (x + 6) * ca - y * sa, (x + 6) * sa + y * ca + y0];
    const leg = (a: Pt, b: Pt, c: Pt, r: number, col: number) => {
      s.stroke(...P(...a), ...P(...b), r, col);
      const [fx, fy] = rear ? P(...c) : [c[0], c[1] + sink];
      s.stroke(...P(...b), fx, Math.min(fy, sink), r * 0.8, col);
    };
    const elbow: Pt = e.state === "hop" ? [6, -21] : wind ? [1, -20] : e.state === "swipe" ? [11, -12] : [8, -8 - step];
    const tip: Pt = e.state === "hop" ? [11, -31] : wind ? [-4, -26] : e.state === "swipe" ? [19, -7] : [11, -1 - step];
    // far limbs, in shadow
    s.begin();
    leg([-7, -10 + hunch], [-11 + step, -5], [-8 + step, 0], 1.3, AC.bodyDark);
    leg([3, -11 + hunch], [5 - step, -6], [3 - step, 0], 1.2, AC.bodyDark);
    s.commit();
    // the whip tail, swaying
    s.begin();
    const sway = Math.sin(time * 4) * 2;
    s.stroke(...P(-9, -12 + hunch), ...P(-14, -16 + sway * 0.5), 1.2, AC.body);
    s.stroke(...P(-14, -16 + sway * 0.5), ...P(-19, -13 + sway), 0.9, AC.body);
    s.stroke(...P(-19, -13 + sway), ...P(-21, -9 + sway), 0.6, AC.rimSoft);
    s.commit();
    // the torso, near hind leg, head and spines
    s.begin();
    leg([-5, -10 + hunch], [-8 - step, -5], [-5 - step, 0], 1.5, AC.body);
    s.stroke(...P(-7, -11 + hunch), ...P(2, -13 + hunch), 4, AC.body);
    s.stroke(...P(-6, -13 + hunch), ...P(0, -15 + hunch), 2, AC.bodyLight);
    s.stroke(...P(2, -13 + hunch), ...P(7, -15 + hunch), 2.4, AC.body);
    s.poly([P(5, -19 + hunch), P(10, -19 + hunch), P(15, -15 + hunch), P(13, -13 + hunch), P(6, -12 + hunch)], AC.body);
    s.poly([P(6, -18 + hunch), P(10, -18 + hunch), P(12, -16 + hunch), P(7, -15 + hunch)], AC.bodyLight);
    for (let x = 9; x <= 14; x++) s.set(...P(x, -13 + hunch), AC.bodyDark);
    s.set(...P(13, -12 + hunch), AC.tooth);
    s.set(...P(11, -12 + hunch), AC.tooth);
    for (const x of [-8, -5, -2, 1]) {
      const h = x === -5 || x === -2 ? 5 : 3;
      s.stroke(...P(x, -15 + hunch), ...P(x - 2, -15 - h + hunch), 0.6, AC.bodyLight);
    }
    const hot = wind || e.state === "hop";
    s.set(...P(10, -17 + hunch), hot ? AC.eyeHot : AC.eye);
    s.set(...P(12, -16 + hunch), hot ? AC.eyeHot : AC.eye);
    s.commit();
    // the scythe foreleg and its long pale blade
    s.begin();
    s.stroke(...P(3, -12 + hunch), ...P(...elbow), 1.5, AC.body);
    s.stroke(...P(...elbow), ...P(...tip), 0.9, AC.claw);
    s.set(...P(...tip), wind ? AC.eyeHot : mix(AC.claw, AC.rim, 0.4));
    s.commit();
    rimLight(s, AC.rim);
    if (sink > 0) clipBelow(s, 1);
  }
  if (sink > 0) drawPool(s, e, t);
  s.outline(AC.outline);
  return s;
}
