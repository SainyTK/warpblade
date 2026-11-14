import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { BRYNN_ACCENT } from "./colors";

/** how the Controls screen and the touch controller describe Brynn, over the shared lines */
export const BRYNN_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Greatsword combo of three blows: a wide sweep, a heave that throws foes up, and a slam with a shockwave. Press again just after a blow lands for a Keen hit that swings wider with a crescent. In the air, a falling slam",
    warp: `Warp strike: throw the greatsword spinning at the nearest foe ahead, warp to it and land with a chop and a shock ring (${COST.warp} MP)`,
    guard:
      "Guard: hold to block blows from the front on the flat of the blade, a strong block that costs a lot of stamina. Press just as a blow lands to parry with a Counter Cleave",
    cast: "Cast the selected ability: Rend, Quake or a spell you learn. Just after a blow lands it goes at once and the combo carries on",
    castWide: "Wide form for half again the MP: Rend both ways, a wider Quake with an aftershock",
    cycle: "Switch ability: Rend, Quake and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: greatsword combo of three blows; tap again just after a blow lands for a Keen hit. Hold: throw the greatsword and warp to it (${COST.warp} MP)`,
      accent: BRYNN_ACCENT,
    },
    guard: {
      label: "Guard",
      hint: "Hold to block on the flat of the blade. Tap just as a blow lands to parry with a Counter Cleave",
      accent: "#ffc2ae",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; just after a blow lands it goes at once. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Switch", hint: "Next ability: Rend, Quake and the spells you learn", accent: null },
  },
};
