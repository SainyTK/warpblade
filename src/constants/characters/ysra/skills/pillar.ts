import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * cost: Heat; power: the pillar's ability power multiple; pull: pixels the sigil draws foes in from (0 off); width:
 * the pillar's width as a share of the base; column: the burning column's power (0 off); heal: share of max HP a cast
 * heals; count: pillars a cast; colonnade: the evolved flank pillars
 */
const levels = grow({ cost: 40, power: 5.5, pull: 0, width: 1, column: 0, heal: 0, count: 1, colonnade: 0 }, [
  ["A rite: a pillar of fire under the foe ahead.", { power: 6 }],
  ["Costs less Heat; the sigil draws foes in.", { cost: 32, power: 7, pull: 12 }],
  ["A wider pillar.", { power: 8, width: 1.6 }],
  ["Pillar damage +35%.", { power: 11 }],
  ["The pillar keeps burning.", { power: 13, column: 2 }],
  ["Cheaper, and it heals you.", { cost: 26, power: 15, heal: 0.03 }],
  ["Two pillars.", { power: 18, count: 2 }],
  ["Pillar damage +20%.", { power: 22 }],
]);

/** Flame Pillar: a rite that bursts a pillar under the foe ahead; aim matters */
export const FLAME_PILLAR_SKILL: SkillDef = {
  id: "y_pillar",
  name: "Flame Pillar",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A rite: spend Heat to burst a pillar of fire under the nearest foe ahead and throw it up. O picks the rite.",
  levels,
  evolution: {
    partner: "y_kindling",
    name: "Pyre Colonnade",
    text: "Each pillar burns hotter, and two more burst up on either side of it a moment later.",
    row: evolved(levels, "Pillars burst in threes.", { power: 26, colonnade: 1 }),
  },
};
