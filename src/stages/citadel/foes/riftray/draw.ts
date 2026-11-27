import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, hideOf, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { CITADEL_FOE } from "../colors";
import { RAY, RAY_MOVE } from "./constants";

const canvas = detailCanvas(64, 44, 32, 22);
const WING = CITADEL_FOE.wing;

interface RayPose {
  flap: number;
  pitch: number;
  rift: number;
  hot: boolean;
}

function poseOf(e: Enemy, time: number): RayPose {
  if (e.state === "wind") {
    const u = clamp(e.st / (e.ay === RAY_MOVE.drop ? RAY.dropWind : RAY.swoopWind));
    return e.ay === RAY_MOVE.drop
      ? { flap: -0.6 - u * 0.3, pitch: 0, rift: u, hot: u > 0.5 }
      : { flap: -1, pitch: -2 * u, rift: 0.2, hot: u > 0.5 };
  }
  if (e.state === "dive") return { flap: 0.8, pitch: 2, rift: 0.3, hot: true };
  if (e.state === "beam") return { flap: -0.9, pitch: 0, rift: 1, hot: true };
  if (e.state === "recover") return { flap: Math.sin(time * 8) * 0.6, pitch: 0, rift: 0, hot: false };
  return { flap: Math.sin(time * 4.2), pitch: 0, rift: 0, hot: false };
}

function wing(s: SpriteCanvas, flap: number, far: boolean, base: number, light: number): void {
  const k = far ? 0.8 : 1;
  const lift = -flap * 9 * k;
  const root: Pt = [far ? 1 : -1, far ? -2 : -1];
  const tip: Pt = [root[0] - 2 * k, root[1] + lift - 1];
  const lead: Pt = [root[0] + 6 * k, root[1] + lift * 0.45 - 1.5];
  const trail: Pt = [root[0] - 13 * k, root[1] + lift * 0.55 + 2];
  const back: Pt = [root[0] - 8, root[1] + 3];
  s.poly([root, lead, tip, trail, back], base);
  s.shadeEdges(base, light, WING[0], 2);
  s.hairline(root[0] + 2, root[1], tip[0], tip[1], light);
  s.hairline(root[0] - 3, root[1] + 1.5, trail[0] + 2, trail[1] - 0.5, WING[0]);
}

function tail(s: SpriteCanvas, time: number, hot: boolean, H: ReturnType<typeof hideOf>): void {
  const w = Math.sin(time * 3) * 2;
  const mid: Pt = [-17, 2 + w * 0.4];
  const end: Pt = [-27, 0 + w];
  s.taper(-9, 1, mid[0], mid[1], 1.6, 0.9, H.body, 0.4);
  s.taper(mid[0], mid[1], end[0], end[1], 0.9, 0.45, H.body, -0.6);
  s.shadeEdges(H.body, H.sheen, H.dark);
  fang(s, end, [end[0] - 3.5, end[1] - 1.5 + w * 0.2], 1.8, hot ? VOID[4] : AC.rimSoft);
  fang(s, [end[0] + 1, end[1]], [end[0] - 1.5, end[1] + 2.5], 1.2, AC.rimSoft);
}

function body(s: SpriteCanvas, p: RayPose, H: ReturnType<typeof hideOf>): void {
  const y = p.pitch;
  s.poly(
    [
      [-10, -1],
      [-4, -4 + y * 0.3],
      [5, -4.5 + y * 0.6],
      [11, -2 + y],
      [12.5, 0.5 + y],
      [9, 2.5 + y * 0.8],
      [0, 3.5 + y * 0.4],
      [-8, 2.5],
    ],
    H.body,
  );
  s.shadeEdges(H.body, H.sheen, H.dark, 2);
  s.hairline(-6, -2.2, 8, -3 + y * 0.6, AC.plate);
  s.hairline(-3, -3, 5, -3.6 + y * 0.5, AC.plateLight);
  fang(s, [11, -0.5 + y], [15, -2 + y], 1.4, H.dark);
  fang(s, [11, 1.5 + y], [15, 2.5 + y], 1.4, H.dark);
}

function riftSlit(s: SpriteCanvas, p: RayPose, time: number): void {
  const open = 0.6 + p.rift * 1.8;
  const flick = Math.sin(time * 18) * 0.2;
  s.poly(
    [
      [-6, 2.4],
      [1, 2.4 + open + flick],
      [8, 2],
      [1, 2.6],
    ],
    p.rift > 0.6 ? VOID[4] : VOID[3],
  );
  s.hairline(-4, 2.6, 6, 2.4, p.rift > 0.3 ? VOID[5] : VOID[4]);
}

export function drawRiftray(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const H = hideOf(e.seed);
  const bob = e.state === "drift" ? Math.round(Math.sin(time * 2) * 0.8) : 0;
  s.clear();
  s.shift(0, bob);
  s.begin();
  wing(s, p.flap, true, WING[1], WING[2]);
  s.commit();
  s.begin();
  tail(s, time, p.hot, H);
  s.commit();
  s.begin();
  body(s, p, H);
  s.commit();
  s.begin();
  riftSlit(s, p, time);
  s.commit(false);
  s.begin();
  wing(s, p.flap, false, WING[2], WING[3]);
  s.commit();
  s.shift(0, 0);
  sunRim(s, AC.rim, AC.rimSoft);
  glowEye(s, 9, -1.4 + p.pitch + bob, p.hot ? AC.eyeHot : AC.eye, p.hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  glowEye(s, 6.5, -2 + p.pitch * 0.7 + bob, p.hot ? AC.eye : AC.eyeDim, AC.eyeDim, AC.eye);
  s.outline(AC.outline);
  return s;
}
