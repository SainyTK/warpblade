import type { Enemy } from "../../../types/enemy";

/** one foe a release struck: how many cuts it held and how much it took before its own bonuses */
export interface ReleasedCut {
  foe: Enemy;
  count: number;
  amount: number;
}

declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** Saya's blade went home and released the cuts stored in `cuts`; `full` a keyed sheathe, `clean` a clean one */
    release: { cuts: readonly ReleasedCut[]; full: boolean; clean: boolean };
  }
}
