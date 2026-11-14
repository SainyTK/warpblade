import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { game, hero } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { TURN_ASIDE, VESPER_BLOCK } from "../constants/guard";
import { TEMPO } from "../constants/tempo";
import { NIGHT_RAMP } from "../look/colors";
import { blockSkills, parrySkills } from "./skills/guardSkills";
import { vesperSound } from "./sound";
import { vesper } from "./state";
import { gainTempo } from "./tempo";

/** the short blade's arc as it turns a blow aside */
const TURN_SLASH = {
  cx: 8,
  cy: -18,
  R: 15,
  sy: 0.6,
  rot: 0.4,
  a0: -2,
  a1: 1.2,
  W: 5,
  hold: 0.04,
  trail: 0.2,
  ramp: NIGHT_RAMP,
};

/** the turn aside: the short blade cuts the attacker at once, a sure crit, and opens every foe for a moment */
function turnAside(foe: Enemy | null): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, TURN_SLASH));
  meleeHit([boxAhead(-4, -38, 26, 2)], { power: TURN_ASIDE.power, kx: 60, ky: -40, big: true, sureCrit: true });
  vesperSound.turn();
  vesper.opened = TURN_ASIDE.open;
  gainTempo(TEMPO.parry);
  parrySkills(foe);
}

/** Vesper's crossed blades: an average block, and a parry where the short blade turns the blow aside and opens the foes,
 *  so for a moment every blow of hers lands as if from behind and breaks guards */
export const VESPER_GUARD: GuardStyle = {
  chip: VESPER_BLOCK.chip,
  blockCost: VESPER_BLOCK.cost,
  blocked: () => blockSkills(),
  parried: (_fromX, foe) => turnAside(foe),
};
