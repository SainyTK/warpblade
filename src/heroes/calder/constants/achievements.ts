import type { Achievement } from "../../../types/achievement";

/** quick reloads Hot Hands asks for, and Triggers in a row Six for Six asks for */
export const QUICK_RELOAD_GOAL = 40;
export const TRIGGER_RUN_GOAL = 6;

/** Calder's own stats the achievements read, counted by his kit */
export const CALDER_STAT = { quickReloads: "calder.quickReloads", triggerRun: "calder.triggerRun" } as const;

/** Calder's own achievements */
export const CALDER_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "calder-quick",
    name: "Hot Hands",
    text: `As Calder, make ${QUICK_RELOAD_GOAL} quick reloads`,
    group: "Skill",
    goal: { kind: "hero", stat: CALDER_STAT.quickReloads, need: QUICK_RELOAD_GOAL },
    reward: 60,
  },
  {
    id: "calder-triggers",
    name: "Six for Six",
    text: `As Calder, land ${TRIGGER_RUN_GOAL} Triggers in a row`,
    group: "Skill",
    goal: { kind: "hero", stat: CALDER_STAT.triggerRun, need: TRIGGER_RUN_GOAL },
    reward: 80,
  },
];
