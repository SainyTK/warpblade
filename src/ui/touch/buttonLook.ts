import { STAMINA } from "../../constants/combat";
import { ULT_LEVELS } from "../../constants/ultimate";
import { selectedSlot } from "../../game/hero/abilityBar";
import { heroJob } from "../../game/hero/job";
import { canPayDash } from "../../game/hero/stamina";
import { canAffordUlt, ultRecharge } from "../../game/hero/ultimate";
import { warpReady, warpRecharge } from "../../game/hero/warp";
import { character, hero } from "../../game/state";
import { preparationShare, tempestProgress, usesCeriseDrill } from "../../heroes";
import { DASH_LOCKOUT, drillFighter, SKILL_TIERS, usesKaelDrill } from "../../kaelDrill";
import type { ButtonLook, TouchButtonSpec } from "../../types/touch";
import { hex } from "../../utils/color";
import { touchText } from "../../utils/controls";
import { selectionTint, touchSelection } from "./selection";

/** charge progress across the four levels, 0 to 4: whole levels reached plus the way to the next one the MP pays for */
function chargeProgress(): number {
  if (hero.state !== "charge") return -1;
  const level = hero.chargeLevel;
  const next = ULT_LEVELS[level];
  if (!next || !canAffordUlt(level + 1)) return level;
  const from = ULT_LEVELS[level - 1].at;
  return level + Math.min(1, (hero.charge - from) / (next.at - from));
}

/**
 * How a button should look now, read from the game state; every hero's buttons read the same moveset. J shows the warp's
 * recharge (J held), the dodge its stamina, the guard whether stamina is left, I the ability it would cast, U the charge.
 */
export function buttonLook(spec: TouchButtonSpec, pressed: boolean): ButtonLook {
  const text = touchText(character, heroJob())[spec.action];
  const accent = text.accent ? hex(text.accent) : selectionTint(touchSelection());
  const look: ButtonLook = { pressed, ready: true, cooldown: 0, accent, affordable: 0, charge: -1 };
  if (usesKaelDrill()) {
    const fighter = drillFighter();
    switch (spec.action) {
      case "attack": {
        const held = fighter?.chargeHeldFor;
        if (held !== undefined && held !== null) {
          const next = SKILL_TIERS.findIndex((tier) => held < tier.threshold);
          const from = SKILL_TIERS[next - 1]?.threshold ?? 0;
          look.charge = next < 0 ? SKILL_TIERS.length : next + (held - from) / (SKILL_TIERS[next].threshold - from);
        }
        look.affordable = SKILL_TIERS.length;
        break;
      }
      case "dash":
        look.cooldown = (fighter?.dashReadyIn ?? 0) / DASH_LOCKOUT;
        look.ready = look.cooldown === 0 || (fighter?.warpReadyIn === 0 && !!fighter.swing);
        break;
      case "cast": {
        const prep = fighter?.spellBook.preparation;
        look.cooldown = prep && prep.duration > 0 ? prep.remaining / prep.duration : 0;
        look.ready = look.cooldown === 0;
        break;
      }
      case "cycle":
        look.ready = !fighter?.spellBook.preparation;
        break;
      case "guard":
        look.ready = hero.stamina > 0;
        break;
      default:
    }
    return look;
  }
  const cerise = usesCeriseDrill();
  switch (spec.action) {
    case "attack":
      if (cerise) {
        look.cooldown = ultRecharge();
        look.affordable = hero.ultCd > 0 ? 0 : ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length;
        look.charge = tempestProgress();
        break;
      }
      look.cooldown = warpReady() ? 0 : warpRecharge();
      break;
    case "dash":
      look.ready = canPayDash();
      look.cooldown = look.ready ? 0 : 1 - hero.stamina / STAMINA.dashCost;
      break;
    case "guard":
      look.ready = hero.stamina > 0;
      break;
    case "cast": {
      const slot = selectedSlot();
      look.ready = !!slot && slot.wait() <= 0 && slot.affordable();
      const prep = cerise ? preparationShare() : null;
      look.ready &&= !prep;
      look.cooldown = prep ?? (slot ? Math.min(1, slot.wait() / slot.full()) : 0);
      break;
    }
    case "cycle":
      if (cerise) look.ready = preparationShare() === null;
      break;
    case "ultimate":
      look.cooldown = ultRecharge();
      look.affordable = !hero.ultCd ? ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length : 0;
      look.ready = look.affordable > 0;
      look.charge = chargeProgress();
      break;
    default:
  }
  return look;
}
