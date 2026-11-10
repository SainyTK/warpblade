import { BACK_BONUS } from "../../../constants/tallis/knives";
import type { Enemy } from "../../../types/enemy";
import type { HeroState } from "../../../types/hero";
import { type OwnHit, registerDamageHooks } from "../../damageHooks";
import { stacksOf } from "../../enemies/skillStatus";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { isMarked } from "./marks";

/** the states his J blows land in, which Backbiter strengthens from behind */
const KNIFE_STATES: ReadonlySet<HeroState> = new Set<HeroState>(["knife", "dropStab", "risingCut"]);

/**
 * His blows from behind: every melee hit of his own from behind deals half again on top of the shared back bonus, so
 * 2.25 times in all; Backbiter adds to his J blows, Ink Wound to Inked foes and Cut Tendon to tripped ones.
 */
function hitBonus(e: Enemy, hit: OwnHit): number {
  if (!hit.back || !hit.melee) return 0;
  let bonus = BACK_BONUS;
  if (KNIFE_STATES.has(hero.state)) bonus += skillValues("t_backbiter").power ?? 0;
  if (stacksOf(e, "t_inkWound") > 0) bonus += skillValues("t_inkWound").back ?? 0;
  if (e.stun > 0) bonus += skillValues("t_cutTendon").tripBack ?? 0;
  return bonus;
}

/** a foe Mark of Dusk marks takes more from every source once its level says so */
const takenBonus = (e: Enemy): number => (isMarked(e) ? (skillValues("t_markDusk").taken ?? 0) : 0);

registerDamageHooks("tallis", { hitBonus, takenBonus });
