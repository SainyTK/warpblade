import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the hook's attack damage multiple; stun: seconds a hooked foe is stunned; cone: hooks every flyer over her;
 * slam: the floor slam's power (0 off); ground: seconds a hooked flyer cannot fly; reach: pixels above her it reaches
 * (0 for the sky thrust's own); rise: pixels she rises with it; heap: pixels the evolved hook gathers flyers from;
 * heapPower: the heap slam's power
 */
const levels = grow({ power: 1.2, stun: 0, cone: 0, slam: 0, ground: 0, reach: 0, rise: 0, heap: 0 }, [
  ["A foe overhead is hooked down to the floor.", { power: 2, stun: 0.8 }],
  ["A harder hook and a longer stun.", { power: 2.8, stun: 1.2 }],
  ["Hooks every flyer above you.", { power: 3.5, cone: 1 }],
  ["Hooked foes slam into the floor.", { power: 4.2, slam: 3 }],
  ["Hooked flyers cannot fly for a while.", { power: 5, slam: 4, ground: 4 }],
  ["Hook damage +20%.", { power: 6, slam: 5 }],
  ["Reaches higher and lifts you with it.", { power: 7.5, slam: 6.5, reach: 70, rise: 20 }],
  ["Hook and slam much harder.", { power: 9, slam: 9 }],
]);

/** Skyhook: her answer to flyers; the sky thrust hooks them down where the glaive reaches */
export const SKYHOOK: SkillDef = {
  id: "y_skyhook",
  name: "Skyhook",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "When a foe hovers overhead, the sky thrust hooks it down to the floor.",
  levels,
  evolution: {
    partner: "y_vault",
    name: "Heaven's Hook",
    text: "Every flyer near you is hooked into one heap at your feet and slammed, and the vault recharges at once.",
    row: evolved(levels, "Hook every flyer into a heap.", { heap: 100, heapPower: 12 }),
  },
};
