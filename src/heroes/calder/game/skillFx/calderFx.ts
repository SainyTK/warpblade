import { skillFx } from "../../../../game/skillFx";
import type { FxAt, FxCast, FxShape, SkillFxOptions } from "../../../../types/skillFx";
import { calderSignature, type RoundPath } from "./signature";

export interface CalderFxOptions extends SkillFxOptions {
  round?: RoundPath;
}

const RING_GAP = 10;

function defaultPath(shape: FxShape, at: FxAt): RoundPath {
  if (at.toX !== undefined) return "along";
  if (shape === "slash" || shape === "wave" || shape === "trail") return "out";
  return "in";
}

export function calderFx(id: string, shape: FxShape, at: FxAt, options: CalderFxOptions = {}): FxCast {
  const { round, ...rest } = options;
  return skillFx(id, shape, at, { ...rest, signature: calderSignature(round ?? defaultPath(shape, at)) });
}

export function calderRing(id: string, shape: "wave" | "spikes", at: FxAt, options: CalderFxOptions = {}): FxCast {
  const face = at.face ?? 1;
  const back = { ...at, x: at.x - face * RING_GAP, face: -face };
  calderFx(id, shape, back, { ...options, quiet: true });
  return calderFx(id, shape, { ...at, x: at.x + face * RING_GAP, face }, options);
}
