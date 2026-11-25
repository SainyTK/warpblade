import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { clamp, TAU } from "../../../../utils/math";
import { FOE } from "../colors";
import { SHARDLING } from "./constants";

const canvas = detailCanvas(36, 36, 18, 18);
const C = FOE.crystal;

function satellite(s: SpriteCanvas, x: number, y: number, angle: number, size: number, hot: boolean): void {
  const dx = Math.cos(angle) * 2.6 * size;
  const dy = Math.sin(angle) * 2.6 * size;
  const nx = -Math.sin(angle) * size;
  const ny = Math.cos(angle) * size;
  s.begin();
  s.poly(
    [
      [x + dx, y + dy],
      [x + nx, y + ny],
      [x - dx * 0.6, y - dy * 0.6],
      [x - nx, y - ny],
    ],
    hot ? C[3] : C[2],
  );
  s.shadeEdges(hot ? C[3] : C[2], C[4], C[1]);
  s.set(x + dx, y + dy, C[4]);
  s.commit();
}

function body(s: SpriteCanvas, lit: number, core: number): void {
  const step = (i: number) => C[Math.min(C.length - 1, i + lit)];
  s.begin();
  s.poly(
    [
      [0, -10],
      [4.5, -3],
      [3.5, 3],
      [0, 10],
      [-3.5, 3],
      [-4.5, -3],
    ],
    step(1),
  );
  s.commit();
  s.begin();
  s.poly(
    [
      [0.5, -10],
      [4.5, -3],
      [3.5, 3],
      [0.5, 10],
      [1.2, -1],
    ],
    step(2),
  );
  s.commit();
  s.begin();
  s.hairline(0.6, -9, 1.2, -1, C[4]);
  s.hairline(1.2, -1, 0.6, 9, step(3));
  s.hairline(-4, -3, 4, -3, step(2));
  s.hairline(-3.3, -2.5, -0.5, -2.5, C[0]);
  s.hairline(-1.5, 4, -0.8, 7.5, C[0]);
  s.hairline(4.3, -3.4, 3.4, 2.6, C[4]);
  s.commit();
  s.begin();
  s.poly(
    [
      [0, -3.6],
      [1.8, -1],
      [0, 1.8],
      [-1.8, -1],
    ],
    core > 0.5 ? FOE.eyeHot : C[3],
  );
  s.set(0, -1, FOE.eyeHot);
  s.set(-0.5, -1.5, FOE.eyeHot);
  s.commit();
}

export function drawShardling(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const winding = e.state === "wind";
  const spent = e.state === "shoot" || e.state === "recover";
  const charge = winding ? clamp(e.st / SHARDLING.wind) : 0;
  const regrow = e.state === "recover" ? clamp(e.st / SHARDLING.recover) : spent ? 0 : 1;
  s.clear();
  const sats = [0, 1, 2].map((i) => {
    const orbit = time * 2.2 + (i * TAU) / 3;
    if (!winding)
      return { x: Math.cos(orbit) * 10, y: Math.sin(orbit) * 4 - 1, a: orbit + Math.PI / 2, back: Math.sin(orbit) < 0 };
    const aim = e.ax + (i - 1) * SHARDLING.spread;
    const r = 6 + charge * 5;
    const x = Math.cos(orbit) * 10 * (1 - charge) + Math.cos(aim) * r * charge;
    const y = (Math.sin(orbit) * 4 - 1) * (1 - charge) + Math.sin(aim) * r * charge;
    return { x, y, a: aim, back: false };
  });
  const size = 0.9 * regrow;
  if (size > 0.2) for (const p of sats) if (p.back) satellite(s, p.x, p.y, p.a, size * 0.85, false);
  body(s, winding ? Math.round(charge * 2) : 0, winding ? charge : e.state === "shoot" ? 1 : 0);
  s.outline(FOE.outline);
  if (size > 0.2) for (const p of sats) if (!p.back) satellite(s, p.x, p.y, p.a, size, winding && charge > 0.6);
  return s;
}
