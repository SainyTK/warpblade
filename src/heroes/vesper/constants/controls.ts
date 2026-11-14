import type { HeroControls } from "../../../types/character";
import { ABILITY_COST } from "./abilities";

/** how the Controls screen and the touch controller describe Vesper, over the shared lines */
export const VESPER_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Twin blade string of four presses, two blows each, the same every time; in the air, four more. Every blow that lands adds Tempo, which makes you faster. Press again just as a blow lands for a Keen hit and more Tempo",
    warp: "Warp strike: throw the long blade at the nearest foe ahead, warp to it and cut a cross with both blades (10 MP)",
    guard:
      "Guard: hold to cross the blades against blows from the front. Press just as a blow lands to parry: the short blade turns it aside and your blows land as if from behind for a moment",
    cast: `Cast the selected ability: Twin Crescent (${ABILITY_COST.crescent} MP), Stitch (${ABILITY_COST.stitch} MP) or a spell you learn. Cast after a blow lands and the string goes on`,
    castWide: "Wide form for half again the MP: four crossing waves, a stitch that reaches farther and cuts more foes",
    cycle: "Switch ability: crescent, stitch and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: "Tap: twin blade string, on the floor or in the air; tap again just as a blow lands for a Keen hit. Hold: throw the long blade and warp to it (10 MP)",
      accent: "#b8a0ff",
    },
    guard: {
      label: "Guard",
      hint: "Hold to cross the blades against blows from the front. Tap just as a blow lands to parry and open the foes",
      accent: "#d4c8ff",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Ability", hint: "Switch ability: crescent, stitch and the spells you learn", accent: null },
  },
};
