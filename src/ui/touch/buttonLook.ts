import { ELEMENTS } from "../../constants/combat";
import { ELEMENT_COLOR } from "../../constants/palette";
import { ULT_LEVELS } from "../../constants/ultimate";
import { dashRechargeTime } from "../../game/hero/dash";
import { castCost, selectedElement, spellRecharge } from "../../game/hero/spell";
import { canAffordUlt } from "../../game/hero/ultimate";
import { warpCooldown, warpCost } from "../../game/hero/warp";
import { game, hero } from "../../game/state";
import type { ButtonLook, TouchButtonSpec } from "../../types/touch";
import { hex } from "../../utils/color";

/** charge progress across the four levels, 0 to 4: whole levels reached plus the way to the next one the MP pays for */
function chargeProgress(): number {
  if (hero.state !== "charge") return -1;
  const level = hero.chargeLevel;
  const next = ULT_LEVELS[level];
  if (!next || !canAffordUlt(level + 1)) return level;
  const from = ULT_LEVELS[level - 1].at;
  return level + Math.min(1, (hero.charge - from) / (next.at - from));
}

/** how a button should look now, read from the game state */
export function buttonLook(spec: TouchButtonSpec, pressed: boolean): ButtonLook {
  const accent = spec.accent ? hex(spec.accent) : ELEMENT_COLOR[ELEMENTS[game.spell]];
  const look: ButtonLook = { pressed, ready: true, cooldown: 0, accent, affordable: 0, charge: -1 };
  switch (spec.action) {
    case "dash":
      look.ready = hero.dashes > 0;
      look.cooldown = hero.dashes > 0 ? 0 : 1 - hero.dashCd / dashRechargeTime();
      break;
    case "warp":
      look.ready = hero.mp >= warpCost();
      look.cooldown = hero.warpCd / warpCooldown();
      break;
    case "cast":
      look.ready = hero.mp >= castCost();
      look.cooldown = spellRecharge(selectedElement());
      break;
    case "ultimate":
      look.affordable = ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length;
      look.ready = look.affordable > 0;
      look.charge = chargeProgress();
      break;
    default:
  }
  return look;
}
