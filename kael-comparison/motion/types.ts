import type { HeroLook } from "../../src/rig";
import type { Pose } from "../../src/types/pose";

export interface Sample {
  pose: Pose;
  root: number;
  lift: number;
  contacts: readonly [boolean, boolean];
  beat: string;
  impact?: boolean;
  profile?: number;
}

export interface Motion {
  duration: number;
  sample(time: number): Sample;
  cycles?: boolean;
  scroll?: number;
  inPlace?: boolean;
}

export interface Frame extends Sample {
  look: HeroLook;
  scroll: number;
  stageX: number;
}
