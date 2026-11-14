import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { ZAFIR_ACCENT } from "./palette";

/** how the Controls screen and the touch controller describe Zafir, over the shared lines */
export const ZAFIR_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Scimitar combo of four spins that cut in front and behind; walk while you spin. The last throws foes up. Press again just after a blow lands for a Keen hit. In the air, a spinning descent. While the scimitar flies, call it back",
    warp: `Warp strike: throw the scimitar at the nearest foe ahead, warp to it and arrive spinning, cutting both sides (${COST.warp} MP)`,
    guard:
      "Guard: hold to raise a veil of sand against blows from the front. Press just as a blow lands to parry: you slip away and leave a mirage that bursts into sand blades",
    cast: "Cast the selected ability: Sandspout, the crescent throw or a spell you learn. Just after a blow lands it goes at once and the combo carries on",
    castWide: "Wide form for half again the MP: a sandspout each way, the scimitar circling you, a wider spell",
    cycle: "Switch ability: Sandspout, the crescent throw and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: scimitar combo of four spins that cut both sides; walk while you spin, and tap again just after a blow lands for a Keen hit. Tap while the scimitar is thrown to call it back. Hold: throw the scimitar and warp to it (${COST.warp} MP)`,
      accent: ZAFIR_ACCENT,
    },
    guard: {
      label: "Guard",
      hint: "Hold to raise a veil of sand. Tap just as a blow lands to parry and leave a mirage that bursts",
      accent: "#ffe4a0",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: {
      label: "Switch",
      hint: "Next ability: Sandspout, the crescent throw and the spells you learn",
      accent: null,
    },
  },
};
