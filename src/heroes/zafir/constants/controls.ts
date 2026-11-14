import type { HeroControls } from "../../../types/character";
import { ZAFIR_ACCENT } from "./palette";

/** how the Controls screen and the touch controller describe Zafir, over the shared lines */
export const ZAFIR_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Four spins that cut in front and behind, the same every time. Walk while you spin. The last spin throws foes up. In the air, a spinning descent. While the scimitar is thrown, call it back into a cut",
    warp: "Warp strike: throw the scimitar at the nearest foe ahead, warp to it and arrive spinning, cutting both sides (10 MP)",
    guard:
      "Guard: hold to raise a veil of sand against blows from the front. Press just as a blow lands to parry: you slip away and leave a mirage that bursts into sand blades",
    cast: "Cast the selected ability: Sandspout, the crescent throw or a spell you learn. During the string it goes at once and the string carries on",
    castWide: "Wide form for half again the MP: a sandspout each way, the scimitar circling you, a wider spell",
    cycle: "Switch ability: Sandspout, the crescent throw and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: "Tap: four spins that cut both sides; walk while you spin. Tap while the scimitar is thrown to call it back. Hold: throw the scimitar and warp to it (10 MP)",
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
      label: "Ability",
      hint: "Switch ability: Sandspout, the crescent throw and the spells you learn",
      accent: null,
    },
  },
};
