import type { SkillDef } from "../../../../types/skill";
import { BARBED_JAWS } from "./barbedJaws";
import { BREACHING_BOLT } from "./breachingBolt";
import { DEADEYE } from "./deadeye";
import { FEATHERDRAW } from "./featherdraw";
import { HEAVY_BOOT } from "./heavyBoot";
import { HOP_VOLLEY } from "./hopVolley";
import { HUNTING_HAWK } from "./huntingHawk";
import { LODGED_BOLTS } from "./lodgedBolts";
import { LONGSHOT } from "./longshot";
import { NET_BOLT } from "./netBolt";
import { PERFECT_RHYTHM } from "./perfectRhythm";
import { PIERCING_BOLTS } from "./piercingBolts";
import { POWDER_KEG } from "./powderKeg";
import { RICOCHET } from "./ricochet";
import { SCATTERSHOT } from "./scattershot";
import { SHADE_ARCHER } from "./shadeArcher";
import { SLIDE_KICK } from "./slideKick";
import { SNARE_HOUND } from "./snareHound";
import { STRAW_DECOY } from "./strawDecoy";
import { VENOM_TIPS } from "./venomTips";

/** Sable's 20 skills, in the order the Codex lists them. Design: docs/skills/sable.md */
export const SABLE_SKILLS_DATA: readonly SkillDef[] = [
  PIERCING_BOLTS,
  SCATTERSHOT,
  RICOCHET,
  BREACHING_BOLT,
  LONGSHOT,
  PERFECT_RHYTHM,
  HEAVY_BOOT,
  HOP_VOLLEY,
  SLIDE_KICK,
  FEATHERDRAW,
  NET_BOLT,
  STRAW_DECOY,
  POWDER_KEG,
  VENOM_TIPS,
  BARBED_JAWS,
  LODGED_BOLTS,
  HUNTING_HAWK,
  SNARE_HOUND,
  SHADE_ARCHER,
  DEADEYE,
];
