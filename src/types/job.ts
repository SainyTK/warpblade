import type { Goal } from "./achievement";
import type { HeroControls, HeroSkin } from "./character";

/** what opens a job: an unlock id kept in the save, the goal that finds it, and the line the hero screen shows while it is locked */
export interface JobUnlock {
  id: string;
  goal: Goal;
  hint: string;
}

/**
 * A hero's second or later job (class advancement): the same hero on the same buttons with their own look, their own
 * Controls lines and the moves the hero's kit plays while the job is chosen (`heroJob()`). The base job is the hero
 * itself and needs no entry.
 */
export interface JobDef {
  /** the job's id within its hero, as the save and `heroJob()` name it */
  id: string;
  /** the job's name on its chip, the banner and the run result */
  name: string;
  /** shown under the hero's name on the hero screen in place of the hero's own */
  title: string;
  blurb: string;
  /** the chip's fill while the job is chosen, a CSS colour */
  accent: string;
  /** the whole look on the rig in place of the hero's own */
  skin: HeroSkin;
  /** lines over the hero's own on the Controls screen and the touch controller */
  controls: HeroControls;
  unlock: JobUnlock;
  /** an icon id from the hero's `HeroModule.icons`, for the banner and the run result */
  icon: string;
}

/** a job with the hero it belongs to */
export interface HeroJob {
  hero: string;
  job: JobDef;
}
