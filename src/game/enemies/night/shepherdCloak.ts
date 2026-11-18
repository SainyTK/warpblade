import type { SpriteCanvas } from "../../../engine/sprite";
import { CLOAK, CLOAK_LINING } from "./colors";
import type { Rig } from "./rig";
import type { Point } from "./shepherdPose";

const HEM_POINTS = 7;
const HEM = { back: -10, front: 8, long: -2, short: -5, flareBack: 5, flareFront: 4 } as const;

export interface CloakFrame {
  hip: Point;
  chest: Point;
  flare: number;
  time: number;
}

function hemLine(f: CloakFrame): [number, number][] {
  const [hx, hy] = f.hip;
  const lift = Math.min(0, hy + 20) * 0.55;
  const back = hx + HEM.back - f.flare * HEM.flareBack;
  const front = hx + HEM.front + f.flare * HEM.flareFront;
  const points: [number, number][] = [];
  for (let i = 0; i < HEM_POINTS; i++) {
    const u = i / (HEM_POINTS - 1);
    const sway = Math.sin(f.time * 2.4 + i * 1.3) * 1.1 + Math.sin(f.time * 5.1 + i) * 0.4;
    const drop = i % 2 ? HEM.short : HEM.long;
    points.push([back + (front - back) * u + sway, drop + lift - f.flare * 2 * Math.sin(u * Math.PI)]);
  }
  return points;
}

export function drawCloak(s: SpriteCanvas, g: Rig, f: CloakFrame): void {
  const [cx, cy] = f.chest;
  const [hx, hy] = f.hip;
  const hem = hemLine(f);
  const outline: [number, number][] = [
    [cx + 3, cy - 2],
    [cx - 3, cy - 3],
    [cx - 8, cy + 2],
    [hx - 8, hy - 2],
    ...hem,
    [hx + 7, hy + 2],
    [cx + 6, cy + 6],
    [cx + 5, cy + 1],
  ];
  s.begin();
  g.poly(outline, CLOAK[1]);
  s.shadeEdges(CLOAK[1], CLOAK[3], CLOAK[0], 2);
  for (let i = 1; i < hem.length - 1; i++) {
    const [x, y] = hem[i];
    const from = cx - 6 + (i / hem.length) * 10;
    g.hairline(from, cy + 4, x, y - 1, i % 2 ? CLOAK[0] : CLOAK[2]);
  }
  s.commit();
  s.begin();
  const [fx, fy] = hem[hem.length - 1];
  g.poly(
    [
      [cx + 5, cy + 2],
      [cx + 6, cy + 6],
      [hx + 7, hy + 2],
      [fx, fy],
      [fx - 2.5, fy - 1],
      [hx + 4, hy + 1],
      [cx + 3.5, cy + 6],
    ],
    CLOAK_LINING,
  );
  s.shadeEdges(CLOAK_LINING, CLOAK[3], CLOAK[0]);
  s.commit();
}
