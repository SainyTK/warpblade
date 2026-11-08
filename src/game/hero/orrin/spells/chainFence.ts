import { sfx } from "../../../../services/audio";
import { createChainFence } from "../../../effects/orrin/chainFence";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues, withCharms } from "../../../skills/query";
import { game, hero } from "../../../state";
import { surfaceBelow } from "../../../world";
import { canCast } from "../castCheck";
import { orrin } from "../memory";

const FENCE = "o_chainfence";

/** I with Chain Fence: two posts ahead of him and a chain at knee height between them */
export function pressFence(): boolean {
  const v = skillValues(FENCE);
  if (!canCast(orrin.fenceCd, v.mp)) return true;
  hero.mp -= v.mp;
  orrin.fenceCd = withCharms("cooldown", v.cooldown);
  const length = withCharms("area", v.length);
  const x = hero.x + hero.face * (length / 2 + 8);
  const floor = surfaceBelow(x, hero.y - 4);
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
  for (let i = 0; i < count; i++) {
    const at = x + hero.face * i * (length + 10);
    game.fx.push(createChainFence(at, i ? surfaceBelow(at, hero.y - 4) : floor, spec));
  }
  sfx.clink();
  emitSkillEvent({ type: "cast", ability: FENCE });
  return true;
}
