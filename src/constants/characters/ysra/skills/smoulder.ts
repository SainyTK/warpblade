import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * stacks: Smoulder stacks a rite lays on each foe it strikes; perSecond: a stack's ability power per second; duration:
 * seconds stacks last; max: stacks a foe carries; heat: Heat for each smouldering foe a glaive blow strikes (0 off);
 * blow: stacks a glaive blow adds to a smouldering foe (0 off); warp: stacks the warp lays on the foe it was aimed at
 * (0 off); taken: the damage a foe at full stacks takes more (0 off); burst: the evolution's ability power per stack set
 * off by a rite
 */
const levels = grow({ stacks: 1, perSecond: 0.8, duration: 4, max: 4, heat: 0, blow: 0, warp: 0, taken: 0 }, [
  ["Rites lay Smoulder on every foe they strike.", {}],
  ["Rites lay two stacks.", { stacks: 2 }],
  ["Blows on a smouldering foe build more Heat.", { perSecond: 0.85, heat: 3 }],
  ["Smoulder +25%.", { perSecond: 1.05 }],
  ["Glaive blows feed the Smoulder they strike.", { blow: 1 }],
  ["The warp lays Smoulder; stacks to 8.", { warp: 2, max: 8, duration: 6 }],
  ["A foe at full stacks takes more damage.", { taken: 0.15 }],
  ["Far hotter Smoulder.", { perSecond: 1.2 }],
]);

/** Smoulder: her rites leave the foes they strike smouldering, and her blows keep the fire fed */
export const SMOULDER: SkillDef = {
  id: "y_smoulder",
  name: "Smoulder",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Your rites leave every foe they strike smouldering. Smoulder stacks.",
  levels,
  evolution: {
    partner: "y_brazier",
    name: "Ashfall",
    text: "Each rite sets off the Smoulder on the foes it strikes, every stack bursting at once, then lays it fresh.",
    row: evolved(levels, "Rites set your Smoulder off.", { burst: 3 }),
  },
};
