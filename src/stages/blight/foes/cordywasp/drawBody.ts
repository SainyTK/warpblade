import type { SpriteCanvas } from "../../../../engine/sprite";
import { lerp } from "../../../../utils/math";
import { WASP } from "./colors";
import type { WaspPose } from "./pose";

const S = WASP.shell;
const SEGMENTS = 5;

type Pt = readonly [number, number];

const PIVOT: Pt = [-6.8, 1.4];
const LENGTH = 9;

function angleAt(u: number, curl: number): number {
  return lerp(2.65, 1.25, curl) - u * curl * 0.6;
}

function abdomenAt(u: number, curl: number): Pt {
  const a = angleAt(u, curl);
  return [PIVOT[0] + Math.cos(a) * u * LENGTH, PIVOT[1] + Math.sin(a) * u * LENGTH];
}

export function stingerTip(curl: number): Pt {
  const a = angleAt(1, curl);
  return [PIVOT[0] + Math.cos(a) * (LENGTH + 3), PIVOT[1] + Math.sin(a) * (LENGTH + 3)];
}

export function legs(s: SpriteCanvas, time: number): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const x = -1 + i * 2;
    const sway = Math.sin(time * 5 + i) * 0.6;
    s.hairline(x, 2.5, x - 1 + sway, 6, S[1]);
    s.hairline(x - 1 + sway, 6, x - 2 + sway, 8.5, S[2]);
  }
  s.commit(false);
}

export function abdomen(s: SpriteCanvas, p: WaspPose): void {
  s.begin();
  for (let i = 0; i < SEGMENTS; i++) {
    const u = i / (SEGMENTS - 1);
    const [x, y] = abdomenAt(u, p.curl);
    s.dot(x, y, lerp(3.4, 1.3, u * u), S[2]);
  }
  const tip = stingerTip(p.curl);
  const [ex, ey] = abdomenAt(1, p.curl);
  s.taper(ex, ey, tip[0], tip[1], 1, 0.2, S[3]);
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  s.begin();
  for (let i = 1; i < SEGMENTS; i++) {
    const u = (i - 0.5) / (SEGMENTS - 1);
    const [x, y] = abdomenAt(u, p.curl);
    const r = lerp(3.2, 1.6, u * u);
    s.stroke(x - 0.4, y - r + 0.6, x + 0.4, y + r - 0.6, 0.55, i % 2 ? WASP.band[3] : WASP.band[2]);
  }
  s.set(tip[0], tip[1], WASP.band[4]);
  s.commit(false);
  s.begin();
  for (let i = 1; i < 4; i++) {
    const [x, y] = abdomenAt(i / 4, p.curl);
    s.dot(x + 0.5, y - lerp(3.4, 2, i / 4), 0.9, WASP.stalk[2]);
    s.set(x + 0.2, y - lerp(3.4, 2, i / 4) - 0.6, WASP.stalk[3]);
  }
  s.commit();
}

export function thorax(s: SpriteCanvas, p: WaspPose, time: number): void {
  s.begin();
  s.dot(-3.4, 0.8, 1, S[1]);
  s.dot(0, -0.5, 3.4, S[1]);
  s.shadeEdges(S[1], S[3], S[0], 2);
  s.commit();
  s.begin();
  s.dot(5.4, -1, 2.7, S[2]);
  s.shadeEdges(S[2], S[4], S[1], 1);
  s.commit();
  s.begin();
  s.stroke(-1.8, -3, 1.6, -3.4, 0.45, WASP.band[3]);
  s.hairline(-2.2, -2.2, 0.6, -2.8, WASP.sheen);
  s.block(5.6, -2.8, S[0], 2.5, 2.5);
  s.block(6, -2.5, p.hot ? WASP.eyeHot : WASP.eye, 2, 2);
  s.set(6, -2.5, WASP.eyeHot);
  const chew = Math.abs(Math.sin(time * 10)) * 0.6;
  s.hairline(7.4, 0.2, 9, 1.2 + chew, WASP.stalk[1]);
  s.hairline(6.8, 0.8, 8, 2.4 + chew, WASP.stalk[1]);
  s.commit(false);
}
