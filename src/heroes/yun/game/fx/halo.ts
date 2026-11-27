import type { FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawFxSword } from "./parts";

const RADIUS = 18;
const LENGTH = 9;

export function swordHalo(swords: number, lift: number): FxShapeDraw {
  return (cast, _at, kit, progress, fade) => {
    const open = ease.outCubic(Math.min(1, progress * 3));
    const radius = RADIUS * Math.sqrt(cast.size) * open;
    const alpha = fade * (1 - smooth(0.6, 1, progress));
    const turn = progress * 3;
    for (let i = 0; i < swords; i++) {
      const a = (i / swords) * TAU + turn;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius * 0.4 - lift;
      drawFxSword(kit, x, y - LENGTH, Math.PI / 2, LENGTH, alpha);
    }
  };
}
