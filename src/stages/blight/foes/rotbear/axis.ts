import type { BearPose, Pt } from "./pose";

export interface BodyAxis {
  at(u: number, out: number): Pt;
  d: Pt;
  n: Pt;
}

export function bodyAxis(p: BearPose): BodyAxis {
  const [hx, hy] = p.hip;
  const dx = p.shoulder[0] - hx;
  const dy = p.shoulder[1] - hy;
  const len = Math.hypot(dx, dy) || 1;
  const d: Pt = [dx / len, dy / len];
  const n: Pt = [d[1], -d[0]];
  return { d, n, at: (u, out) => [hx + dx * u + n[0] * out, hy + dy * u + n[1] * out] };
}
