import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * after: seconds of walking one way before the charge; shoulder: attack damage
 * multiple of a shoulder; launch: shoulders throw minions up; elites: bigger foes stagger and let her through; impale
 * and impale2: the running impale's two blows; block: blows from the front are blocked; knock: seconds a shoulder
 * knocks down; bowl: the carried foe's damage to those it hits (0 off); gather: the evolved charge carries every
 * minion, slammed for slam
 */
const levels = grow(
  { after: 0.6, shoulder: 0.35, launch: 0, elites: 0, impale: 1.7, impale2: 0.9, block: 0, knock: 0, bowl: 0 },
  [
    ["Keep walking to charge; J while charging impales.", {}],
    ["Charge sooner, shoulder harder.", { after: 0.4, shoulder: 0.4 }],
    ["Shoulder harder, through bigger foes.", { shoulder: 0.6, launch: 1, elites: 1 }],
    ["Running impale +10%.", { impale: 1.9, impale2: 1 }],
    ["Your charge blocks blows from the front.", { block: 1 }],
    ["Shoulders knock foes down.", { shoulder: 0.8, knock: 0.6 }],
    ["The impale bowls foes over.", { impale: 2, impale2: 1.1, bowl: 0.8 }],
    ["Harder shoulders and impale.", { shoulder: 1, impale: 2.2, impale2: 1.2 }],
  ],
);

/** Warpath: her steady stride builds into a charge on its own */
export const WARPATH: SkillDef = {
  id: "y_warpath",
  name: "Warpath",
  kind: "movement",
  risk: "easy",
  button: "auto",
  text: "Walk one way for a moment and you charge, shouldering small foes aside. J while charging is a running impale.",
  levels,
  evolution: {
    partner: "y_impale",
    name: "Juggernaut",
    text: "The charge gathers every small foe it meets on the glaive, and J or the end of the charge slams them all down pinned.",
    row: evolved(levels, "Carry the crowd and slam it.", { gather: 1, slam: 8 }),
  },
};
