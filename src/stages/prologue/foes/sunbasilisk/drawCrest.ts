import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { BASILISK_COLORS as C } from "./colors";
import type { BasiliskPose } from "./pose";

type Pt = readonly [number, number];
const SPINES = 5;

function spineTips(hx: number, hy: number, p: BasiliskPose): { base: Pt[]; tip: Pt[] } {
  const base: Pt[] = [];
  const tip: Pt[] = [];
  const open = Math.max(0, p.crest);
  const droop = Math.min(0, p.crest);
  for (let i = 0; i < SPINES; i++) {
    const u = i / (SPINES - 1);
    const bx = hx + 3 - u * 10;
    const by = hy - 5 + u * 2.5;
    const angle = -1.45 - u * (0.5 + 0.55 * open) + droop * 0.9;
    const len = (6 + 2.5 * Math.sin(u * Math.PI)) * (0.55 + 0.7 * open);
    base.push([bx, by]);
    tip.push([bx + Math.cos(angle) * len, by + Math.sin(angle) * len]);
  }
  return { base, tip };
}

export function drawCrest(s: SpriteCanvas, hx: number, hy: number, p: BasiliskPose, time: number): void {
  const { base, tip } = spineTips(hx, hy, p);
  const vein = p.charge > 0.75 ? WHITE : mix(C.frill[1], C.crackHot, p.charge);
  s.begin();
  s.poly([...base, ...[...tip].reverse()], C.frill[2]);
  for (let i = 0; i < SPINES - 1; i++) {
    const mx = (tip[i][0] + tip[i + 1][0]) / 2;
    const my = (tip[i][1] + tip[i + 1][1]) / 2;
    s.poly([base[i], tip[i], [mx + (my - base[i][1]) * 0.05, my + 1], tip[i + 1], base[i + 1]], C.frill[2]);
  }
  s.shadeEdges(C.frill[2], C.frill[3], C.frill[1], 2);
  for (let i = 0; i < SPINES; i++) s.hairline(base[i][0], base[i][1], tip[i][0], tip[i][1], vein);
  s.commit();
  s.begin();
  for (let i = 0; i < SPINES; i++) s.taper(base[i][0], base[i][1], tip[i][0], tip[i][1], 0.7, 0.25, C.spine[1]);
  s.shadeEdges(C.spine[1], C.spine[2], C.spine[0]);
  const flicker = p.charge > 0 && Math.floor(time * 16) % 2 === 0;
  for (const [x, y] of tip) s.set(x, y, flicker ? WHITE : C.spine[2]);
  s.commit();
}
