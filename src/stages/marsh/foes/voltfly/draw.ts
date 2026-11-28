import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { VOLTFLY_COLORS as C } from "./colors";
import { wing } from "./drawWings";
import { type VoltflyPose, voltflyPose } from "./pose";

const canvas = detailCanvas(68, 50, 38, 25);
const SEGMENTS = 9;
const K = 1.3;

type Turn = (x: number, y: number) => [number, number];

const turner =
  (tilt: number): Turn =>
  (x, y) => {
    const c = Math.cos(tilt);
    const sn = Math.sin(tilt);
    return [(x * c - y * sn) * K, (x * sn + y * c) * K];
  };

function abdomen(s: SpriteCanvas, turn: Turn, p: VoltflyPose, time: number): void {
  const points: [number, number, number][] = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const u = i / (SEGMENTS - 1);
    const x = 0.5 - u * 20 * p.stretch;
    const y = 0.2 + u * u * p.curl * 3 + Math.sin(time * 3 - u * 4) * 0.3;
    points.push([x, y, 1.9 - u * 1.05]);
  }
  s.begin();
  for (const [x, y, r] of points) s.dot(...turn(x, y), r * K, C.shell);
  s.shadeEdges(C.shell, C.shellLight, C.shellDark, 2);
  for (let i = 1; i < SEGMENTS; i++) {
    const [x, y, r] = points[i];
    s.hairline(...turn(x + 1, y - r), ...turn(x + 1, y + r), C.ring);
  }
  const spark = Math.floor(time * 9) % SEGMENTS;
  for (let i = 0; i < SEGMENTS - 1; i++) {
    const [x0, y0, r0] = points[i];
    const [x1, y1] = points[i + 1];
    const lit = p.charge > 0.3 || i === spark || i === (spark + 4) % SEGMENTS;
    const color = p.charge > 0.75 ? C.veinHot : lit ? C.vein : C.veinDeep;
    s.hairline(...turn(x0, y0 - r0 * 0.45), ...turn(x1, y1 - r0 * 0.45), color);
  }
  for (const i of [1, 3, 5]) {
    const [x, y, r] = points[i];
    s.set(...turn(x - 0.5, y - r * 0.9), C.shellRim);
  }
  const [tx, ty] = points[SEGMENTS - 1];
  s.hairline(...turn(tx, ty), ...turn(tx - 2, ty - 1.2), C.shellDark);
  s.hairline(...turn(tx, ty), ...turn(tx - 2, ty + 1), C.shellDark);
  s.commit();
}

function legs(s: SpriteCanvas, turn: Turn, p: VoltflyPose): void {
  const tuck = p.sweep > 0.5 ? 1 : 0;
  s.begin();
  for (const [x, lean] of [
    [5.5, 1.2],
    [4, 0.2],
    [2.5, -0.9],
  ] as const) {
    const kx = x + lean - tuck * 1.5;
    s.hairline(...turn(x, 2), ...turn(kx, 3.6 - tuck), C.leg);
    s.hairline(...turn(kx, 3.6 - tuck), ...turn(kx + 0.8 - tuck * 1.6, 5 - tuck * 1.4), C.leg);
  }
  s.commit(false);
}

function thorax(s: SpriteCanvas, turn: Turn, p: VoltflyPose): void {
  s.begin();
  s.dot(...turn(3.6, -0.3), 3 * K, C.shell);
  s.dot(...turn(1.4, 0.2), 2.2 * K, C.shell);
  s.shadeEdges(C.shell, C.shellLight, C.shellDark, 2);
  s.dot(...turn(3, -1.4), 1.5 * K, C.shellLight);
  s.hairline(...turn(1.5, -2), ...turn(5, -3), C.shellRim);
  s.set(...turn(2.6, -2.5), C.wetSky);
  s.hairline(...turn(2.2, 0.6), ...turn(5.4, -0.6), p.charge > 0.5 ? C.veinHot : C.vein);
  s.commit();
}

function head(s: SpriteCanvas, turn: Turn, p: VoltflyPose, time: number): void {
  const hot = p.charge;
  const eyeBase = hot > 0.6 ? C.eyeLight : C.eye;
  s.begin();
  s.dot(...turn(7.4, 0.3), 1.8 * K, C.shellDark);
  s.shadeEdges(C.shellDark, C.shell, C.shellDeep);
  s.hairline(...turn(8.6, 1.2), ...turn(9.6, 1.8), C.shellDeep);
  s.commit();
  s.begin();
  s.dot(...turn(8, -1.6), 2.5 * K, eyeBase);
  s.shadeEdges(eyeBase, C.eyeLight, C.eyeDark, 2);
  for (let y = -3.5; y <= 0.4; y += 1) {
    for (let x = 6.2; x <= 9.8; x += 1) {
      const dx = x - 8;
      const dy = y + 1.6;
      if (dx * dx + dy * dy > 4.4) continue;
      const odd = (Math.round(x) + Math.round(y)) % 2 === 0;
      if (odd) s.set(...turn(x, y), mix(eyeBase, C.eyeDark, 0.45));
    }
  }
  s.set(...turn(7, -3.2), C.eyeGlint);
  s.set(...turn(7.5, -3.4), WHITE);
  if (hot > 0.3 && Math.sin(time * 40) > 0) s.set(...turn(9, -1.2), WHITE);
  s.commit();
}

export function drawVoltfly(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = voltflyPose(e, t);
  const turn = turner(p.tilt);
  const lift = p.beat * 0.9;
  const fore = -1.95 + p.sweep * 0.9 + lift;
  const hind = -2.35 + p.sweep * 0.85 + lift * 0.8;
  s.clear();
  wing(s, turn, [3.5, -2.2], fore - 0.35, 13 - p.sweep * 3, 2.1, true);
  wing(s, turn, [1.5, -2], hind - 0.3, 12 - p.sweep * 3, 2.4, true);
  abdomen(s, turn, p, time);
  legs(s, turn, p);
  thorax(s, turn, p);
  head(s, turn, p, time);
  wing(s, turn, [1.8, -2.4], hind, 13 - p.sweep * 3, 2.5, false);
  wing(s, turn, [4, -2.6], fore, 14 - p.sweep * 3, 2.2, false);
  s.outline(C.outline);
  return s;
}
