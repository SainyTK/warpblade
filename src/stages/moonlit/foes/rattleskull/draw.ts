import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { hurting } from "../strike";
import { chatterTime } from "./moves";

const canvas = detailCanvas(30, 26, 15, 22);
const B = GRAVE.bone;
const LEGS = [-3.4, -1.2, 1.2, 3.4] as const;

interface SkullPose {
  tilt: number;
  jaw: number;
  lift: number;
  stride: number;
  heat: number;
  limp: boolean;
}

function poseOf(e: Enemy, time: number): SkullPose {
  const limp = hurting(e);
  if (limp) return { tilt: -1.2, jaw: 1, lift: 0, stride: 0, heat: 0, limp };
  if (e.state === "wind") {
    const u = clamp(e.st / chatterTime());
    return { tilt: -0.6 * u, jaw: Math.sin(time * 40) > 0 ? 1.6 : 0.4, lift: 0, stride: 0, heat: u, limp };
  }
  if (e.state === "lunge") return { tilt: 0.8, jaw: 2.2, lift: 0, stride: 1.2, heat: 1, limp };
  if (e.state === "recover") return { tilt: 0.3, jaw: 0.6, lift: 0, stride: 0, heat: 0, limp };
  const hop = Math.abs(Math.sin(time * 9));
  return { tilt: 0, jaw: 0, lift: hop * 1.5, stride: Math.sin(time * 18), heat: 0, limp };
}

function legs(s: SpriteCanvas, p: SkullPose, far: boolean): void {
  s.begin();
  LEGS.forEach((x, i) => {
    if ((i % 2 === 0) !== far) return;
    const swing = (i % 2 === 0 ? 1 : -1) * p.stride * 1.4;
    const knee = x + Math.sign(x || 1) * 1.6 + swing * 0.5;
    const tone = far ? B[1] : B[2];
    s.taper(x * 0.7, -3.2 - p.lift, knee, -2.8 - p.lift * 0.4, 0.6, 0.45, tone);
    s.taper(knee, -2.8 - p.lift * 0.4, x + swing, 0, 0.45, 0.3, tone);
    s.set(x + swing + 0.4, -0.2, B[3]);
  });
  s.commit();
}

function cranium(s: SpriteCanvas, p: SkullPose): void {
  const y = -6.5 - p.lift + p.tilt * 0.3;
  s.begin();
  s.dot(-0.4, y, 4.4, B[2]);
  s.dot(2.2, y + 1.6, 2.8, B[2]);
  s.shadeEdges(B[2], B[3], B[1], 2);
  s.dot(-1.6, y - 1.8, 1.4, B[3]);
  s.set(-2.2, y - 2.8, B[4]);
  s.set(-1.6, y - 3.2, B[4]);
  s.hairline(-2.8, y - 3, -1.2, y - 0.8, B[1]);
  s.hairline(-1.2, y - 0.8, -1.8, y + 0.6, B[1]);
  s.commit();
  s.begin();
  s.dot(2.2, y + 0.4, 1.3, GRAVE.hollow);
  s.dot(-0.6, y + 0.6, 1.1, GRAVE.hollow);
  s.set(3.4, y + 2.4, GRAVE.hollow);
  s.set(3.4, y + 2.9, GRAVE.hollow);
  const eye = p.limp ? GRAVE.ghost[0] : p.heat > 0.5 ? GRAVE.ghost[3] : GRAVE.ghost[1];
  s.set(2.4, y + 0.4, eye);
  s.set(-0.4, y + 0.6, p.limp ? GRAVE.ghost[0] : GRAVE.ghost[1]);
  if (p.heat > 0.5) s.set(2.8, y + 0.4, GRAVE.ghost[2]);
  s.commit(false);
}

function jaw(s: SpriteCanvas, p: SkullPose): void {
  const y = -3.6 - p.lift + p.jaw;
  s.begin();
  s.poly(
    [
      [-1.8, y - 0.6],
      [4.6, y - 0.4 + p.jaw * 0.2],
      [4.2, y + 1.4],
      [-1.2, y + 1.2],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[1]);
  for (let x = 0.2; x < 4.4; x += 1) s.set(x, y - 0.6, B[4]);
  s.commit();
}

export function drawRattleskull(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = poseOf(e, t + e.seed);
  s.clear();
  legs(s, p, true);
  jaw(s, p);
  cranium(s, p);
  legs(s, p, false);
  moonlight(s);
  s.outline(GRAVE.outline);
  return s;
}
