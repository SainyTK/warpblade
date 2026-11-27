import { skillFx } from "../../../../game/skillFx";
import { skillLevel } from "../../../../game/skills/query";
import type { FxAt, FxCast, FxShape, SkillFxOptions } from "../../../../types/skillFx";
import { type Sigil, sigilSignature } from "./sigil";

export type { Sigil } from "./sigil";

export interface AldricFxOptions extends SkillFxOptions {
  sigil?: Sigil;
  lift?: number;
}

export function aldricFx(id: string, shape: FxShape, at: FxAt, options: AldricFxOptions = {}): FxCast | null {
  if (skillLevel(id) <= 0) return null;
  const { sigil, lift = 0, ...rest } = options;
  const signature = sigil && !rest.quiet ? sigilSignature(sigil, lift) : undefined;
  return skillFx(id, shape, at, { ...rest, signature });
}
