import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { ABILITY_TINT } from "./abilities";
import { SPIRIT } from "./swords";

/** how the Controls screen and the touch controller describe Yun, over the shared lines */
export const YUN_CONTROLS: HeroControls = {
  actions: {
    attack: `Jian combo of four flowing blows, the same every time. Press again just after a blow lands for a Keen hit. Each spirit sword you hold repeats every blow as a thrust ahead. The last blow gives a spirit sword (up to ${SPIRIT.most})`,
    warp: `Warp strike: throw the jian at the nearest foe ahead and ride it in; your spirit swords strike it as you land (${COST.warp} MP)`,
    guard:
      "Guard: hold to block blows from the front behind a screen of spirit swords. Press just as a blow lands to parry: a qi wave cuts ahead and a spirit sword joins you",
    cast: "Send your spirit swords with the selected ability: Sword Stream or Sword Lotus. Just after a blow lands it goes at once and the combo carries on",
    castWide: "Wide form: the stream fans out and flies further, the lotus spins round you and follows you",
    cycle: "Switch ability: stream and lotus",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: jian combo of four blows; tap again just after a blow lands for a Keen hit, and your spirit swords repeat each blow as a thrust. Hold: throw the jian and ride it to the foe (${COST.warp} MP)`,
      accent: ABILITY_TINT.stream,
    },
    guard: {
      label: "Guard",
      hint: "Hold to block behind a screen of spirit swords. Tap just as a blow lands to parry: a qi wave cuts ahead and a spirit sword joins you",
      accent: ABILITY_TINT.lotus,
    },
    cast: {
      label: "Ability",
      hint: "Tap to send your spirit swords with the selected ability. Hold for its wide form",
      accent: null,
    },
    cycle: { label: "Switch", hint: "Next ability: stream and lotus", accent: null },
  },
};
