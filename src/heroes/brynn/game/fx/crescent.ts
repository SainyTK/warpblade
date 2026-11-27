import { hairline, polygon } from "../../../../engine/frame";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";

const STEPS = 10;
const TRAVEL = [26, 40, 58, 86] as const;
const TALL = [9, 13, 17, 22] as const;

function moon(kit: ElementKit, x: number, y: number, tall: number, thick: number, alpha: number): void {
  const R = kit.look.ramp;
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  const mid: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / STEPS;
    const w = thick * Math.sin((Math.PI * i) / STEPS);
    const ox = x + Math.cos(a) * tall * 0.55;
    const oy = y + Math.sin(a) * tall;
    outer.push([ox, oy]);
    inner.push([ox - w, oy]);
    mid.push([ox - w * 0.4, oy]);
  }
  polygon([...outer, ...inner.reverse()], R[2], alpha);
  polygon([...outer, ...mid.reverse()], R[4], alpha);
  for (let i = 0; i < STEPS; i++) {
    hairline(outer[i][0], outer[i][1], outer[i + 1][0], outer[i + 1][1], R[5], alpha);
  }
}

export const CRESCENT: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const travel = TRAVEL[rank] * cast.size * 0.7;
  const tall = TALL[rank] * (1 + cast.gradeInTier * 0.3);
  const go = ease.outCubic(smooth(0.05, 0.8, progress));
  const alpha = fade * (1 - smooth(0.75, 1, progress));
  const thick = 2 + rank * 1.2;
  const head = 6 + travel * go;
  moon(kit, head, 0, tall, thick, alpha);
  if (rank >= 1) {
    for (let i = 0; i < 2 + rank; i++) {
      const y = (i % 2 ? -1 : 1) * tall * 0.35 * (1 + i * 0.2);
      kit.motif(head - thick - 2 - i * 4, y, Math.PI, 2 + rank, alpha * 0.8, rank);
    }
  }
  if (rank >= 2) {
    const late = ease.outCubic(smooth(0.15, 0.9, progress));
    moon(kit, 6 + travel * 0.75 * late, 0, tall * 0.8, thick * 0.8, alpha * 0.8);
  }
  if (rank >= 3) {
    const fan = ease.outCubic(smooth(0.1, 0.85, progress));
    for (const s of [-1, 1]) {
      moon(kit, 6 + travel * 0.9 * fan, s * tall * 0.9 * fan, tall * 0.7, thick * 0.7, alpha * 0.85);
    }
  }
};
