import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { hurting } from "../strike";
import { flareTime } from "./moves";

const canvas = detailCanvas(24, 34, 12, 18);
const W = GRAVE.wax;
const F = GRAVE.ghost;
const DRIPS = [
  [-3, -2.6, 2.6],
  [0.6, -2.2, 4.8],
  [2.6, -3, 1.8],
] as const;

interface WickPose {
  lean: number;
  flame: number;
  heat: number;
  limp: boolean;
  sway: number;
}

function poseOf(e: Enemy, time: number): WickPose {
  const limp = hurting(e);
  const sway = Math.sin(time * 4) * 0.6;
  if (limp) return { lean: -1.4, flame: 0.4, heat: 0, limp, sway: 0 };
  if (e.state === "wind") {
    const u = clamp(e.st / flareTime());
    return { lean: -0.8 * u, flame: 1 + u * 1.2, heat: u, limp, sway: sway * 0.3 };
  }
  if (e.state === "dive") return { lean: 1.6, flame: 1.8, heat: 1, limp, sway: 0 };
  return { lean: 0, flame: 1, heat: 0, limp, sway };
}

function stub(s: SpriteCanvas, p: WickPose): void {
  const top = -5;
  s.begin();
  s.poly(
    [
      [-3.4 + p.lean * 0.4, top],
      [3.2 + p.lean * 0.4, top - 0.6],
      [3.6, 4.4],
      [2, 6.2],
      [-2.2, 6],
      [-3.8, 4.2],
    ],
    W[2],
  );
  s.dot(p.lean * 0.4, top, 3.3, W[2]);
  s.shadeEdges(W[2], W[3], W[1], 2);
  for (const [x, y, len] of DRIPS) {
    s.hairline(x + p.lean * 0.3, y, x + p.lean * 0.2, y + len, W[3]);
    s.set(x + p.lean * 0.2, y + len + 0.5, W[1]);
  }
  s.commit();
  s.begin();
  const eye = p.limp ? W[0] : p.heat > 0.5 ? F[3] : F[1];
  s.block(0.4, -1, GRAVE.hollow, 1.2, 1.4);
  s.block(2.4, -1.2, GRAVE.hollow, 1.2, 1.4);
  s.set(0.8, -0.6, eye);
  s.set(2.8, -0.8, eye);
  s.hairline(1, 1.6 + p.heat, 2.8, 1.4 + p.heat, GRAVE.hollow);
  s.commit(false);
}

function flame(s: SpriteCanvas, p: WickPose, time: number): void {
  const base = -7.4;
  const tall = 4 * p.flame;
  const lick = Math.sin(time * 19) * 0.6 + p.sway - p.lean * 0.8;
  s.begin();
  s.hairline(p.lean * 0.4, base + 1.4, p.lean * 0.4, base - 0.4, GRAVE.hollow);
  s.commit(false);
  s.begin();
  s.taper(p.lean * 0.4, base, p.lean * 0.4 + lick, base - tall, 1.6 + p.heat * 0.4, 0.3, F[1], lick * 0.4);
  s.taper(p.lean * 0.4, base, p.lean * 0.4 + lick * 0.6, base - tall * 0.6, 0.9, 0.2, F[2]);
  s.dot(p.lean * 0.4, base - 0.6, 0.7, F[3]);
  s.commit(false);
}

export function drawWickling(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  stub(s, p);
  moonlight(s);
  s.outline(GRAVE.outline);
  flame(s, p, time);
  return s;
}
