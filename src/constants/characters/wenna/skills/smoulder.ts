import type { SkillDef } from "../../../../types/skill";

/** Smoulder. Design: docs/skills/wenna.md. Values: burn: seconds both ends of a Swap burn; damage: ability power a Smoulder stack deals a second; life: seconds a stack lasts; thread: 1 the flame thread between the ends burns too; width: pixels wide each burn is; spread: 1 Smoulder spreads to the nearest foe on a kill; pyre: 1 each Swap leaves a burning trail along the thread for 4 s (evolution) */
export const SMOULDER: SkillDef = {
  id: "w_smoulder",
  name: "Smoulder",
  kind: "dot",
  risk: "timed",
  button: "L",
  text: "Both ends of a Swap smoulder, burning the foes that stand there.",
  levels: [
    {
      text: "Both Swap ends burn 2 s, adding Smoulder.",
      values: { burn: 2, damage: 0.2, life: 3, thread: 0, width: 24, spread: 0, pyre: 0 },
    },
    { text: "The ends burn 3 s.", values: { burn: 3, damage: 0.2, life: 3, thread: 0, width: 24, spread: 0, pyre: 0 } },
    {
      text: "The thread between them burns too.",
      values: { burn: 3, damage: 0.2, life: 3, thread: 1, width: 24, spread: 0, pyre: 0 },
    },
    {
      text: "Smoulder burns for 0.27x.",
      values: { burn: 3, damage: 0.27, life: 3, thread: 1, width: 24, spread: 0, pyre: 0 },
    },
    {
      text: "The burns are 32 px wide.",
      values: { burn: 3, damage: 0.27, life: 3, thread: 1, width: 32, spread: 0, pyre: 0 },
    },
    {
      text: "Smoulder spreads on a kill.",
      values: { burn: 3, damage: 0.27, life: 3, thread: 1, width: 32, spread: 1, pyre: 0 },
    },
    {
      text: "Smoulder burns for 0.35x.",
      values: { burn: 3, damage: 0.35, life: 3, thread: 1, width: 32, spread: 1, pyre: 0 },
    },
    {
      text: "Smoulder burns for 0.45x.",
      values: { burn: 3, damage: 0.45, life: 3, thread: 1, width: 32, spread: 1, pyre: 0 },
    },
  ],
  evolution: {
    partner: "w_swap",
    name: "Pyre Path",
    text: "Each Swap leaves a burning trail along the thread for 4 s.",
    row: {
      text: "Swaps leave a 4 s burning trail.",
      values: { burn: 3, damage: 0.45, life: 3, thread: 1, width: 32, spread: 1, pyre: 1 },
    },
  },
};
