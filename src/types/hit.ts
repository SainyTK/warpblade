import type { Ramp } from "./color";

export type HitWeight = "crowd" | "spell" | "light" | "heavy" | "crit";

export interface HitLook {
  sparks: Ramp;
  spell?: boolean;
  heavy?: boolean;
}

export interface HitWeightFeel {
  flash: number;
  stop: number;
  shake: readonly [number, number] | null;
  spark: number;
  impact: boolean;
  pulse: boolean;
  squash: number;
  recoil: number;
}
