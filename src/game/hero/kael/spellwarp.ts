import { ARCANE_SHARE, SPELLWARP_SPARKS } from "../../../constants/kael/spellwarp";
import { ABILITY_COLOR } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import type { KaelAbility } from "../../../types/spell";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { ignite } from "../../enemies/burn";
import { enemyCenter } from "../../enemies/enemy";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { selectedSlot } from "../abilityBar";
import { isFree } from "../actions";
import { castFree, knowsAbility } from "../spell";
import { kael } from "./state";

const SKILL = "k_spellwarp";

/** the ability selected on I, as Kael's own id, when he knows it */
function selectedAbility(): KaelAbility | null {
  const id = selectedSlot()?.id as KaelAbility | undefined;
  return id && knowsAbility(id) ? id : null;
}

/** the element strikes one foe: its damage, and its status (fire burns, ice slows, lightning shocks, crystal only cuts) */
function strikeWith(a: KaelAbility, e: Enemy, damage: number, v: Readonly<Record<string, number>>): void {
  const [ex, ey] = enemyCenter(e);
  dealDamage(e, damage, { fromX: hero.x, kx: hero.face * 40, ky: -30, source: "abilities" });
  game.fx.push(createImpact(ex, ey, hero.face, false, SPELLWARP_SPARKS[a]));
  if (a === "fire") ignite(e, withCharms("duration", v.burn));
  if (a === "ice") e.chill = Math.max(e.chill, withCharms("duration", v.chill));
  if (a === "volt") e.shock = Math.max(e.shock, withCharms("duration", v.shock));
}

/**
 * A warp arrival with Spellwarp: the selected ability's element strikes the foe (and from its fourth level the foes
 * beside it), the Spellblade window opens, the ability's recharge runs down, and as Arcane Arrival the ability itself
 * goes off for free now and then.
 */
export function spellwarpArrived(foe: Enemy | null): void {
  if (!skillLevel(SKILL)) return;
  const v = skillValues(SKILL);
  const a = selectedAbility();
  if (v.window) kael.spellwarp = withCharms("duration", v.window);
  if (!a) return;
  if (foe) {
    const [fx, fy] = enemyCenter(foe);
    lights.add(fx, fy, 30, ABILITY_COLOR[a], 0.7, 0.25);
    const reach = v.reach ? withCharms("area", v.reach) : 0;
    const damage = progress.stats.ap * v.power;
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      if (e !== foe && Math.hypot(enemyCenter(e)[0] - fx, enemyCenter(e)[1] - fy) > reach) continue;
      strikeWith(a, e, damage, v);
    }
  }
  if (v.refund) hero.spellCd[a] = Math.max(0, hero.spellCd[a] - v.refund);
  if (!skillEvolved(SKILL) || kael.arcaneCd > 0) return;
  kael.arcaneCd = withCharms("cooldown", v.arcaneEvery);
  castFree(a, ARCANE_SHARE);
}

/** a cast now is a Spellblade cast: just after a warp arrival with Spellwarp, out of the arrival blow or free */
export const spellwarpOpen = (): boolean => kael.spellwarp > 0 && (hero.state === "warpStrike" || isFree());

/** the share of a cast's MP a Spellblade cast out of a warp pays */
export const spellwarpCostShare = (): number => skillValues(SKILL).half ?? 1;
