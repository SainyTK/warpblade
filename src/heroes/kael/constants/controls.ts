import type { HeroControls } from "../../../types/character";

/** how the Controls screen and the touch controller describe Kael, over the shared lines */
export const KAEL_CONTROLS: HeroControls = {
  actions: {
    attack:
      "Sword combo of four hits, the same every time. Press again just as a blow lands for a Keen hit. Just after a parry, blink to the attacker's back and strike",
    warp: "Warp strike: throw the sword at the nearest foe ahead and warp to it (10 MP)",
    guard:
      "Guard: hold to block blows from the front. Press just as a blow lands to parry: a riposte cut, then Attack blinks you behind the attacker",
    cast: "Cast the selected ability: Crystal Lance, Crystal Burst or a spell you learn. If it is recharging, the next ready one goes",
    castWide:
      "Wide form for half again the MP: three lances, a burst that pulls foes in, a wall of fire, an ice field, a chain of bolts",
    cycle: "Switch ability: lance, burst and the spells you learn",
  },
  touch: {
    attack: {
      label: "Attack",
      hint: "Tap: sword combo of four hits; tap again just as a blow lands for a Keen hit, or just after a parry to blink behind the attacker. Hold: throw the sword and warp to it (10 MP)",
      accent: "#7fe3ff",
    },
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry: a riposte cut, then Attack blinks you behind the attacker",
      accent: "#a8ecff",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    cycle: { label: "Ability", hint: "Switch ability: lance, burst and the spells you learn", accent: null },
  },
};
