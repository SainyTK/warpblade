import type { Achievement } from "../../../types/achievement";

/** the stat Yun's own achievement counts: spirit swords his abilities have sent out, over every run */
export const SWORDS_SENT_STAT = "yun.swordsSent";
/** spirit swords to send for A Thousand Blades */
const SWORDS_SENT_NEED = 300;

/** Yun's own achievements */
export const YUN_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: "yun-swords",
    name: "A Thousand Blades",
    text: `As Yun, send out ${SWORDS_SENT_NEED} spirit swords with Sword Stream and Sword Lotus.`,
    group: "Skill",
    goal: { kind: "hero", stat: SWORDS_SENT_STAT, need: SWORDS_SENT_NEED },
    reward: 60,
  },
];
