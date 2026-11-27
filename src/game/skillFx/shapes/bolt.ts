import { H, W } from "../../../constants/stage";
import { glowLine, hairline, line, polygon } from "../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../types/skillFx";
import { grain } from "../../../utils/grain";
import { smooth } from "../../../utils/math";
import { floorArc } from "../../effects/fine";
import { enemyCenter } from "../../enemies/enemy";
import { game } from "../../state";
import { surfaceBelow } from "../../world";

const SEGMENTS = 7;
const NEAR_FLOOR = 44;
const ARC_REACH = 100;
const ARCS_MOST = 4;
const DIM = 0x0a0818;
const WIDTH_BY_RANK = [0, 1, 2, 4] as const;

function strike(
  kit: ElementKit,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  jag: number,
  seed: number,
  a: number,
  width: number,
): void {
  const R = kit.look.ramp;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS;
    const off = i === SEGMENTS ? 0 : (grain(i, seed) - 0.5) * 2 * jag;
    const qx = x0 + (x1 - x0) * u + off;
    const qy = y0 + (y1 - y0) * u;
    if (width >= 2) {
      polygon(
        [
          [px - width, py],
          [px + width, py],
          [qx + width, qy],
          [qx - width, qy],
        ],
        R[3],
        a,
      );
    }
    if (width >= 1) line(px, py, qx, qy, R[4], a);
    hairline(px, py, qx, qy, R[5], a);
    px = qx;
    py = qy;
  }
  glowLine(x0, y0, x1, y1, 5 + width * 2, R[3], 0.2 * a);
}

export const drawBolt: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const flip = (at.face ?? 1) < 0 ? -1 : 1;
  const flicker = progress < 0.45 ? 1 : grain(Math.floor(progress * 20), 3) > 0.35 ? 1 : 0.35;
  const a = fade * flicker * (1 - smooth(0.6, 1, progress));
  const floorDy = surfaceBelow(at.x, at.y) - at.y;
  const end = floorDy <= NEAR_FLOOR ? floorDy : 0;
  const top = at.toY !== undefined ? at.toY - at.y : -Math.min(H, (at.reach ?? 70) * (1 + rank * 0.3));
  const fromX = at.toX !== undefined ? (at.toX - at.x) * flip : 0;
  const jag = (4 + rank * 2.5) * (1 + 0.3 * cast.gradeInTier);
  const seed = Math.floor(progress * 5) + rank * 17;
  if (rank >= 3) {
    const dim = 1 - smooth(0.05, 0.3, progress);
    if (dim > 0) {
      polygon(
        [
          [-W * 2, -H * 2],
          [W * 2, -H * 2],
          [W * 2, H * 2],
          [-W * 2, H * 2],
        ],
        DIM,
        0.45 * dim,
      );
    }
  }
  strike(kit, fromX, top, 0, end, jag, seed, a, WIDTH_BY_RANK[rank]);
  if (rank >= 1) {
    const my = top * 0.45;
    strike(kit, fromX * 0.5, my, fromX * 0.5 + jag * 2.5, my * 0.15, jag * 0.5, seed + 5, a * 0.85, 0);
  }
  if (rank >= 1 && end === floorDy) {
    const ring = (10 + rank * 10) * smooth(0, 0.45, progress);
    floorArc(0, end, ring, ring * 0.25, R[4], a * 1.4, 1, smooth(0.3, 1, progress), 5);
    floorArc(0, end, ring, ring * 0.25, R[3], a, -1, smooth(0.3, 1, progress), 6);
  }
  if (rank >= 2) {
    const sides = cast.gradeInTier >= 0.6 ? [-2, -1, 1, 2] : [-1, 1];
    for (const side of sides) {
      const sx = side * (14 + rank * 6);
      strike(
        kit,
        sx + jag,
        top * 0.9,
        sx,
        end,
        jag * 0.8,
        seed + 11 + side,
        a * 0.9,
        Math.abs(side) > 1 ? 0 : WIDTH_BY_RANK[rank] - 1,
      );
    }
    kit.core(0, end - 2, (2 + rank) * (1 - progress), fade, rank);
  }
  if (rank >= 3) {
    let arcs = 0;
    for (const e of game.enemies) {
      if (arcs >= ARCS_MOST || e.hp <= 0) continue;
      const [ex, ey] = enemyCenter(e);
      const dx = (ex - at.x) * flip;
      const dy = ey - at.y;
      if (Math.abs(dx) < 6 || Math.hypot(dx, dy) > ARC_REACH) continue;
      strike(kit, 0, end * 0.5, dx, dy, 5, seed + 31 + arcs, a, 1);
      arcs++;
    }
  }
};
