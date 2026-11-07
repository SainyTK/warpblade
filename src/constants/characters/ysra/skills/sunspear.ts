import type { SkillDef } from "../../../../types/skill";
import { ULT_CHARGE } from "../../kael";
import { evolved, grow } from "./rows";

/**
 * power: the charge level's power is multiplied by this; cooldown: seconds; line: seconds the spear's line burns
 * (0 off); both: a spear each way at every charge; pin: seconds struck foes are pinned (0 off), taking `taken` more;
 * rain: spears rain across the stage; fan: the evolution's spears a side; pillars: each end bursts as a Flame Pillar
 */
const levels = grow({ power: 1, cooldown: 20, line: 0, both: 0, pin: 0, taken: 0, rain: 0, fan: 1, pillars: 0 }, [
  ["U throws a burning spear down the line.", {}],
  ["The spear's line burns.", { line: 2 }],
  ["Throw both ways.", { both: 1 }],
  ["Harder, and back sooner.", { power: 1.6, cooldown: 17 }],
  ["The spear pins.", { pin: 2, taken: 0.3 }],
  ["Back sooner.", { cooldown: 14 }],
  ["Spears rain down.", { rain: 1 }],
  ["Much harder, back sooner.", { power: 3.2, cooldown: 12 }],
]);

/** Sunspear: a thrown spear down a line; aim it */
export const SUNSPEAR: SkillDef = {
  id: "y_sunspear",
  name: "Sunspear",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: `Your ultimate becomes a burning spear hurled the length of the stage, piercing every foe in the line. Grows with attack damage. ${ULT_CHARGE}`,
  ultimate: "sunspear",
  levels,
  evolution: {
    partner: "y_heft",
    name: "Solar Lance",
    text: "Three spears in a fan each way, every one ending in a pillar of fire; about fifteen times Pyre Wave a cast.",
    row: evolved(levels, "A fan of spears and pillars.", { power: 6, cooldown: 10, fan: 3, pillars: 1 }),
  },
};
