import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the impact's attack damage multiple; reach: pixels it hits to each side; spring: pixels she springs up out of
 * it (0 off); pull: pixels foes are drawn in from (0 off); dives: dives per airtime; skewer: the point's power on the
 * way down; burn: seconds the point sets foes burning; launch: the impact throws foes high; ring: the impact's ring of
 * fire, in ability power (0 off); phoenix: the evolved burning phoenix, flooding the floor for flood seconds
 */
const levels = grow(
  { power: 1.5, reach: 30, spring: 0, pull: 0, dives: 1, skewer: 0.75, burn: 0, launch: 0, ring: 0 },
  [
    ["The dive hits harder and wider.", { power: 2, reach: 36 }],
    ["Spring out of the impact.", { power: 2.2, spring: 24 }],
    ["The impact draws foes in.", { power: 2.5, pull: 50 }],
    ["Impact damage +12%.", { power: 2.8 }],
    ["Dive twice before you land.", { power: 3, dives: 2 }],
    ["The dive's line burns.", { power: 3.3, skewer: 1, burn: 2 }],
    ["The impact launches and burns.", { power: 3.6, launch: 1, ring: 1 }],
    ["Impact damage +11%, a hotter ring.", { power: 4, ring: 1.2 }],
  ],
);

/** Falling Star: the dive becomes a weapon, with a pull, a second drop and a burning line */
export const FALLING_STAR: SkillDef = {
  id: "y_dive",
  name: "Falling Star",
  kind: "movement",
  risk: "timed",
  button: "I",
  text: "Your dive, the vault on I in the air, strikes harder and wider where it lands.",
  levels,
  evolution: {
    partner: "y_hawk",
    name: "Phoenix Dive",
    text: "You dive as a burning phoenix: a huge blast that floods the floor with fire, three dives before you land.",
    row: evolved(levels, "Dive as a phoenix.", { power: 9, reach: 70, dives: 3, phoenix: 1, flood: 3 }),
  },
};
