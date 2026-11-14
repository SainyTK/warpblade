import { COST } from "../../../constants/combat";
import type { HeroControls } from "../../../types/character";
import { CHAMBER_ROUNDS } from "./chamber";
import { ACCENT } from "./colors";
import { COUNTER_SHOT } from "./guard";
import { SHOT_ROUNDS } from "./shots";

/** how the Controls screen and the touch controller describe Calder, over the shared lines */
export const CALDER_CONTROLS: HeroControls = {
  actions: {
    attack: `Gun sword combo of three blows. Press again just after a blow lands for a Keen hit, the Trigger: a round goes off in the wound. With an empty chamber, reload ${CHAMBER_ROUNDS} rounds; press again as the cylinder glints for hot rounds`,
    warp: `Warp strike: throw the gun sword at the nearest foe ahead and warp to it; a loaded round fires on arrival (${COST.warp} MP)`,
    guard: `Guard: hold to block blows from the front. Press just as a blow lands to parry with a counter shot that loads ${COUNTER_SHOT.rounds} rounds and makes your next blow a Trigger`,
    cast: `Fire the selected ability: Slug Shot (${SHOT_ROUNDS.slug[0]} round), Scatter Blast (${SHOT_ROUNDS.scatter[0]} rounds) or a shell you learn (MP). Just after a blow lands it fires at once`,
    castWide:
      "Wide form: a Breaker Slug, a Twin Scatter fore and back, or a larger shell, for more rounds or half again the MP",
    cycle: "Switch ability: slug, scatter and the shells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: `Tap: gun sword combo of three blows; tap again just after a blow lands for a Keen hit, the Trigger, a round into the wound. With an empty chamber, tap to reload and again as the cylinder glints for hot rounds. Hold: throw the gun sword and warp to it (${COST.warp} MP)`,
      accent: ACCENT,
    },
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry with a counter shot that loads rounds",
      accent: "#dcffa8",
    },
    cast: {
      label: "Ability",
      hint: "Tap to fire the selected ability; if it is recharging or short of rounds, the next ready one goes. Hold for its wide form",
      accent: null,
    },
    cycle: { label: "Switch", hint: "Next ability: slug, scatter and the shells you learn", accent: null },
  },
};
