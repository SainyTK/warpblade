import { STAMINA, WARP } from "../../constants/combat";
import { DRILL_WARP_ACCENT } from "../../constants/touch";
import { ULT_LEVELS } from "../../constants/ultimate";
import {
  canPaySpell,
  canPayTier,
  DASH_LOCKOUT,
  drillSession,
  rechargeLeft,
  spellReady,
  spellRecharge,
  usesDrill,
} from "../../drill";
import { knownSpells } from "../../game/arts";
import { selectedSlot } from "../../game/hero/abilityBar";
import { heroJob } from "../../game/hero/job";
import { canPayDash } from "../../game/hero/stamina";
import { canAffordUlt, ultRecharge } from "../../game/hero/ultimate";
import { warpReady, warpRecharge } from "../../game/hero/warp";
import { character, hero } from "../../game/state";
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
  const session = usesDrill() ? drillSession() : undefined;
  if (session) {
    const { fighter, profile } = session;
    const tiers = profile.tiers;
    switch (spec.action) {
      case "attack": {
        const held = fighter.chargeHeldFor;
        if (held !== null) {
          const next = tiers.findIndex((tier) => held < tier.threshold);
          const from = tiers[next - 1]?.threshold ?? 0;
          look.charge = next < 0 ? tiers.length : next + (held - from) / (tiers[next].threshold - from);
        }
        look.affordable = fighter.chargeRecharge.remaining > 0 ? 0 : tiers.filter(canPayTier).length;
        break;
      }
      case "dash":
        look.cooldown = fighter.dashReadyIn / DASH_LOCKOUT;
        look.ready = look.cooldown === 0;
        break;
      case "cast": {
        const book = fighter.spellBook;
        const payable = knownSpells(profile).filter(canPaySpell);
        look.ready = payable.some((spell) => spellReady(book, spell));
        look.cooldown = look.ready
          ? 0
          : Math.min(1, ...payable.map((spell) => rechargeLeft(spellRecharge(book, spell))));
        break;
      }
      case "ultimate":
        look.accent = DRILL_WARP_ACCENT;
        look.cooldown = Math.min(1, fighter.warpReadyIn / WARP.cooldown);
        look.ready = look.cooldown === 0;
        break;
      case "guard":
        look.ready = hero.stamina > 0;
        break;
      default:
    }
    return look;
  }
  switch (spec.action) {
    case "attack":
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
      look.cooldown = slot ? Math.min(1, slot.wait() / slot.full()) : 0;
      break;
    }
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
