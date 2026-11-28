import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { clamp, TAU } from "../../../../utils/math";
import { VEIL } from "../colors";
import { SEER } from "./constants";

const canvas = detailCanvas(48, 48, 24, 24);
const K = VEIL.crystal;
const P = VEIL.prism;

interface SeerPose {
  heat: number;
  open: number;
  spin: number;
  spread: number;
  droop: number;
  aim: number;
}

function poseOf(e: Enemy, time: number): SeerPose {
  const local = e.face > 0 ? e.ax : Math.PI - e.ax;
  if (e.stun > 0 || e.air || e.stagger > 0) return { heat: 0, open: 0, spin: time, spread: 0.7, droop: 1, aim: 0 };
  if (e.state === "wind") {
    const k = clamp(e.st / SEER.aim);
    return { heat: k, open: 0.5 + k * 0.5, spin: time * (1 + k * 4), spread: 1 - k * 0.35, droop: 0, aim: local };
  }
  if (e.state === "shoot") return { heat: 1, open: 1, spin: time * 6, spread: 0.6, droop: 0, aim: local };
  if (e.state === "recover") {
    const k = clamp(e.st / SEER.recover);
    return { heat: 0, open: 0.2 + k * 0.3, spin: time * 0.4, spread: 1.25 - k * 0.25, droop: 1 - k, aim: 0 };
  }
  return { heat: 0, open: 0.5, spin: time * 1.2, spread: 1, droop: 0, aim: 0 };
}

function petal(s: SpriteCanvas, a: number, r: number, p: SeerPose, hue: Color): void {
  const x = Math.cos(a) * r;
  const y = Math.sin(a) * r * 0.45 + p.droop * 4;
  const out = p.aim !== 0 ? p.aim : a;
  const dx = Math.cos(out) * 5.5;
  const dy = Math.sin(out) * 5.5;
  const tone = p.heat > 0.6 ? mix(hue, WHITE, 0.4) : hue;
  s.begin();
  s.poly(
    [
      [x + dx, y + dy],
      [x - dy * 0.35, y + dx * 0.35],
      [x - dx * 0.7, y - dy * 0.7],
      [x + dy * 0.35, y - dx * 0.35],
    ],
    tone,
  );
  s.shadeEdges(tone, mix(tone, WHITE, 0.5), mix(tone, K[0], 0.5));
  s.set(x + dx, y + dy, WHITE);
  s.commit();
}

function gem(s: SpriteCanvas, p: SeerPose): void {
  const lit = p.heat > 0.5 ? 1 : 0;
  s.begin();
  s.poly(
    [
      [0, -13],
      [7, -2],
      [0, 0],
      [-7, -2],
    ],
    K[2 + lit],
  );
  s.poly(
    [
      [-7, -2],
      [0, 0],
      [0, 12],
    ],
    K[1 + lit],
  );
  s.poly(
    [
      [7, -2],
      [0, 0],
      [0, 12],
    ],
    K[0 + lit],
  );
  s.hairline(0, -13, -7, -2, K[4]);
  s.hairline(0, -13, 0, 0, K[3]);
  s.hairline(-7, -2, 7, -2, K[3]);
  s.hairline(0, 0, 0, 12, K[1]);
  s.set(-2, -9, WHITE);
  s.commit();
  s.begin();
  s.poly(
    [
      [-1.5, 12],
      [1.5, 12],
      [0, 17 - p.droop * 2],
    ],
    K[1],
  );
  s.commit();
}

function eye(s: SpriteCanvas, p: SeerPose): void {
  const h = 0.4 + p.open * 2.2;
  s.begin();
  s.poly(
    [
      [-4, -3],
      [0, -3 - h],
      [4, -3],
      [0, -3 + h],
    ],
    VEIL.robe[0],
  );
  s.dot(Math.cos(p.aim) * 1.2, -3 + Math.sin(p.aim) * 0.6, Math.min(h, 1.5), p.heat > 0.3 ? WHITE : VEIL.eye);
  s.commit();
}

export function drawFacetseer(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  const petals = [0, 1, 2, 3].map((i) => ({ a: p.spin + (i * TAU) / 4, hue: P[i] }));
  for (const { a, hue } of petals) if (Math.sin(a) < 0) petal(s, a, 14 * p.spread, p, mix(hue, K[1], 0.4));
  gem(s, p);
  eye(s, p);
  s.outline(VEIL.outline);
  for (const { a, hue } of petals) if (Math.sin(a) >= 0) petal(s, a, 14 * p.spread, p, hue);
  return s;
}
