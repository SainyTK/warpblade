import { RIPOSTE } from "../../../constants/kael/guard";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { meleeHit } from "../../meleeHit";
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
    hero.riposte = Math.max(hero.riposte, RIPOSTE.time);
    hero.riposteBlows = Math.max(hero.riposteBlows, RIPOSTE.blows);
    aegisParried(foe);
    openCounter(foe);
  },
};
