import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { FOCUS_BAR } from "./focus";

/** how the Controls screen and the touch controller describe Saya, over the shared lines */
export const SAYA_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Katana combo of three blows: draw cut, return cut, sheathe. Each cut stores damage in the foe, and the sheathe releases it all. Press again just after a blow lands for a Keen hit; a Keen sheathe is a clean sheathe. In the air, a falling draw",
    warp: `Warp strike: throw the katana at the nearest foe ahead, warp past it and sheathe (${COST.warp} MP)`,
    guard:
      "Guard: hold to block blows from the front with the sheathed katana. Press just as a blow lands to parry with a counter draw",
    cast: "Cast the selected ability: Brushline, Moonrise or a spell you learn. Each ends in a sheathe that releases stored cuts",
    castWide: "Wide form for half again the MP: Brushline cuts there and back, Moonrise rises on both sides",
    cycle: "Switch ability: Brushline, Moonrise and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: katana combo of three blows, ending in a sheathe that releases the stored cuts; tap again just after a blow lands for a Keen hit. Hold: throw the katana and warp past the foe (${COST.warp} MP)`,
      accent: "#dfe5ff",
    },
    guard: {
      label: "Guard",
      hint: "Hold to block with the sheathed katana. Tap just as a blow lands to parry with a counter draw",
      accent: FOCUS_BAR.tint,
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Switch", hint: "Next ability: Brushline, Moonrise and the spells you learn", accent: null },
  },
};
