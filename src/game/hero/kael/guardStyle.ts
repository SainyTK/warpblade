import { RIPOSTE } from "../../../constants/kael/guard";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { meleeHit } from "../../meleeHit";
import { skillValues, withCharms } from "../../skills/query";
import { hero } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { warpSlash } from "../warp";
import { aegisBlockCost, aegisBlocked, aegisChip, aegisParried } from "./aegis";
import { openCounter } from "./counter";

/** Kael's sword guard: a light block that Crystal Aegis hardens, and a parry that cuts straight back, primes his next
 *  blows and opens a counter: J tapped in the next moment blinks him to the attacker's back */
export const KAEL_GUARD: GuardStyle = {
  get chip() {
    return aegisChip();
  },
  get blockCost() {
    return aegisBlockCost();
  },
  blocked(_fromX: number, foe: Enemy | null) {
    aegisBlocked(foe);
  },
  parried(_fromX: number, foe: Enemy | null) {
    newSwing();
    warpSlash();
    meleeHit([boxAhead(-4, -40, 30, 2)], { power: RIPOSTE.power, kx: 140, ky: -60, big: true, sureCrit: true });
    hero.keenNext = true;
    // Mirror Knight's Riposte, when held, can last longer and cover more blows than the parry's own
    const mirror = skillValues("k_mirror");
    hero.riposte = Math.max(hero.riposte, RIPOSTE.time, mirror.ripTime ? withCharms("duration", mirror.ripTime) : 0);
    hero.riposteBlows = Math.max(hero.riposteBlows, RIPOSTE.blows, mirror.ripBlows ?? 0);
    aegisParried(foe);
    openCounter(foe);
  },
};
