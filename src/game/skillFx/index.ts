import type { FxAt, FxCast, FxShape, SkillFxOptions } from "../../types/skillFx";
import { game } from "../state";
import { admitScale, trackSkillFx } from "./budget";
import { createSkillEffect } from "./effect";
import { skillCast } from "./intensity";
import { ELEMENT_KITS } from "./kits";

export { liveSkillFx } from "./budget";
export { castFrom, expectedHit, intensityOf, skillCast, tierOf } from "./intensity";
export { ELEMENT_KITS, fork } from "./kits";

export function playSkillFx(shape: FxShape, cast: FxCast, at: FxAt, options: SkillFxOptions = {}): void {
  const budgetScale = admitScale(!!options.quiet);
  if (budgetScale === null) return;
  const kit = ELEMENT_KITS[options.element ?? cast.element];
  game.fx.push(trackSkillFx(createSkillEffect(shape, cast, at, kit, options, budgetScale)));
}

export function skillFx(id: string, shape: FxShape, at: FxAt, options: SkillFxOptions = {}): FxCast {
  const cast = skillCast(id, options.damage, options.element, !!options.quiet);
  playSkillFx(shape, cast, at, options);
  return cast;
}
