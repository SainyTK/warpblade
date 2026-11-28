import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as C } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { type BoglingPose, boglingPose } from "./pose";

const canvas = detailCanvas(32, 30, 16, 24);
const BODY = { r: 5, y: -5 } as const;
const PEBBLES = [
  [-2.6, -3.2],
  [2.4, -2.2],
  [-0.6, -1.6],
] as const;

function feet(s: SpriteCanvas, p: BoglingPose): void {
  s.begin();
  const lift = Math.max(0, p.step) * 1.2;
  const fall = Math.max(0, -p.step) * 1.2;
  s.dot(-2.6 * p.wide, -0.9 - lift, 1.4, C.mudDark);
  s.dot(2.8 * p.wide, -0.9 - fall, 1.4, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark);
  s.shadeEdges(C.mudDark, C.mud, C.mudDeep);
  s.commit();
}

function body(s: SpriteCanvas, p: BoglingPose, cy: number): void {
  const rx = BODY.r * p.wide;
  const ry = BODY.r * p.tall;
  s.begin();
  for (let y = -ry; y <= ry; y += 0.5) {
    const half = rx * Math.sqrt(Math.max(0, 1 - (y / ry) ** 2));
    const sag = y > ry * 0.4 ? 0.6 : 0;
    s.stroke(-half - sag + p.lean * (y / ry) * -0.6, cy + y, half + sag + p.lean * (y / ry) * -0.6, cy + y, 0.3, C.mud);
  }
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.dot(-rx * 0.35, cy - ry * 0.45, rx * 0.45, C.mudLight);
  s.dot(rx * 0.25, cy + ry * 0.55, rx * 0.45, C.globDeep);
  for (const [x, y] of PEBBLES) {
    s.block(x * p.wide, cy + y * p.tall + 3, C.pebbleDark);
    s.set(x * p.wide, cy + y * p.tall + 3, C.pebble);
  }
  for (let a = -2.6; a < -1.1; a += 0.08) s.set(Math.cos(a) * (rx - 0.4), cy + Math.sin(a) * (ry - 0.4), C.mudRim);
  for (let a = -2.4; a < -1.8; a += 0.08) s.set(Math.cos(a) * (rx - 0.4), cy + Math.sin(a) * (ry - 0.4), C.wetSky);
  glint(s, -rx * 0.5, cy - ry * 0.7, C.mudGlint);
  s.commit();
}

function sprout(s: SpriteCanvas, p: BoglingPose, top: number, time: number): void {
  const sway = Math.sin(time * 3) * 0.8 - p.lean * 0.8;
  s.begin();
  s.taper(0.4, top + 0.6, 1 + sway, top - 4.2, 0.55, 0.25, C.reed, 0.4);
  s.taper(-0.6, top + 0.6, -2.4 + sway * 0.6, top - 2.6, 0.45, 0.2, C.reedDark, -0.6);
  s.shadeEdges(C.reed, C.reedLight, C.reedDark);
  s.commit();
  s.begin();
  s.dot(1 + sway, top - 4.6, 0.75, C.cattail);
  s.shadeEdges(C.cattail, C.cattailLight, C.mudDeep);
  s.commit();
}

function face(s: SpriteCanvas, p: BoglingPose, cy: number, time: number): void {
  const ex = 1.6 * p.wide + p.lean * 0.6;
  const ey = cy - 0.8 * p.tall;
  const hot = mix(C.wart, WHITE, p.glow * 0.7);
  s.begin();
  if (p.dazed) {
    s.hairline(ex - 0.7, ey - 0.6, ex + 0.7, ey + 0.6, C.outline);
    s.hairline(ex - 0.7, ey + 0.6, ex + 0.7, ey - 0.6, C.outline);
    s.hairline(ex + 2.3, ey - 0.6, ex + 3.4, ey + 0.6, C.outline);
    s.hairline(ex + 2.3, ey + 0.6, ex + 3.4, ey - 0.6, C.outline);
  } else {
    const blink = Math.sin(time * 1.3) > 0.97;
    s.dot(ex, ey, 0.9, C.mudDeep);
    s.dot(ex + 2.6, ey + 0.2, 0.8, C.mudDeep);
    if (!blink) {
      s.block(ex - 0.25, ey - 0.25, hot, 0.5, 0.5);
      s.block(ex + 2.35, ey - 0.05, hot, 0.5, 0.5);
      s.set(ex - 0.5, ey - 0.5, WHITE);
    }
  }
  const mw = 1.2 + p.mouth * 1.2;
  const my = ey + 2;
  if (p.mouth > 0.2) {
    s.dot(ex + 1.4, my, mw * 0.6, C.maw);
    s.set(ex + 0.8, my - 0.4, C.mudGlint);
    s.set(ex + 2, my - 0.4, C.mudGlint);
  } else s.hairline(ex + 0.4, my, ex + 2.4, my - 0.2, C.mudDeep);
  s.commit(false);
}

function drips(s: SpriteCanvas, p: BoglingPose, cy: number, time: number): void {
  s.begin();
  for (let i = 0; i < 2; i++) {
    const k = (time * 0.9 + i * 0.5) % 1;
    const x = (i ? 3.2 : -3.6) * p.wide;
    s.dot(x, cy + 2 + k * 3, 0.45, C.mudLight);
  }
  s.commit(false);
}

export function drawBogling(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = boglingPose(e, t);
  const cy = BODY.y * p.tall - p.lift - 0.4;
  s.clear();
  feet(s, p);
  body(s, p, cy);
  sprout(s, p, cy - BODY.r * p.tall, time);
  face(s, p, cy, time);
  drips(s, p, cy, time);
  s.outline(C.outline);
  if (p.glow > 0) {
    s.begin();
    s.block(-0.5, cy + 1, p.glow > 0.6 ? C.wartHot : C.wart, 1, 1);
    s.commit(false);
  }
  return s;
}
