import type { WaveKind } from "../constants/waves";

declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** one of Brynn's floor waves (a shockwave, a fissure, Rend) stopped, having run from `x0` to `x1` on floor `y` */
    floorWave: { x0: number; x1: number; y: number; kind: WaveKind };
    /** the Counter Cleave struck `hits` foes after a parry */
    counterCleave: { hits: number };
    /** a heavy swing (Keen timing) landed on `hits` foes */
    heavy: { hits: number };
  }
}

export {};
