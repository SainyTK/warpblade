import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { meleeHit } from "../../meleeHit";
import { hero } from "../../state";
import { boxAhead, newSwing } from "../../world";
import { warpSlash } from "../warp";

/** Kael's parry: a riposte cut at once at what struck him, this hard, and the next blow of his string is Keen */
const RIPOSTE = { power: 1.6, blows: 2, time: 1.2 } as const;

/** Kael's sword guard: a light block, and a parry that cuts straight back and primes his next blows */
export const KAEL_GUARD: GuardStyle = {
  chip: 0.2,
  blockCost: 14,
  parried(_fromX: number, _foe: Enemy | null) {
    newSwing();
    warpSlash();
    meleeHit([boxAhead(-4, -40, 30, 2)], { power: RIPOSTE.power, kx: 140, ky: -60, big: true, sureCrit: true });
    hero.keenNext = true;
    hero.riposte = Math.max(hero.riposte, RIPOSTE.time);
    hero.riposteBlows = Math.max(hero.riposteBlows, RIPOSTE.blows);
  },
};
