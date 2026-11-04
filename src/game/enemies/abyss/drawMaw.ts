import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { AC, rimLight, VOID } from "./colors";
import { MAW_DID, MAW_WINDUP } from "./maw";

const canvas = new SpriteCanvas(104, 84, 52, 76);
type Pt = readonly [number, number];
const HINGE: Pt = [3, -19];
/** spines along the hump, as base points and how far each leans back */
const SPINES: readonly (readonly [number, number, number])[] = [
  [-20, -16, 4],
  [-16, -22, 5],
  [-11, -27, 6],
  [-5, -29, 6],
  [1, -29, 4],
];
const EYES: readonly Pt[] = [
  [8, -27],
  [12, -26],
  [6, -24],
  [15, -24],
];

interface Pose {
  /** how wide the jaws gape, 0 to 1 */
  gape: number;
  /** how bright the gullet burns, 0 to 1 */
  heat: number;
  /** how far it rears back on its hind legs, in radians */
  rear: number;
  /** where the near hand rests */
  hand: Pt;
}

function poseOf(e: Enemy, t: number): Pose {
  const w = waveScale(game.wave).windup;
  const breathe = 0.12 + Math.sin(t * 2) * 0.06;
  const rest: Pose = { gape: breathe, heat: 0.15, rear: 0, hand: [16, 0] };
  if (e.state === "wind") {
    const k = clamp(e.st / (MAW_WINDUP.bite * w));
    return { gape: 0.3 + k * 0.7, heat: k * 0.7, rear: -0.08 * k, hand: [14, 0] };
  }
  if (e.state === "lunge") return { gape: e.st < 0.1 ? 1 : 0, heat: 0.5, rear: 0.06, hand: [20, 0] };
  if (e.state === "charge") {
    const k = clamp(e.st / (MAW_WINDUP.spit * w));
    return { gape: 0.4 + k * 0.4, heat: 0.3 + k * 0.7, rear: -0.12 * k, hand: [15, 0] };
  }
  if (e.state === "shoot") return { gape: 0.9, heat: 1, rear: -0.15, hand: [15, 0] };
  if (e.state === "volley") {
    const k = clamp(e.st / (MAW_WINDUP.rear * w));
    return { gape: 0.3 + k * 0.3, heat: 0.2 + k * 0.4, rear: -0.45 * Math.sqrt(k), hand: [10 - k * 2, -10 - k * 22] };
  }
  if (e.state === "recover" && e.n === MAW_DID.slam && e.st < 0.35)
    return { gape: 0.5, heat: 0.6, rear: 0.04, hand: [21, 0] };
  if (e.state === "recover" && e.n === MAW_DID.spit) return { ...rest, gape: 0.5, heat: 0.4 };
  return rest;
}

/** turn p by angle a around the pivot */
function turn(p: Pt, pivot: Pt, a: number): [number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = p[0] - pivot[0];
  const y = p[1] - pivot[1];
  return [pivot[0] + x * c - y * s, pivot[1] + x * s + y * c];
}

/** a hulking hunched crawler that is mostly mouth: spined hump, clustered eyes, toothed jaws that open on a burning gullet */
export function drawMaw(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const step = e.state === "walk" ? Math.floor(time * 3) % 2 : 0;
  const lift = e.state === "walk" ? step : 0;
  // the body rears around its hind foot
  const B = (x: number, y: number): [number, number] => {
    const [a, b] = turn([x, y], [-16, 0], p.rear);
    return [a, Math.min(b - lift, 0)];
  };
  const upper = (x: number, y: number) => B(...turn([x, y], HINGE, -p.gape * 0.5));
  const lower = (x: number, y: number) => B(...turn([x, y], HINGE, p.gape * 0.42));
  s.clear();
  // far limbs, in shadow
  s.begin();
  s.stroke(...B(-14, -10), -19 - step, -4, 2.6, AC.bodyDark);
  s.stroke(-19 - step, -4, -16 - step, 0, 2.2, AC.bodyDark);
  s.stroke(...B(1, -15), ...B(7, -8), 2.6, AC.bodyDark);
  s.stroke(...B(7, -8), 9 + step, 0, 2.2, AC.bodyDark);
  s.commit();
  // the hump and its spines
  s.begin();
  for (const [x, y, back] of SPINES) s.stroke(...B(x, y), ...B(x - back, y - 5), 0.9, AC.bodyLight);
  s.dot(...B(-16, -11), 9, AC.body);
  s.dot(...B(-8, -17), 12.5, AC.body);
  s.dot(...B(0, -19), 9.5, AC.body);
  s.dot(...B(-10, -22), 6, AC.bodyLight);
  s.dot(...B(-3, -24), 3.5, AC.bodyLight);
  s.stroke(...B(-14, -10), -14 + step, 0, 3, AC.body);
  s.commit();
  // the gullet, burning brighter as it gathers a spit or a bite
  s.begin();
  const gul = mix(AC.gullet, VOID[3], p.heat * 0.6);
  s.poly([B(...HINGE), upper(25, -19), lower(23, -15)], gul);
  if (p.gape > 0.25) {
    s.dot(...B(9, -18), 2.5 + p.heat * 2, mix(AC.gulletHot, VOID[4], p.heat));
    s.dot(...B(8, -18), 1 + p.heat * 1.2, p.heat > 0.6 ? VOID[5] : AC.gulletHot);
    s.set(...B(8, -18), AC.eyeHot);
  }
  s.commit(false);
  // the lower jaw with its upturned teeth
  s.begin();
  s.poly([lower(1, -18), lower(24, -15), lower(22, -10), lower(7, -6), lower(0, -10)], AC.body);
  s.poly([lower(6, -8), lower(21, -11), lower(22, -10), lower(7, -6)], AC.bodyDark);
  for (let x = 7; x <= 22; x += 3) {
    s.set(...lower(x, -16 + (x - 7) * 0.05), AC.tooth);
    s.set(...lower(x, -17 + (x - 7) * 0.05), x % 2 ? AC.tooth : AC.toothDark);
  }
  s.commit();
  // the upper jaw, the brow over it and its cluster of eyes
  s.begin();
  s.poly([upper(-2, -30), upper(14, -30), upper(26, -23), upper(25, -19), upper(3, -19)], AC.body);
  s.poly([upper(0, -29), upper(13, -29), upper(20, -26), upper(4, -25)], AC.bodyLight);
  for (let x = 7; x <= 24; x += 3) {
    s.set(...upper(x, -19), AC.tooth);
    s.set(...upper(x, -18), x % 2 ? AC.tooth : AC.toothDark);
  }
  const hot = e.state === "wind" || e.state === "charge" || e.state === "volley";
  EYES.forEach(([x, y], i) => {
    const blink = (time + i * 0.9) % 4.3 < 0.1;
    if (!blink) s.set(...upper(x, y), hot ? AC.eyeHot : AC.eye);
  });
  s.commit();
  // the near arm and its hooked claws
  s.begin();
  const [hx, hy] = e.state === "volley" ? B(...p.hand) : p.hand;
  const elbow = B(10, -9);
  s.stroke(...B(5, -15), ...elbow, 3, AC.body);
  s.stroke(...elbow, hx, hy - 2, 2.6, AC.body);
  for (let j = -1; j <= 1; j++) s.stroke(hx, hy - 2, hx + 4, hy - 1 + j * 1.2, 0.6, AC.claw);
  s.commit();
  rimLight(s, AC.rim);
  s.outline(AC.outline);
  return s;
}
