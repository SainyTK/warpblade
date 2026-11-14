import type { Enemy } from "../../../types/enemy";

/** Cerise's own skill events: a riposte link landed (its place in the chain and the foe it struck), a chain ended
 *  (how many links it ran and the foe its last link struck) */
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    riposteLink: { link: number; foe: Enemy | null };
    riposteEnd: { links: number; foe: Enemy | null };
  }
}

export {};
