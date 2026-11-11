import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * passes: blows of the spin; power: each pass's attack damage multiple; pull: pixels foes are drawn in from; stagger:
 * seconds a pass staggers; ring: the closing ring's ability power multiple (0 off); embers: each pass's flung ember
 * (0 off); wheel: seconds the evolved wheel spins on; scorch: stacks a pass lays
 */
const levels = grow({ passes: 4, power: 0.2, pull: 20, stagger: 0, ring: 0, embers: 0 }, [
  ["The string's middle blow becomes a windmill that draws foes in.", {}],
  ["One more pass.", { passes: 5, power: 0.22 }],
  ["Draws from farther away and staggers foes.", { power: 0.25, pull: 40, stagger: 0.5 }],
  ["Windmill damage +20%.", { power: 0.3 }],
  ["The windmill ends in a ring of fire.", { ring: 1.5 }],
  ["Each pass throws an ember.", { power: 0.33, embers: 0.15 }],
  ["Draws from farther still.", { power: 0.36, pull: 60 }],
  ["Windmill damage +10%, a hotter ring.", { power: 0.4, ring: 2, embers: 0.2 }],
]);

/** Windmill: the string's middle blow becomes a spinning windmill that draws the crowd in */
export const WINDMILL: SkillDef = {
  id: "y_windmill",
  name: "Windmill",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The string's middle blow becomes a windmill that hits both ways and draws foes in.",
  levels,
  evolution: {
    partner: "y_searing",
    name: "Fire Wheel",
    text: "The windmill keeps spinning as you walk, draws from far away and scorches every foe it passes.",
    row: evolved(levels, "A wheel of fire that keeps spinning.", { wheel: 1.5, pull: 70, scorch: 1 }),
  },
};
