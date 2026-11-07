import { STAMINA } from "../../constants/combat";
import { RUSH } from "../../constants/hulda/rush";
import { HOP, SLIDE } from "../../constants/sable/moves";
import { TOUCH_TEXT } from "../../constants/touch";
import { ULT_LEVELS } from "../../constants/ultimate";
import { VAULT } from "../../constants/ysra/stance";
import { abilityMp, abilityRecharge, selectedAbility } from "../../game/hero/hulda/abilities";
import { hulda } from "../../game/hero/hulda/memory";
import { rushCost } from "../../game/hero/hulda/rush";
import { sable } from "../../game/hero/sable/memory";
import { reloadShare } from "../../game/hero/sable/reload";
import { selectedSpell } from "../../game/hero/sable/spells/cast";
import { castCost, knowsElement, selectedElement, spellRecharge } from "../../game/hero/spell";
import { canPayDash } from "../../game/hero/stamina";
import { canAffordUlt, ultRecharge } from "../../game/hero/ultimate";
import { warpCooldown, warpCost } from "../../game/hero/warp";
import { heat, overheatLeft, overheatReady } from "../../game/hero/ysra/pyre/heat";
import { riteCost, selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
import { hasPerk } from "../../game/progress";
import { character, hero } from "../../game/state";
import type { ButtonLook, TouchButtonSpec } from "../../types/touch";
import { hex } from "../../utils/color";
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

/** Kael's dash, warp and spell */
function kaelLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash":
      look.ready = canPayDash();
      look.cooldown = look.ready ? 0 : 1 - hero.stamina / STAMINA.dashCost;
      break;
    case "warp":
      look.ready = hasPerk("warpStrike") && hero.mp >= warpCost();
      look.cooldown = hero.warpCd / warpCooldown();
      break;
    case "cast":
      look.ready = knowsElement(selectedElement()) && hero.mp >= castCost();
      look.cooldown = spellRecharge(selectedElement());
      break;
    default:
  }
}

/** Sable's hop and slide need stamina, the snare MP and its recharge, the reload fills while she cranks */
function sableLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash":
      look.ready = hero.stamina >= SLIDE.cost;
      look.cooldown = look.ready ? 0 : 1 - hero.stamina / HOP.cost;
      break;
    case "cast": {
      const { spell } = selectedSpell();
      look.ready = spell.left() <= 0 && hero.mp >= spell.mp();
      look.cooldown = spell.left() / spell.cooldown();
      break;
    }
    case "cycle":
      look.cooldown = sable.reload ? 1 - reloadShare() : 0;
      break;
    default:
  }
}

/** Hulda's rush needs stamina and its short recharge; I shows the selected ability's MP and recharge */
function huldaLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash":
      look.ready = hero.stamina >= rushCost() && hulda.rushCd <= 0;
      look.cooldown = hero.stamina >= rushCost() ? hulda.rushCd / RUSH.cooldown : 1 - hero.stamina / rushCost();
      break;
    case "cast": {
      const id = selectedAbility();
      look.cooldown = abilityRecharge(id);
      look.ready = look.cooldown <= 0 && hero.mp >= abilityMp(id);
      break;
    }
    default:
  }
}

/** Ysra's guard needs stamina, her vault waits out its recharge, and the rite fills as Heat comes to cover it */
function ysraLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash":
      look.ready = hero.stamina > 0;
      break;
    case "warp":
      look.ready = hero.warpCd <= 0;
      look.cooldown = hero.warpCd / VAULT.cooldown;
      break;
    case "cast": {
      const rite = selectedRite();
      if (overheatReady()) break;
      look.ready = !!rite && overheatLeft() <= 0 && heat() >= riteCost(rite);
      look.cooldown = rite ? Math.max(0, 1 - heat() / riteCost(rite)) : 1;
      break;
    }
    default:
  }
}

/** how a button should look now, read from the game state */
export function buttonLook(spec: TouchButtonSpec, pressed: boolean): ButtonLook {
  const text = TOUCH_TEXT[character.kit][spec.action];
  const accent = text.accent ? hex(text.accent) : selectionTint(touchSelection());
  const look: ButtonLook = { pressed, ready: true, cooldown: 0, accent, affordable: 0, charge: -1 };
  if (spec.action === "ultimate") {
    look.cooldown = ultRecharge();
    look.affordable = !hero.ultCd ? ULT_LEVELS.filter((_, i) => canAffordUlt(i + 1)).length : 0;
    look.ready = look.affordable > 0;
    look.charge = chargeProgress();
  } else if (character.kit === "sable") sableLook(spec, look);
  else if (character.kit === "hulda") huldaLook(spec, look);
  else if (character.kit === "ysra") ysraLook(spec, look);
  else kaelLook(spec, look);
  return look;
}
