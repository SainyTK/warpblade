import type { HeroControls } from "../../../types/character";
import { BRYNN_ACCENT } from "./colors";

/** how the Controls screen and the touch controller describe Brynn, over the shared lines */
export const BRYNN_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Greatsword combo of three heavy blows: a wide sweep, a heave that throws foes up, and a slam with a shockwave. Press again just after a blow lands for a heavy swing. In the air, a falling slam",
    warp: "Warp: throw the greatsword spinning at the nearest foe ahead, land beside it with a chop and a shock ring (10 MP)",
    guard:
      "Guard on the flat of the blade: a strong block that costs a lot of stamina. Press just as a blow lands to parry with a Counter Cleave",
    cast: "Cast the selected ability: Rend, Quake or a spell you learn. Once a blow of the combo lands, it goes at once and the combo carries on",
    castWide: "Wide form for half again the MP: Rend both ways, a wider Quake with an aftershock",
    cycle: "Switch ability: Rend, Quake and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: "Tap: greatsword combo of three heavy blows; tap again just after a blow lands for a heavy swing. Hold: throw the greatsword and warp to it (10 MP)",
      accent: BRYNN_ACCENT,
    },
    guard: {
      label: "Guard",
      hint: "Hold to block on the flat of the blade. Tap just as a blow lands to parry with a Counter Cleave",
      accent: "#ffc2ae",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; once a blow of the combo lands it goes at once. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Ability", hint: "Switch ability: Rend, Quake and the spells you learn", accent: null },
  },
};
