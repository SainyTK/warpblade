import type { HeroControls } from "../../../types/character";
import { ABILITY_COST } from "./abilities";
import { DAWN_CSS } from "./light";

/** how the Controls screen and the touch controller describe Aldric, over the shared lines */
export const ALDRIC_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Sword and shield combo of three hits: a cut, a shield bash and an overhead that knocks down. With Guard held, a shield bash that keeps the guard up; just after a block it is a Counterbash",
    warp: "Warp strike: throw the sword at the nearest foe ahead and arrive shield first behind a barrier that takes the next blow (10 MP)",
    guard:
      "Guard: hold to block every blow from the front, and walk slowly behind the shield. Press just as a blow lands to parry with a stun bash",
    cast: `Cast the selected ability: Shield Rush (${ABILITY_COST.rush} MP), Sunpillar (${ABILITY_COST.pillar} MP) or a spell you learn. Mid-combo it goes off at once`,
    castWide: "Wide form for half again the MP: a rush that ends in a burst of light, three pillars in a row",
    cycle: "Switch ability: rush, pillar and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: "Tap: combo of three hits; with Guard held, a shield bash. Hold: throw the sword and warp to it shield first (10 MP)",
      accent: DAWN_CSS,
    },
    guard: {
      label: "Guard",
      hint: "Hold to block every blow from the front and walk behind the shield. Tap just as a blow lands to parry with a stun bash",
      accent: "#fff3c0",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form",
      accent: null,
    },
    cycle: { label: "Ability", hint: "Switch ability: rush, pillar and the spells you learn", accent: null },
  },
};
