import { H } from "../../../constants/stage";
import { glowLine, hairline } from "../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { smooth } from "../../../utils/math";
import { fineRing } from "../../effects/fine";

const SEGMENTS = 7;

function strike(kit: ElementKit, x0: number, y0: number, x1: number, y1: number, jag: number, seed: number, a: number) {
  const R = kit.look.ramp;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS;
    const off = i === SEGMENTS ? 0 : (grain(i, seed) - 0.5) * 2 * jag;
    const qx = x0 + (x1 - x0) * u + off;
    const qy = y0 + (y1 - y0) * u;
    kit.motif(px, py, Math.atan2(qy - py, qx - px), Math.hypot(qx - px, qy - py), a, 0);
    hairline(px, py, qx, qy, WHITE, a);
    px = qx;
    py = qy;
  }
  glowLine(x0, y0, x1, y1, 6 + jag * 0.6, R[3], 0.27 * a);
}

export const drawBolt: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const flicker = progress < 0.5 ? 1 : grain(Math.floor(progress * 20), 3) > 0.35 ? 1 : 0.3;
  const a = fade * flicker * (1 - smooth(0.55, 1, progress));
  const top = at.toY !== undefined ? at.toY - at.y : -Math.min(H, (at.reach ?? 70) * cast.size);
  const fromX = at.toX !== undefined ? (at.toX - at.x) * (at.face ?? 1) : 0;
  const jag = (4 + rank * 2) * cast.size * 0.6;
  const seed = Math.floor(progress * 4) + rank * 17;
  strike(kit, fromX, top, 0, 0, jag, seed, a);
  if (rank >= 1) {
    const mx = fromX * 0.5;
    const my = top * 0.5;
    strike(kit, mx, my, mx + jag * 2, my * 0.2, jag * 0.5, seed + 5, a * 0.8);
  }
  if (rank >= 2) {
    strike(kit, fromX + jag * 3, top, jag * 0.8, 0, jag * 0.8, seed + 11, a * 0.9);
    const ring = (8 + rank * 4) * cast.size * smooth(0, 0.5, progress);
    fineRing(0, 0, ring, ring * 0.3, R[4], fade * (1 - progress));
    kit.core(0, -2, (2 + rank) * (1 - progress), fade, rank);
  }
  if (rank >= 3) {
    for (let i = 0; i < 4; i++) {
      const ox = (i < 2 ? -1 : 1) * (18 + (i % 2) * 22) * cast.size * 0.6;
      const when = smooth(0.05 + i * 0.06, 0.15 + i * 0.06, progress);
      if (when <= 0) continue;
      strike(kit, ox + jag, top, ox, 0, jag * 0.7, seed + 23 + i, a * when);
    }
  }
};
