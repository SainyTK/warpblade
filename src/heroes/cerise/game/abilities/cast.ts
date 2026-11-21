import { createGlint } from "../../../../game/effects/flash";
import { isFree, setState } from "../../../../game/hero/actions";
import { comboOpen, endCombo } from "../../../../game/hero/combo";
import { emitSkillEvent } from "../../../../game/skills/events";
import { game, hero, lights, progress } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import { ABILITY_COLOR, ABILITY_COST, WIDE_COST } from "../../constants/abilities";
import { ABILITY_POINTS, POINTS } from "../../constants/points";
import type { CeriseAbility } from "../../types/ability";
import { gainPoints, spendPoints } from "../points";
import { cerise } from "../state";

/** an ability's MP, more for its wide form */
export const castCost = (a: CeriseAbility, wide: boolean): number => ABILITY_COST[a] * (wide ? WIDE_COST : 1);

export function payAbility(a: CeriseAbility, wide: boolean, recharge: number): void {
  hero.mp -= castCost(a, wide);
  cerise.abilityCd[a] = recharge / progress.stats.haste;
  cerise.abilityFull[a] = cerise.abilityCd[a];
}

/** I may cut in at once: in an open string after a blow has landed, or after a riposte link has struck */
const instant = (): boolean => comboOpen(1) || (hero.state === "riposte" && hero.hitDone);

/** the state each ability plays and the moment its clip lets it go */
export interface CastPlan {
  state: "flurry" | "lineCast" | "cast";
  /** where an instant cast starts its clip: past the wind-up */
  skipTo: number;
}

/**
 * Begin casting `a` (its wide form when `wide` and paid for): pay MP, spend up to two Points for power, start the
 * ability's state and recharge. In an open string or after a riposte link it starts past its wind-up, and in the Keen
 * beat it earns a Point first. False when she cannot cast now.
 */
export function beginCast(a: CeriseAbility, wide: boolean, plan: CastPlan, recharge: number): boolean {
  const cut = instant();
  if (!cut && !isFree()) return false;
  if (hero.mp < castCost(a, false)) return false;
  const paidWide = wide && hero.mp >= castCost(a, true);
  if (hero.keenOpen > 0) gainPoints(POINTS.keen);
  payAbility(a, paidWide, recharge);
  cerise.castAbility = a;
  cerise.castWide = paidWide;
  cerise.castSpent = spendPoints(ABILITY_POINTS.most);
  cerise.castPower = 1 + cerise.castSpent * ABILITY_POINTS.power;
  if (cut) endCombo(true);
  hero.move = null;
  setState(plan.state);
  if (cut) hero.st = plan.skipTo;
  const hx = hero.x + hero.face * hero.hand[0];
  const hy = hero.y + hero.hand[1];
  lights.add(hx, hy, 20, ABILITY_COLOR[a], 0.4, 0.2);
  game.fx.push(createGlint(hx, hy, ABILITY_COLOR[a]));
  sfx.cast();
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}
