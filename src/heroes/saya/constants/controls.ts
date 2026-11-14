import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { FOCUS_BAR } from "./focus";

/** how the Controls screen and the touch controller describe Saya, over the shared lines */
export const SAYA_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Draw cut, return cut, sheathe. Each cut stores damage in the foe, and the sheathe releases it all. Press the sheathe just as the return cut lands for a clean sheathe. In the air, a falling draw",
    warp: `Warp: throw the katana at the nearest foe ahead and arrive past it, then sheathe (${COST.warp} MP)`,
    guard: "Guard with the sheathed katana. Press just as a blow lands to parry with a counter draw",
    cast: "Cast the selected ability: Brushline or Moonrise. Each ends in a sheathe that releases stored cuts",
    castWide: "Wide form for half again the MP: Brushline cuts there and back, Moonrise rises on both sides",
    cycle: "Switch ability: Brushline and Moonrise",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: draw cut, return cut, sheathe; the sheathe releases the stored cuts. Hold: throw the katana and arrive past the foe (${COST.warp} MP)`,
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
    cycle: { label: "Ability", hint: "Switch ability: Brushline and Moonrise", accent: null },
  },
};
