import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { LEECH_COLORS as C } from "./leechColors";
import { buried, erupting, tellTime } from "./leechMoves";
import { type LeechPose, leechPose } from "./leechPose";

const canvas = detailCanvas(64, 46, 32, 40);
const TEETH = 9;
const BACK_SPOTS = [5, 7, 9] as const;

function mudMound(s: SpriteCanvas, height: number, width: number): void {
  s.begin();
  s.dot(0, 1.2 - height, width * 0.5, C.mud);
  s.dot(-width * 0.45, 0.6, width * 0.3, C.mud);
  s.dot(width * 0.45, 0.6, width * 0.3, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  s.set(-width * 0.2, 1.2 - height - width * 0.4, C.mudRim);
  s.set(-width * 0.2 + 0.5, 1.2 - height - width * 0.4, C.wetSky);
  s.commit();
}

function ripples(s: SpriteCanvas, time: number, spread: number, strength: number): void {
  for (let j = 0; j < 3; j++) {
    const k = (time * 1.4 + j / 3) % 1;
    const radius = 3 + k * spread;
    const color = k < 0.35 ? C.riftHot : k < 0.7 ? C.rift : C.mudDark;
    if (k > strength) continue;
    for (let a = 0; a < Math.PI * 2; a += 0.6 / radius) {
      const y = -0.2 + Math.sin(a) * radius * 0.16;
      if (y > 0.4) continue;
      s.set(Math.cos(a) * radius, y, color);
    }
  }
}

function bubbles(s: SpriteCanvas, time: number, count: number, spread: number): void {
  for (let i = 0; i < count; i++) {
    const life = (time * 1.7 + i * 0.37) % 1;
    const x = Math.sin(i * 2.3 + Math.floor(time * 1.7 + i * 0.37) * 1.9) * spread;
    const r = 0.4 + life * 0.9;
    s.begin();
    s.dot(x, -0.3 - r, r, C.mudLight);
    s.set(x - r * 0.4, -0.3 - r * 1.5, C.wetSky);
    s.commit(false);
  }
}

function body(s: SpriteCanvas, p: LeechPose, time: number, hot: boolean): void {
  const { spine } = p;
  s.begin();
  for (const q of spine) s.dot(q.x, q.y, q.r, C.body);
  s.shadeEdges(C.body, C.light, C.dark, 2);
  for (let i = 1; i < spine.length - 1; i++) {
    const q = spine[i];
    s.dot(q.x, q.y + q.r * 0.55, q.r * 0.42, C.belly);
  }
  s.shadeEdges(C.belly, C.bellyLight, C.bellyDark);
  for (let i = 1; i < spine.length - 1; i++) {
    const q = spine[i];
    s.dot(q.x, q.y - q.r * 0.5, Math.max(0.5, q.r * 0.26), C.stripe);
  }
  s.shadeEdges(C.stripe, C.stripeLight, C.stripeDark);
  for (let i = 1; i < spine.length - 1; i++) {
    const a = spine[i - 1];
    const b = spine[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const q = spine[i];
    const r = q.r * 0.85;
    s.hairline(q.x + nx * r, q.y + ny * r, q.x - nx * r * 0.4, q.y - ny * r * 0.4, C.ring);
  }
  for (const i of [3, 6, 8]) {
    const q = spine[i];
    s.set(q.x - 0.5, q.y - q.r * 0.85, C.rim);
    s.set(q.x, q.y - q.r * 0.85, C.glint);
  }
  BACK_SPOTS.forEach((i, k) => {
    const q = spine[i];
    const lit = hot || Math.sin(time * 4 + k * 1.7) > 0.2;
    s.block(q.x - 0.5, q.y - q.r * 0.3, lit ? C.rift : mix(C.rift, C.body, 0.55), 1, 1);
    if (lit) s.set(q.x, q.y - q.r * 0.3, C.riftHot);
  });
  s.commit();
}

function mouth(s: SpriteCanvas, p: LeechPose): void {
  const head = p.spine[p.spine.length - 1];
  const neck = p.spine[p.spine.length - 2];
  const len = Math.hypot(head.x - neck.x, head.y - neck.y) || 1;
  const dx = (head.x - neck.x) / len;
  const dy = (head.y - neck.y) / len;
  const mx = head.x + dx * head.r * 0.55;
  const my = head.y + dy * head.r * 0.55;
  s.begin();
  if (p.mouth < 0.12) {
    s.hairline(mx - dy * 1.4, my + dx * 1.4, mx + dy * 1.4, my - dx * 1.4, C.maw);
    s.commit(false);
    return;
  }
  const open = 1 + p.mouth * 1.8;
  s.dot(mx, my, open + 0.7, C.gum);
  s.dot(mx + dx * 0.4, my + dy * 0.4, open, C.maw);
  for (let i = 0; i < TEETH; i++) {
    const a = (i / TEETH) * Math.PI * 2;
    const tx = mx + dx * 0.4 + Math.cos(a) * open * 0.85;
    const ty = my + dy * 0.4 + Math.sin(a) * open * 0.85;
    s.set(tx, ty, i % 2 ? C.tooth : C.toothDark);
  }
  s.set(mx - dx * 0.2 - 0.5, my - open * 0.8, C.glint);
  s.commit();
}

function collar(s: SpriteCanvas, time: number): void {
  s.begin();
  s.dot(-5, -0.6, 2.6, C.mud);
  s.dot(5, -0.6, 2.6, C.mud);
  s.dot(0, 0.2, 3.4, C.mud);
  s.shadeEdges(C.mud, C.mudLight, C.mudDark, 2);
  for (let i = 0; i < 4; i++) {
    const k = (time * 2.2 + i * 0.25) % 1;
    const side = i % 2 ? 1 : -1;
    s.dot(side * (5 + k * 9), -4 - k * 10 + k * k * 12, 0.8, C.mudLight);
  }
  s.commit();
}

export function drawBogleech(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = leechPose(e, t);
  s.clear();
  if (buried(e) && e.state === "wind") {
    const k = clamp(e.st / tellTime());
    ripples(s, time * (1 + k * 2), 10 + k * 12, 1);
    mudMound(s, 0.5 + k * 3.2, 7 + k * 5);
    bubbles(s, time * (1 + k), 2 + Math.round(k * 3), 4 + k * 3);
    s.begin();
    s.block(-0.5, 0.6 - (0.5 + k * 3.2) - 2.5, k > 0.5 ? C.riftHot : C.rift, 1, 1);
    s.commit(false);
    s.clipBelow(0.5);
    s.outline(C.outline);
    return s;
  }
  if (buried(e)) {
    ripples(s, time * 2, 7, 0.8);
    mudMound(s, 0.8, 6);
    bubbles(s, time, 1, 3);
    s.clipBelow(0.5);
    s.outline(C.outline);
    return s;
  }
  body(s, p, time, e.state === "wind" || erupting(e));
  mouth(s, p);
  if (p.sink > 0 || erupting(e)) {
    s.clipBelow(0.5);
    collar(s, time);
  }
  s.outline(C.outline);
  return s;
}
