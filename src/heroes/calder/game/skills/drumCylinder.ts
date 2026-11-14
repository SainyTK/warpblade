import { skillValues } from "../../../../game/skills/query";
import { rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { OwnHit } from "../../../../types/kit";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { chamberSize, loadRounds } from "../chamber";
import { calder } from "../state";

const SKILL = "ca_drum";

/** Drum Cylinder's sixth level: sword blows hit harder while the chamber is full */
export function drumBonus(_e: Enemy, hit: OwnHit): number {
  const full = skillValues(SKILL).full;
  return full && hit.melee && calder.rounds >= chamberSize() ? full : 0;
}

/** Drum Cylinder: a kill may load a round from level 4 */
export const drumCylinder: SkillBehavior = {
  create: () => ({}),
  on: {
    kill() {
      const chance = skillValues(SKILL).killLoad;
      if (chance && rng.chance(chance)) loadRounds(1);
    },
  },
};
