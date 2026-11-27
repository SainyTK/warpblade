import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, hideOf, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { CITADEL_FOE, ECLIPSE } from "../colors";
import { MOTE } from "./constants";

const canvas = detailCanvas(30, 28, 15, 14);
const WING = CITADEL_FOE.wing;

function flapOf(e: Enemy, time: number): number {
  if (e.state === "wind") return -1 + Math.sin(time * 50) * 0.08;
  if (e.state === "dive") return 0.9;
  return Math.sin(time * 15);
}

function wing(s: SpriteCanvas, root: Pt, flap: number, span: number, base: number, edge: number): void {
  const lift = -flap * 6 * span;
  const tip: Pt = [root[0] - 5 * span, root[1] + lift - 2];
  const trail: Pt = [root[0] - 7 * span, root[1] + lift * 0.6 + 2];
  const notch: Pt = [root[0] - 4 * span, root[1] + lift * 0.4 + 2.5];
  const hind: Pt = [root[0] - 3.5 * span, root[1] + 4 + lift * 0.2];
  s.poly([root, tip, trail, notch, hind, [root[0] + 0.5, root[1] + 2]], base);
  s.shadeEdges(base, edge, WING[0]);
  s.hairline(root[0], root[1], tip[0], tip[1], edge);
  s.hairline(root[0], root[1] + 1, notch[0], notch[1], WING[0]);
}

function eclipseSpot(s: SpriteCanvas, x: number, y: number, hot: boolean): void {
  s.dot(x, y, 1.6, hot ? ECLIPSE[3] : ECLIPSE[2]);
  s.dot(x, y, 0.9, AC.bodyDeep);
  s.set(x - 1, y - 1.2, hot ? ECLIPSE[5] : ECLIPSE[4]);
}

export function drawRiftmote(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const flap = flapOf(e, time);
  const hot = e.state === "wind" || e.state === "dive";
  const charge = e.state === "wind" ? clamp(e.st / MOTE.wind) : hot ? 1 : 0;
  const H = hideOf(e.seed);
  const bob = e.state === "drift" ? Math.round(Math.sin(time * 3)) * 0.5 : 0;
  const tilt = e.state === "dive" ? 1.5 : 0;
  s.clear();
  s.begin();
  wing(s, [0, -1 + bob], flap * 0.8, 0.85, WING[1], WING[2]);
  s.commit();
  s.begin();
  s.dot(-1.5, 0.5 + bob + tilt * 0.3, 2.3, H.body);
  s.dot(-4, 1.2 + bob + tilt * 0.6, 1.5, H.body);
  s.dot(1.6, -0.6 + bob - tilt * 0.2, 1.8, H.body);
  s.shadeEdges(H.body, H.sheen, H.dark, 2);
  s.hairline(-3, 0 + bob, -3, 2 + bob, H.deep);
  s.hairline(-1, -0.6 + bob, -1, 2.2 + bob, H.deep);
  s.set(-5.2, 1.8 + bob, charge > 0.5 ? VOID[4] : VOID[2]);
  s.commit();
  s.begin();
  s.taper(2.4, -1.8 + bob, 4.5, -5 + bob, 0.4, 0.3, H.sheen);
  s.taper(1.6, -2 + bob, 2.4, -5.4 + bob, 0.4, 0.3, H.sheen);
  s.set(4.5, -5.2 + bob, AC.rim);
  s.set(2.4, -5.6 + bob, AC.rim);
  fang(s, [2.6, 0.6 + bob], [3.8, 2 + bob], 0.7, AC.claw);
  s.commit();
  s.begin();
  wing(s, [-0.5, -1.5 + bob], flap, 1, WING[2], WING[3]);
  s.commit();
  s.begin();
  const lift = -flap * 6;
  eclipseSpot(s, -4, -0.6 + bob + lift * 0.45, hot);
  s.commit(false);
  sunRim(s, AC.rim, AC.rimSoft);
  glowEye(s, 2.4, -0.9 + bob, hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  s.outline(AC.outline);
  return s;
}
