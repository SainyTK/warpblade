import { hairline, polygon } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { BRYNN_COLORS } from "../../look/colors";

const C = BRYNN_COLORS;
const PLATES = [2, 4, 6, 8] as const;
const RADIUS = [8, 10, 12, 15] as const;

function plate(kit: ElementKit, x: number, y: number, angle: number, size: number, alpha: number): void {
  const R = kit.look.ramp;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const corner = (u: number, v: number): [number, number] => [x + ax * u - ay * v, y + ay * u + ax * v];
  const points = [
    corner(-size, -size * 0.7),
    corner(size * 0.6, -size),
    corner(size, 0),
    corner(size * 0.6, size),
    corner(-size, size * 0.7),
  ];
  polygon(points, C.steelDark, alpha);
  polygon(
    [corner(-size * 0.6, -size * 0.4), corner(size * 0.4, -size * 0.6), corner(size * 0.6, 0), corner(-size * 0.6, 0)],
    C.steel,
    alpha,
  );
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    hairline(x0, y0, x1, y1, i < 2 ? R[5] : R[3], alpha);
  }
}

export const ARMOUR: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const n = PLATES[rank];
  const radius = RADIUS[rank] * (1 + cast.gradeInTier * 0.2);
  const lock = ease.outBack(Math.min(1, progress * 4));
  const burst = rank >= 3 ? smooth(0.6, 1, progress) : 0;
  const r = radius * (1.8 - lock * 0.8) + burst * radius * 1.5;
  const size = 1.6 + rank * 0.5;
  const alpha = fade * (1 - smooth(0.8, 1, progress));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU - Math.PI / 2 + (rank >= 2 ? progress * 1.2 : 0);
    plate(kit, Math.cos(a) * r * 0.8, Math.sin(a) * r, a, size, alpha);
  }
  if (rank >= 2) fineRing(0, 0, r * 0.8 + size + 1, r + size + 1, R[4], alpha * 0.8);
  if (rank >= 3) fineRing(0, 0, (r + size + 4) * 0.8, r + size + 4, R[3], alpha * 0.6);
};
