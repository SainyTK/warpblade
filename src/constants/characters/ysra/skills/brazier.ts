import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * cost: Heat; every: seconds between shots; life: seconds it stands; ember: an ember's ability power multiple; burn:
 * seconds an ember sets its foe burning; aura: power of the burn on foes touching it (0 off); pierce: embers go on to
 * the foe behind; shots: embers per shot; burst: the burst when it burns out (0 off); altar: the evolved altar lets a
 * salamander out every this many seconds
 */
const levels = grow(
  { cost: 50, every: 0.7, life: 8, ember: 1.2, burn: 1.5, aura: 0, pierce: 0, shots: 1, burst: 0, altar: 0 },
  [
    ["A rite: a brazier that spits embers at foes.", { every: 0.9, life: 6, ember: 0.6 }],
    ["The brazier burns foes that touch it.", { aura: 0.5 }],
    ["Embers pierce.", { ember: 0.65, pierce: 1 }],
    ["Hotter embers, a longer fire.", { life: 10, ember: 0.75 }],
    ["Two embers each shot.", { ember: 0.8, shots: 2 }],
    ["Shoots faster.", { every: 0.5, ember: 0.85 }],
    ["The brazier bursts at the end.", { ember: 0.9, burst: 6 }],
    ["Far hotter embers that burn longer.", { ember: 1.8, burn: 2.5 }],
  ],
);

/** Brazier: a planted turret that spits embers on its own */
export const BRAZIER_SKILL: SkillDef = {
  id: "y_brazier",
  name: "Brazier",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A rite: spend Heat to plant a brazier that spits embers at foes. O picks the rite.",
  levels,
  evolution: {
    partner: "y_salamander",
    name: "Forge Altar",
    text: "An altar that stands 15 seconds, fires three embers a shot and lets out a salamander every 3 seconds.",
    row: evolved(levels, "A forge altar.", { life: 15, shots: 3, altar: 3 }),
  },
};
