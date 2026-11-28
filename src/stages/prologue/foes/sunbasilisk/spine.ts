import { lerp } from "../../../../utils/math";
import type { BasiliskPose } from "./pose";

export interface SpinePoint {
  x: number;
  y: number;
  r: number;
}

export const SEGMENTS = 20;
export const TAIL = 0.4;

const spine: SpinePoint[] = Array.from({ length: SEGMENTS }, () => ({ x: 0, y: 0, r: 0 }));

function girth(u: number, breath: number): number {
  if (u < TAIL) return lerp(0.7, 5.5, (u / TAIL) ** 1.2);
  return 5.5 + 3.5 * Math.sin((Math.PI * (u - TAIL)) / 0.7) + breath * 0.35;
}

export function basiliskSpine(p: BasiliskPose, time: number): SpinePoint[] {
  for (let i = 0; i < SEGMENTS; i++) {
    const u = i / (SEGMENTS - 1);
    const q = spine[i];
    q.r = girth(u, p.breath);
    q.x = lerp(-44, 16, u);
    q.y = u < TAIL ? lerp(-2.5, -11, u / TAIL) : -11.5 - Math.sin((Math.PI * (u - TAIL)) / 0.6) * 1.5;
    q.y += p.crouch * Math.min(1, u / TAIL);
    if (u >= TAIL) continue;
    const w = (TAIL - u) / TAIL;
    q.y += Math.sin(time * 4 + u * 9) * 0.7 * w;
    q.y -= p.coil * w ** 0.8 * 22;
    q.x += p.coil * w * 16 + p.rattle * w * 1.6;
    q.y = lerp(q.y, -2, Math.max(0, p.lash) * w);
    q.x -= p.lash * w * 10;
  }
  return spine;
}
