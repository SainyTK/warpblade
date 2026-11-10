import { STAMINA } from "../../constants/combat";
import { RUSH } from "../../constants/hulda/rush";
import { STILLFIELD } from "../../constants/mirel/field";
import { BACKLINE } from "../../constants/orrin/backline";
import { HOP, SLIDE } from "../../constants/sable/moves";
import { TOUCH_TEXT } from "../../constants/touch";
import { ULT_LEVELS } from "../../constants/ultimate";
import { SWAP } from "../../constants/wenna/swap";
import { VAULT } from "../../constants/ysra/stance";
import { abilityMp, abilityRecharge, selectedAbility } from "../../game/hero/hulda/abilities";
import { hulda } from "../../game/hero/hulda/memory";
import { rushCost } from "../../game/hero/hulda/rush";
import {
  selectedAbility as mirelAbility,
  abilityMp as mirelMp,
  abilityRecharge as mirelRecharge,
} from "../../game/hero/mirel/abilities";
import { mirel } from "../../game/hero/mirel/memory";
import { rewindCost } from "../../game/hero/mirel/rewind";
import { hasSand } from "../../game/hero/mirel/sand";
import {
  selectedAbility as orrinAbility,
  abilityMp as orrinMp,
  abilityRecharge as orrinRecharge,
} from "../../game/hero/orrin/abilities";
import { hookCost } from "../../game/hero/orrin/hook";
import { orrin } from "../../game/hero/orrin/memory";
import { sable } from "../../game/hero/sable/memory";
import { reloadShare } from "../../game/hero/sable/reload";
import { selectedSpell } from "../../game/hero/sable/spells/cast";
import { castCost, selectedAbility as kaelAbility, spellRecharge } from "../../game/hero/spell";
import { canPayDash } from "../../game/hero/stamina";
import {
  selectedAbility as tallisAbility,
  abilityMp as tallisMp,
  abilityRecharge as tallisRecharge,
} from "../../game/hero/tallis/abilities";
import { tallis } from "../../game/hero/tallis/memory";
import { canSink, sinkCost } from "../../game/hero/tallis/sink";
import { veilCost } from "../../game/hero/tallis/veil";
import { canAffordUlt, ultRecharge } from "../../game/hero/ultimate";
import { warpCost, warpReady, warpRecharge } from "../../game/hero/warp";
import {
  selectedAbility as wennaAbility,
  abilityMp as wennaMp,
  abilityRecharge as wennaRecharge,
} from "../../game/hero/wenna/abilities";
import { lightCost } from "../../game/hero/wenna/light";
import { wenna } from "../../game/hero/wenna/memory";
import { swapTarget } from "../../game/hero/wenna/swap";
import { hasWax } from "../../game/hero/wenna/wax";
import { heat, overheatLeft } from "../../game/hero/ysra/pyre/heat";
import { riteCost, selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
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
      look.ready = warpReady() && hero.mp >= warpCost();
      look.cooldown = warpRecharge();
      break;
    case "cast":
      look.ready = hero.mp >= castCost();
      look.cooldown = spellRecharge(kaelAbility());
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

/** Orrin's hook needs stamina and, in the air, a hook left; the reel and Backline need stamina; I shows the selected
 *  ability's MP and recharge */
function orrinLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash": {
      const swinging = hero.state === "swing";
      look.ready = swinging ? hero.stamina > 0 : hero.stamina >= BACKLINE.cost && orrin.backlineCd <= 0;
      look.cooldown = look.ready ? 0 : swinging ? 1 : 1 - Math.min(1, hero.stamina / BACKLINE.cost);
      break;
    }
    case "warp":
      look.ready = hero.stamina >= hookCost() && (hero.ground || orrin.hooks > 0);
      look.cooldown = hero.stamina >= hookCost() ? 0 : 1 - hero.stamina / hookCost();
      break;
    case "cast": {
      const id = orrinAbility();
      look.cooldown = orrinRecharge(id);
      look.ready = look.cooldown <= 0 && hero.mp >= orrinMp(id);
      break;
    }
    default:
  }
}

/** Mirel's Rewind and Still need Sand and wait out their own recharge; I shows the selected ability's MP and recharge */
function mirelLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "dash": {
      const cost = rewindCost();
      look.ready = mirel.rewindCd <= 0 && hasSand(cost);
      look.cooldown = look.ready ? 0 : Math.max(0, 1 - mirel.sand / Math.max(1, cost));
      break;
    }
    case "warp":
      look.ready = !!mirel.field || (mirel.fieldCd <= 0 && hasSand(STILLFIELD.open));
      look.cooldown = look.ready ? 0 : Math.max(mirel.fieldCd / STILLFIELD.cooldown, 1 - mirel.sand / STILLFIELD.open);
      break;
    case "cast": {
      const id = mirelAbility();
      look.cooldown = mirelRecharge(id);
      look.ready = look.cooldown <= 0 && hero.mp >= mirelMp(id);
      break;
    }
    default:
  }
}

/** Wenna's Light needs Wax, her Swap a charge, stamina and a Wick in reach; I shows the selected ability's MP and recharge */
function wennaLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "warp": {
      const cost = lightCost();
      look.ready = hasWax(cost);
      look.cooldown = look.ready ? 0 : Math.max(0, 1 - wenna.wax / Math.max(1, cost));
      break;
    }
    case "dash":
      look.ready = wenna.swapCharges > 0 && hero.stamina >= SWAP.stamina && !!swapTarget();
      look.cooldown = wenna.swapCharges > 0 ? 0 : Math.min(1, wenna.swapCd / SWAP.cooldown);
      break;
    case "cast": {
      const id = wennaAbility();
      look.cooldown = wennaRecharge(id);
      look.ready = look.cooldown <= 0 && hero.mp >= wennaMp(id);
      break;
    }
    default:
  }
}

/** Tallis's Veil needs Gloam and waits a moment after it ends, his Sink stamina and its wait; I shows the selected
 *  ability's MP and recharge */
function tallisLook(spec: TouchButtonSpec, look: ButtonLook): void {
  switch (spec.action) {
    case "warp": {
      const cost = veilCost();
      look.ready = tallis.veil || (tallis.veilLock <= 0 && tallis.gloam >= cost && tallis.gloam > 0);
      look.cooldown = look.ready ? 0 : Math.max(tallis.veilLock, 1 - tallis.gloam / Math.max(1, cost));
      break;
    }
    case "dash":
      look.ready = hero.state === "sink" || canSink() || !hero.ground;
      look.cooldown = look.ready ? 0 : hero.stamina < sinkCost() ? 1 - hero.stamina / sinkCost() : 1;
      break;
    case "cast": {
      const id = tallisAbility();
      look.cooldown = tallisRecharge(id);
      look.ready = look.cooldown <= 0 && hero.mp >= tallisMp(id);
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
  else if (character.kit === "orrin") orrinLook(spec, look);
  else if (character.kit === "mirel") mirelLook(spec, look);
  else if (character.kit === "wenna") wennaLook(spec, look);
  else if (character.kit === "tallis") tallisLook(spec, look);
  else if (character.kit === "ysra") ysraLook(spec, look);
  else kaelLook(spec, look);
  return look;
}
