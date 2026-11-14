import type { Achievement } from "../../../types/achievement";

/** the stats Brynn's kit counts for her achievements */
export const BRYNN_STATS = { fissures: "brynn.fissures", crowd: "brynn.sweepCrowd" } as const;
/** how many fissures Groundbreaker asks for, and how many foes Clean Sweep asks one sweep to strike */
const NEED = { fissures: 50, crowd: 6 } as const;

/** Brynn's own achievements */
export const BRYNN_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "brynn-fissures",
    name: "Groundbreaker",
    text: `As Brynn, split the floor with ${NEED.fissures} fissures`,
    group: "Skill",
    goal: { kind: "hero", stat: BRYNN_STATS.fissures, need: NEED.fissures },
    reward: 60,
  },
  {
    id: "brynn-sweep",
    name: "Clean Sweep",
    text: `As Brynn, strike ${NEED.crowd} foes with one Wide Sweep`,
    group: "Skill",
    goal: { kind: "hero", stat: BRYNN_STATS.crowd, need: NEED.crowd },
    reward: 40,
  },
];
