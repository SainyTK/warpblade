import type { Achievement } from "../../../types/achievement";

/** Vesper's own achievement: reach the top of Tempo again and again */
export const VESPER_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "vesper-tempo",
    name: "Never Miss a Beat",
    text: "As Vesper, reach the top of Tempo 40 times",
    group: "Skill",
    goal: { kind: "hero", stat: "vesper.tops", need: 40 },
    reward: 60,
  },
];
