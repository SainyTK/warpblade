import type { Enemy } from "../../../types/enemy";

/** Zafir's own skill events: a sand ring cut a foe, a mirage burst */
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    ringCut: { foe: Enemy };
    mirage: { x: number; y: number };
  }
}
