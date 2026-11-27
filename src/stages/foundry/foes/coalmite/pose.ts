import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { MITE_TIMES } from "./moves";

export interface MitePose {
  wide: number;
  tall: number;
  lift: number;
  heat: number;
  stride: number;
  tuck: number;
  hurt: boolean;
}

export function mitePose(e: Enemy, time: number): MitePose {
  if (e.stagger > 0) return { wide: 7.6, tall: 4.6, lift: 0, heat: 0, stride: 0, tuck: 0, hurt: true };
  if (e.state === "wind") {
    const u = clamp(e.st / MITE_TIMES.wind);
    return {
      wide: 6.6 + u * 0.8,
      tall: 6 - u * 1.4,
      lift: 0,
      heat: u,
      stride: Math.sin(time * 40) * 0.3,
      tuck: 0,
      hurt: false,
    };
  }
  if (e.state === "lunge") return { wide: 5.8, tall: 7, lift: e.ay, heat: 0.8, stride: 0, tuck: 1, hurt: false };
  if (e.state === "recover") {
    const u = clamp(e.st / MITE_TIMES.recover);
    return { wide: 7 - u * 0.6, tall: 5.4 + u * 0.8, lift: 0, heat: 0.4 * (1 - u), stride: 0, tuck: 0, hurt: false };
  }
  const beat = Math.sin(time * 18);
  return { wide: 6.4, tall: 6.2 + Math.abs(beat) * 0.3, lift: 0, heat: 0, stride: beat, tuck: 0, hurt: false };
}
