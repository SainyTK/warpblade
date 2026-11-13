import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { createTether } from "../../../effects/orrin/tether";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues, withCharms } from "../../../skills/query";
import { distance2, foesOnScreen } from "../../../skills/targets";
import { game, hero } from "../../../state";
import { startAbility } from "../castCheck";
import { orrin } from "../memory";

const TETHER = "o_tether";

/** the foes nearest him, up to `count` */
function nearest(count: number): Enemy[] {
  return foesOnScreen()
    .sort((a, b) => distance2(a, hero.x, hero.y - 16) - distance2(b, hero.x, hero.y - 16))
    .slice(0, count);
}

/** I with Tether: chain the nearest foes together; it needs two to chain, and it has no wide form */
export function castTether(): boolean {
  const v = skillValues(TETHER);
  const foes = v.gang ? foesOnScreen() : nearest(withCharms("amount", v.count));
  if (foes.length < 2) return false;
  if (!startAbility(v.mp, false)) return false;
  orrin.tetherCd = withCharms("cooldown", v.cooldown);
  const life = withCharms("duration", v.life);
  game.fx.push(createTether(foes, { share: v.share, life, yank: v.yank, burst: v.burst, gang: v.gang > 0 }));
  sfx.clink();
  emitSkillEvent({ type: "cast", ability: TETHER });
  return true;
}
