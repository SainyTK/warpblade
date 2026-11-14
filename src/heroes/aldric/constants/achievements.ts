import type { Achievement } from "../../../types/achievement";

/** Aldric's own stats, counted by his kit */
export const STAT = {
  /** blows stopped on his guard, over every run */
  blocks: "aldric.blocks",
  /** Radiance kindled, over every run */
  radiance: "aldric.radiance",
} as const;

/** Aldric's own achievements */
export const ALDRIC_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "aldric-bulwark",
    name: "Bulwark",
    text: "As Aldric, block 500 blows with your guard",
    group: "Skill",
    goal: { kind: "hero", stat: STAT.blocks, need: 500 },
    reward: 60,
  },
  {
    id: "aldric-radiance",
    name: "Dawnbringer",
    text: "As Aldric, kindle Radiance 50 times",
    group: "Skill",
    goal: { kind: "hero", stat: STAT.radiance, need: 50 },
    reward: 60,
  },
];
