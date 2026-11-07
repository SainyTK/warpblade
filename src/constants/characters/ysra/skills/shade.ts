import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * chance: a landed blow calls a shade; cooldown: least seconds between calls; power: a thrust's attack damage
 * multiple; thrusts: thrusts a shade makes; stay: seconds it stays (0: it thrusts and fades); stagger: seconds a thrust
 * staggers; sides: shades called, one each side; host: the evolution's standing shades
 */
const levels = grow({ chance: 0.15, cooldown: 2, power: 0.8, thrusts: 1, stay: 0, stagger: 0, sides: 1, host: 0 }, [
  ["Your blows may call a shade that thrusts through the line.", {}],
  ["The shade thrusts twice.", { thrusts: 2 }],
  ["Shades come more often.", { chance: 0.2, cooldown: 1.5 }],
  ["Shade damage +12%.", { power: 0.9 }],
  ["The shade stays and fights.", { power: 0.95, thrusts: 3, stay: 2 }],
  ["Shade thrusts stagger.", { power: 1, stagger: 0.5 }],
  ["Two shades, back to back.", { power: 1.1, sides: 2 }],
  ["Shades come often and hit harder.", { chance: 0.35, power: 1.2 }],
]);

/** Glaive Shade: a spectral temple guard steps out behind her and thrusts through the line */
export const GLAIVE_SHADE: SkillDef = {
  id: "y_shade",
  name: "Glaive Shade",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A landed blow may call the shade of a temple guard that thrusts its glaive through the line ahead.",
  levels,
  evolution: {
    partner: "y_windmill",
    name: "Temple Host",
    text: "Three shades stand behind you for good and thrust in a fan whenever you land a blow.",
    row: evolved(levels, "Three shades stand with you.", { host: 3, cooldown: 0.4 }),
  },
};
