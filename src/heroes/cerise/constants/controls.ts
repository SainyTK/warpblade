import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { ABILITY_COST } from "./abilities";
import { CERISE_BLOCK, RIPOSTE } from "./guard";
import { POINTS } from "./points";

/** how the Controls screen and the touch controller describe Cerise, over the shared lines */
export const CERISE_CONTROLS: HeroControls = {
  actions: {
    attack: `Rapier combo of five blows, ending in a lunge that spends every Point. Press again just after a blow lands for a Keen hit and a Point. Just after a riposte lands, the next riposte`,
    warp: `Warp strike: throw the rapier at the nearest foe ahead, warp to it and thrust. The foe is marked: your blows hit it harder (${COST.warp} MP)`,
    guard: `Guard: hold to block blows from the front; ${Math.round(CERISE_BLOCK.chip * 100)}% gets through. Press just as a blow lands to parry: a riposte at once, and up to ${RIPOSTE.links - 1} more on the beat`,
    cast: `Cast the selected ability: Flurry (${ABILITY_COST.flurry} MP), Rose Line (${ABILITY_COST.line} MP) or a spell you learn. Each spends up to two Points for power`,
    castWide: "Wide form for half again the MP: a taller Flurry, a Rose Line both ways, a wider spell",
    cycle: "Switch ability: Flurry, Rose Line and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: rapier combo of five blows; tap again just after a blow lands for a Keen hit and a Point (${POINTS.most} at most), or just after a riposte for the next one. Hold: throw the rapier and warp to it (${COST.warp} MP)`,
      accent: "#ff8fb0",
    },
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry: a riposte at once, then Attack on the beat for more",
      accent: "#ffc2d6",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Switch", hint: "Next ability: Flurry, Rose Line and the spells you learn", accent: null },
  },
};
