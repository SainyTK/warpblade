import { usesDrill } from "../../../drill";
import { feat } from "../../../game/feat";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { STAT } from "../constants/achievements";
import { GUARD, STUN_BASH, VALOR } from "../constants/kit";
import { shieldBlow } from "./bash";
import { aldric } from "./state";
import { gainValor } from "./valor";
import { fortressLance } from "./vow";

/** what a block gives with his skills: MP with Resolve, HP with Iron Vow, a lance back as Iron Fortress */
function blockGifts(foe: Enemy | null): void {
  const mp = skillValues("al_resolve").mp ?? 0;
  hero.mp = Math.min(progress.stats.mp, hero.mp + mp);
  const heal = skillValues("al_vow").heal ?? 0;
  hero.hp = Math.min(progress.stats.hp, hero.hp + heal);
  if (foe && skillEvolved("al_vow")) fortressLance(foe);
}

/** stamina one block costs: the guard's own, cheaper with Iron Vow */
const blockCost = (): number => GUARD.blockCost * (1 - (usesDrill() ? 0 : (skillValues("al_vow").cost ?? 0)));

/**
 * Aldric's shield: it lets nothing through and costs the least stamina in the roster. Each block fills Valor and opens
 * the moment for a Counterbash; a parry throws the shield out into a Stun bash that knocks the attacker down. On the
 * drill a block's skill gifts come from the drill levels instead.
 */
export const ALDRIC_GUARD: GuardStyle = {
  chip: GUARD.chip,
  get blockCost() {
    return blockCost();
  },
  blocked(_fromX: number, _foe: Enemy | null) {
    aldric.sinceBlock = 0;
    gainValor(VALOR.block);
    feat({ kind: "heroCount", stat: STAT.blocks, add: 1 });
    if (!usesDrill()) blockGifts(_foe);
  },
  parried(_fromX: number, _foe: Enemy | null) {
    shieldBlow({ power: STUN_BASH.power, kx: STUN_BASH.kx, ky: -30, stun: STUN_BASH.stun, big: true });
    gainValor(VALOR.parry);
  },
};
