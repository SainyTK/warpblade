import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { KAEL_CONTROLS } from "./controls";

const { attack, guard } = KAEL_CONTROLS.touch;

/** how the Controls screen and the touch controller describe the Prism Knight, over Kael's own lines */
export const PRISM_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Sword combo of four blows: the third lodges a prism shard and the last shatters every shard nearby. Press again just after a blow lands for a Keen hit. Just after a parry, blink to the attacker's back and strike",
    guard:
      "Guard: hold to block blows from the front. Press just as a blow lands to parry: a riposte cut that lodges a prism shard, then Attack blinks you behind the attacker",
  },
  touch: {
    attack: {
      label: attack?.label ?? "Attack",
      accent: attack?.accent ?? null,
      hint: `Tap: sword combo of four blows; the third lodges a prism shard and the last shatters every shard nearby. Tap again just after a blow lands for a Keen hit, or just after a parry to blink behind the attacker. Hold: throw the sword and warp to it (${COST.warp} MP)`,
    },
    guard: {
      label: guard?.label ?? "Guard",
      accent: guard?.accent ?? null,
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry: a riposte cut that lodges a prism shard, then Attack blinks you behind the attacker",
    },
  },
};
