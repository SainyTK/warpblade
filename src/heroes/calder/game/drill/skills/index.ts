import type { CalderDrillSkill } from "../../../types/drillSkill";
import { BLAST_CHARGE_DRILL } from "./blastCharge";
import { BLAST_JUMP_DRILL } from "./blastJump";
import { BREECH_SLAM_DRILL } from "./breechSlam";
import { CHAIN_SHOT_DRILL } from "./chainShot";
import { CYLINDER_BREAK_DRILL } from "./cylinderBreak";
import { DRUM_CYLINDER_DRILL } from "./drumCylinder";
import { HAIR_TRIGGER_DRILL } from "./hairTrigger";
import { PHOSPHOR_SHELL_DRILL } from "./phosphorShell";
import { POINT_BLANK_DRILL } from "./pointBlank";
import { RECOIL_DASH_DRILL } from "./recoilDash";
import { RICOCHET_DRILL } from "./ricochet";
import { SPEED_LOADER_DRILL } from "./speedLoader";
import { TRACER_WARP_DRILL } from "./tracerWarp";
import { VENT_BLAST_DRILL } from "./ventBlast";

export const CALDER_DRILL_SKILLS: readonly CalderDrillSkill[] = [
  HAIR_TRIGGER_DRILL,
  VENT_BLAST_DRILL,
  BREECH_SLAM_DRILL,
  RICOCHET_DRILL,
  POINT_BLANK_DRILL,
  RECOIL_DASH_DRILL,
  TRACER_WARP_DRILL,
  SPEED_LOADER_DRILL,
  DRUM_CYLINDER_DRILL,
  BLAST_JUMP_DRILL,
  PHOSPHOR_SHELL_DRILL,
  CHAIN_SHOT_DRILL,
  BLAST_CHARGE_DRILL,
  CYLINDER_BREAK_DRILL,
];
