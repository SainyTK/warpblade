import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "His warp leaves him veiled 0.3 s longer.",
    values: { breath: 0.3, refund: 0, path: 0, charges: 1, ambush: 0, blind: 0, phantom: 0 },
  },
  { text: "A warp gives 8 Gloam back.", values: { refund: 8 } },
  { text: "The thrown knife cuts foes it passes, 0.5x.", values: { path: 0.5 } },
  { text: "Two warps in a row.", values: { charges: 2 } },
  { text: "The veil after a warp primes an Ambush.", values: { ambush: 1 } },
  { text: "Arriving blinds near minions 1 s.", values: { blind: 1 } },
  { text: "The knife cuts for 0.8x; veiled 0.6 s longer.", values: { path: 0.8, breath: 0.6 } },
  { text: "Three warps in a row.", values: { charges: 3 } },
]);

/** Quiet Step. Design: docs/skills/tallis.md. Values: breath: seconds more he stays veiled after a warp; refund: Gloam a warp gives; path: attack damage foes the thrown knife passes through take; charges: warps in a row before the recharge; ambush: 1 the veil after a warp primes an Ambush; blind: seconds the arrival blinds minions within 40 px; phantom: 1 the arrival leaves a cloud of smoke (evolution) */
export const QUIET_STEP: SkillDef = {
  id: "t_quietStep",
  name: "Quiet Step",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "His warp steps out of the foe's shadow quieter: veiled longer, more often, and cutting on the way.",
  levels: LEVELS,
  evolution: {
    partner: "t_nightLeap",
    name: "Phantom Step",
    text: "Every warp leaves a cloud of smoke where he steps out, hiding him and blinding the minions in it.",
    row: evolvedRow(LEVELS[7], "A warp leaves a cloud of smoke.", { phantom: 1 }),
  },
};
