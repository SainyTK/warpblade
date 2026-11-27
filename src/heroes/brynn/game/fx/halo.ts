import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawGreatsword } from "./blade";

const RADIUS = 22;
const LENGTH = 12;

export function bladeHalo(blades: number, lift: number): FxShapeDraw {
  return (cast, at, kit, progress, fade) => {
    const head = at.toX === undefined ? 0 : (at.toX - at.x) * (at.face ?? 1);
    const open = ease.outCubic(Math.min(1, progress * 3));
    const radius = RADIUS * Math.sqrt(cast.size) * open;
    const alpha = fade * (1 - smooth(0.6, 1, progress));
    const turn = progress * 2.4;
    for (let i = 0; i < blades; i++) {
      const a = (i / blades) * TAU + turn;
      const x = head + Math.cos(a) * radius;
      const y = Math.sin(a) * radius * 0.55 - lift;
      drawGreatsword(kit, x, y, a + Math.PI / 2, LENGTH, alpha);
    }
  };
}
