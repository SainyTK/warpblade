import type { Achievement } from "../../../types/achievement";

/** Zafir's own achievement: the sand ring's cuts, counted over every run */
export const ZAFIR_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "zafir-eye-of-the-storm",
    name: "Eye of the Storm",
    text: "As Zafir, let the sand ring cut foes 500 times",
    group: "Skill",
    goal: { kind: "hero", stat: "zafir.ringCuts", need: 500 },
    reward: 80,
  },
];
