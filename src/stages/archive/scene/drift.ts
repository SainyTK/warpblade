import { GROUND, W } from "../../../constants/stage";
import { disc, fleck, glow, hairline, polygon, px } from "../../../engine/frame";
import { stageCameraX } from "../../../game/adventure";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { SCENE } from "./palette";
import { SHAFT_DIR, shaftLight, WINDOWS } from "./windows";

const SPAN = W + 40;
const PAGES = Array.from({ length: 7 }, (_, i) => ({
  x: grain(i, 1) * SPAN,
  y: 30 + grain(i, 2) * 100,
  speed: 4 + grain(i, 3) * 6,
  sink: 1.5 + grain(i, 4) * 2,
  spin: 0.8 + grain(i, 5) * 1.4,
  depth: 0.7 + grain(i, 6) * 0.5,
}));
const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: grain(i, 11) * SPAN,
  rise: 9 + grain(i, 12) * 10,
  phase: grain(i, 13) * 20,
  size: grain(i, 14) < 0.3 ? 1 : 0,
}));
const TENDRILS = Array.from({ length: 4 }, (_, i) => ({
  x: 40 + i * 82 + grain(i, 21) * 30,
  y: 20 + grain(i, 22) * 40,
  length: 34 + grain(i, 23) * 26,
  phase: grain(i, 24) * 6,
}));
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  window: i % WINDOWS.length,
  offset: (grain(i, 31) - 0.5) * 14,
  speed: 3 + grain(i, 32) * 4,
  phase: grain(i, 33) * 120,
}));

const wrap = (x: number, span: number): number => ((x % span) + span) % span;

function page(x: number, y: number, angle: number, depth: number): void {
  const w = 4 * depth;
  const h = 3 * depth;
  const turn = Math.cos(angle);
  const tilt = Math.sin(angle * 0.7) * 1.2;
  const half = (w / 2) * Math.max(0.25, Math.abs(turn));
  const front = turn > 0;
  const paper = front ? SCENE.page[3] : SCENE.page[2];
  polygon(
    [
      [x - half, y - h / 2 + tilt],
      [x + half, y - h / 2 - tilt],
      [x + half, y + h / 2 - tilt],
      [x - half, y + h / 2 + tilt],
    ],
    depth < 0.9 ? scale(paper, 0.8) : paper,
  );
  if (half > 1.2)
    for (let k = 0; k < 2; k++) {
      const ly = y - h / 4 + k * 1.1;
      hairline(x - half + 0.5, ly + tilt * 0.6, x + half - 0.5, ly - tilt * 0.6, SCENE.page[1], 0.8);
    }
  fleck(x + half - 0.5, y - h / 2 - tilt, SCENE.page[4]);
}

export function drawPages(t: number): void {
  const camera = stageCameraX();
  for (const p of PAGES) {
    const x = wrap(p.x - t * p.speed - camera * p.depth * 1.1, SPAN) - 20;
    const y = wrap(p.y + t * p.sink + Math.sin(t * 0.9 + p.x) * 6, GROUND - 20) + 10;
    page(x, y, t * p.spin + p.x, p.depth);
  }
}

export function drawBubbles(t: number): void {
  const camera = stageCameraX();
  for (const b of BUBBLES) {
    const climb = wrap(t * b.rise + b.phase * 7, 110);
    const x = wrap(b.x - camera * 0.9, SPAN) - 20 + Math.sin(t * 3 + b.phase) * 1.2;
    const y = GROUND - 4 - climb;
    const a = climb < 8 ? climb / 8 : 1 - climb / 110;
    if (b.size) {
      px(x, y, SCENE.bubble, a * 0.5);
      fleck(x - 0.5, y - 0.5, SCENE.letterHot, a);
    } else fleck(x, y, SCENE.bubble, a * 0.8);
  }
}

export function drawTendrils(t: number): void {
  const camera = stageCameraX();
  for (const d of TENDRILS) {
    const baseX = wrap(d.x - camera * 0.2 + t * 1.5, SPAN) - 20;
    for (let i = 0; i < 14; i++) {
      const u = i / 13;
      const sway = Math.sin(t * 0.6 + d.phase + u * 4) * (3 + u * 7);
      const x = baseX + sway + u * 10;
      const y = d.y + u * d.length;
      disc(x, y, 3.2 - u * 2.2, SCENE.ink[1], 0.32 * (1 - u * 0.7));
    }
  }
}

export function drawMotes(t: number): void {
  for (const m of MOTES) {
    const w = WINDOWS[m.window];
    const along = wrap(t * m.speed + m.phase, 140);
    const x = w.x + SHAFT_DIR.x * along + m.offset + Math.sin(t + m.phase) * 1.5;
    const y = w.bottom + SHAFT_DIR.y * along;
    const lit = shaftLight(x, y);
    if (lit < 0.04) continue;
    const twinkle = 0.6 + Math.sin(t * 4 + m.phase) * 0.4;
    fleck(x, y, SCENE.causticHot, Math.min(1, lit * 3) * twinkle);
    glow(x, y, 3, SCENE.shaftGlow, lit * 0.4 * twinkle);
  }
}
