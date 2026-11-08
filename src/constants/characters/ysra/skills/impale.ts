import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the impale's attack damage multiple; pin: seconds struck foes are pinned; taken: the damage a pinned foe takes
 * more; ignite: seconds it sets them burning; past: pixels the point bursts past the tip; burst: a pinned foe that
 * falls bursts for this; twist: the second hit's share (0 off); stakes: pixels of the evolution's row of stakes
 */
const levels = grow({ power: 2.3, pin: 0, taken: 0, ignite: 0, past: 0, burst: 0, twist: 0, stakes: 0 }, [
  ["The last blow pins foes, and pinned foes take more damage.", { power: 4, pin: 1, taken: 0.25 }],
  ["Pins hurt more and set foes burning.", { power: 4.8, taken: 0.4, ignite: 2 }],
  ["The impale bursts past its tip; pins last longer.", { power: 5.5, pin: 1.5, past: 24 }],
  ["Impale damage +25%.", { power: 7 }],
  ["Pinned foes burst when they fall.", { power: 8.5, burst: 2 }],
  ["Pins last longer and hurt more.", { power: 10, pin: 2, taken: 0.7 }],
  ["The impale strikes twice.", { power: 12, twist: 0.5 }],
  ["Impale damage up; pinned foes take double.", { power: 20, taken: 1 }],
]);

/** Impale: the string's last blow pins foes, and pinned foes take more from everything */
export const IMPALE: SkillDef = {
  id: "y_impale",
  name: "Impale",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The last blow of the string pins foes to the floor, and pinned foes take more damage.",
  levels,
  evolution: {
    partner: "y_skyhook",
    name: "Pillory",
    text: "The impale drives a row of burning stakes ahead: every foe in it is pinned 3 seconds, and pinned foes burst harder when they fall.",
    row: evolved(levels, "A row of burning stakes.", { power: 24, pin: 3, burst: 4, stakes: 80 }),
  },
};
