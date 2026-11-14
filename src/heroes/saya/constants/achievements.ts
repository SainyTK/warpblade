import type { Achievement } from "../../../types/achievement";

/** the most foes one release of Saya's has struck, best ever */
export const RELEASE_STAT = "saya.release";
/** foes one release must strike for her achievement */
export const RELEASE_GOAL = 6;

/** Saya's own achievements */
export const SAYA_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "saya-one-stroke",
    name: "One Stroke",
    text: `As Saya, release stored cuts on ${RELEASE_GOAL} foes with one sheathe`,
    group: "Skill",
    goal: { kind: "hero", stat: RELEASE_STAT, need: RELEASE_GOAL },
    reward: 60,
  },
];
