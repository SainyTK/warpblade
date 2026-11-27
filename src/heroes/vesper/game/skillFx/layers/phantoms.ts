import { place } from "../../../../../engine/frame";
import { smooth } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";
import { drawPhantom } from "../../phantom";

const TROUPE: readonly (readonly (readonly [number, number])[])[] = [
  [[-12, 0.35]],
  [[-12, 0.5]],
  [
    [-12, 0.55],
    [12, 0.5],
  ],
  [
    [-12, 0.6],
    [12, 0.55],
    [-24, 0.4],
    [24, 0.35],
  ],
];
const FEET = 14;

export const drawPhantomsLayer: VesperLayerDraw = (cast, _kit, progress, fade, center, at) => {
  const face = at.face ?? 1;
  const alpha = fade * (1 - smooth(0.5, 1, progress));
  if (alpha <= 0.05) return;
  const feet = at.y + center.y + FEET;
  for (const [dx, k] of TROUPE[cast.feel.rank]) {
    const side = Math.sign(dx);
    drawPhantom(at.x + face * (center.x + dx), feet, -side * face, k * alpha);
  }
  place(at.x, at.y, face < 0);
};
