import type { Enemy } from "../../../types/enemy";

declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** a Guard bash struck, `counter` when it was a Counterbash; `foe` the nearest it struck */
    guardBash: { counter: boolean; foe: Enemy | null };
    /** a bash of any kind struck foes: the string's Shield bash, a Guard bash, the Stun bash or Shield Rush */
    bash: { foe: Enemy | null; hits: number };
  }
}
