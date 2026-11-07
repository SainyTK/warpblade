import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * life: seconds a patch burns; tick: its ability power multiple each 0.4 s; lunge: lunges and charges lay patches
 * too; halfWidth: a patch's half width in pixels; overlap: patches burning one foe at once; ring: pixels of the fire
 * ring a landing lays (0 off); slow: share foes in the fire are slowed; erupt: the evolution's eruption per patch
 */
const levels = grow({ life: 3, tick: 0.45, lunge: 0, halfWidth: 5, overlap: 1, ring: 0, slow: 0 }, [
  ["Your vaults and dives leave burning ground.", {}],
  ["Lunges and charges burn the floor too.", { tick: 0.5, lunge: 1 }],
  ["The fire lasts longer and spreads wider.", { life: 4, tick: 0.6, halfWidth: 7 }],
  ["Fire damage +33%.", { tick: 0.8 }],
  ["Fire on fire burns twice.", { tick: 1, overlap: 2 }],
  ["Landings ring the floor with fire.", { tick: 1.2, ring: 40 }],
  ["Hotter fire that slows.", { tick: 1.5, slow: 0.3 }],
  ["Hotter, longer fire.", { tick: 1.8, life: 5 }],
]);

/** Ashen Wake: her path burns; she has to travel through and over the crowd */
export const ASHEN_WAKE_SKILL: SkillDef = {
  id: "y_ashen",
  name: "Ashen Wake",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Vaults and dives leave burning ground behind you.",
  levels,
  evolution: {
    partner: "y_dive",
    name: "Scorched Earth",
    text: "A vault or dive landing sets off every patch of fire you have laid, each erupting in a small pillar.",
    row: evolved(levels, "Landings set your fire off.", { erupt: 5 }),
  },
};
