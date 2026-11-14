import { feat } from "../../../game/feat";
import { skillValues } from "../../../game/skills/query";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { STAT } from "../constants/achievements";
import { GUARD, STUN_BASH, VALOR } from "../constants/kit";
import { shieldBlow } from "./bash";
import { aldric } from "./state";
import { gainValor } from "./valor";

/** stamina one block costs: the guard's own, cheaper with Iron Vow */
const blockCost = (): number => GUARD.blockCost * (1 - (skillValues("al_vow").cost ?? 0));

/**
 * Aldric's shield: it lets nothing through and costs the least stamina in the roster. Each block fills Valor and opens
 * the moment for a Counterbash; a parry throws the shield out into a Stun bash that knocks the attacker down.
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
  },
  parried(_fromX: number, _foe: Enemy | null) {
    shieldBlow({ power: STUN_BASH.power, kx: STUN_BASH.kx, ky: -30, stun: STUN_BASH.stun, big: true });
    gainValor(VALOR.parry);
  },
};
