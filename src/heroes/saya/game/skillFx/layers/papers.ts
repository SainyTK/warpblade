import { hairline, polygon } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { smooth, TAU } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const SLIPS = [2, 3, 5, 8] as const;

export const drawPapersLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const slips = SLIPS[rank];
  const radius = (7 + rank * 3) * s * smooth(0, 0.3, progress);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const w = 1.6 * s;
  const h = 2.6 * s;
  for (let i = 0; i < slips; i++) {
    const a = (i / slips) * TAU + progress * 4;
    const x = center.x + Math.cos(a) * radius;
    const y = center.y + Math.sin(a) * radius * 0.6;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const corner = (u: number, v: number): [number, number] => [x + u * c - v * sn, y + u * sn + v * c];
    polygon([corner(-w, -h), corner(w, -h), corner(w, h), corner(-w, h)], R[4], alpha);
    hairline(...corner(-w, -h), ...corner(w, -h), WHITE, alpha);
    hairline(...corner(0, -h * 0.6), ...corner(0, h * 0.6), kit.look.dark, alpha);
  }
};
