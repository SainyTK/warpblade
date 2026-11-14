declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** Brynn's slam sent its shockwave from `x` */
    shockwave: { x: number };
    /** full Heft broke the floor open from `x` */
    fissure: { x: number };
    /** the Counter Cleave struck `hits` foes after a parry */
    counterCleave: { hits: number };
    /** a heavy swing (Keen timing) landed */
    heavy: { hits: number };
  }
}

export {};
