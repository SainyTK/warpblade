import type { SkillDef } from "../../../../types/skill";
import { BLAST_CHARGE } from "./blastCharge";
import { BLAST_JUMP } from "./blastJump";
import { BREECH_SLAM } from "./breechSlam";
import { CHAIN_SHOT } from "./chainShot";
import { CYLINDER_BREAK } from "./cylinderBreak";
import { DRUM_CYLINDER } from "./drumCylinder";
import { HAIR_TRIGGER } from "./hairTrigger";
import { HOT_BRASS } from "./hotBrass";
import { PHOSPHOR_SHELL } from "./phosphorShell";
import { POINT_BLANK } from "./pointBlank";
import { RECOIL_DASH } from "./recoilDash";
import { RICOCHET } from "./ricochet";
import { SCORCH_ROUNDS } from "./scorchRounds";
import { SCRAP_HOUND } from "./scrapHound";
import { SHRAPNEL } from "./shrapnel";
import { SMOKE_DOUBLE } from "./smokeDouble";
import { SPARE_BARREL } from "./spareBarrel";
import { SPEED_LOADER } from "./speedLoader";
import { TRACER_WARP } from "./tracerWarp";
import { VENT_BLAST } from "./ventBlast";

/** Calder's 20 skills. Design: docs/skills/calder.md */
export const CALDER_SKILL_DEFS: readonly SkillDef[] = [
  HAIR_TRIGGER,
  BREECH_SLAM,
  VENT_BLAST,
  POINT_BLANK,
  SPEED_LOADER,
  RICOCHET,
  RECOIL_DASH,
  TRACER_WARP,
  BLAST_JUMP,
  PHOSPHOR_SHELL,
  CHAIN_SHOT,
  BLAST_CHARGE,
  SHRAPNEL,
  SCORCH_ROUNDS,
  HOT_BRASS,
  SPARE_BARREL,
  SMOKE_DOUBLE,
  SCRAP_HOUND,
  DRUM_CYLINDER,
  CYLINDER_BREAK,
];
