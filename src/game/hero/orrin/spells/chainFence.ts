import { sfx } from "../../../../services/audio";
import { createChainFence, type FenceSpec } from "../../../effects/orrin/chainFence";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero } from "../../../state";
import { surfaceBelow } from "../../../world";
import { castsWide, startAbility } from "../castCheck";
import { orrin } from "../memory";

const FENCE = "o_chainfence";

/** one side's fences: the first just beyond him on that side, each next one further on */
function fenceLine(side: number, count: number, length: number, spec: FenceSpec): void {
  for (let i = 0; i < count; i++) {
    const at = hero.x + side * (length / 2 + 8 + i * (length + 10));
    game.fx.push(createChainFence(at, surfaceBelow(at, hero.y - 4), spec));
  }
}

/**
 * I with Chain Fence: two posts ahead of him and a chain at knee height between them. Held, Stockade: the same fences
 * go up behind him too.
 */
export function castFence(wide: boolean): boolean {
  const v = skillValues(FENCE);
  const big = castsWide(wide, v.mp);
  if (!startAbility(v.mp, big)) return false;
  orrin.fenceCd = withCharms("cooldown", v.cooldown);
  const length = withCharms("area", v.length);
  const count = withCharms("amount", v.count);
  const spec = {
    length,
    power: v.power,
    stumble: v.stumble,
    slow: v.slow > 0,
    spark: v.spark,
    life: withCharms("duration", v.life),
    razor: v.razor,
  };
  fenceLine(hero.face, count, length, spec);
  if (big) fenceLine(-hero.face, count, length, spec);
  sfx.clink();
  emitSkillEvent({ type: "cast", ability: FENCE });
  return true;
}
