import type { SkillBehavior } from "../../../../types/skillBehavior";
import { blastJump } from "./blastJump";
import { drumCylinder } from "./drumCylinder";
import { hotBrass } from "./hotBrass";
import { pointBlank } from "./pointBlank";
import { ricochet } from "./ricochet";
import { scorchRounds } from "./scorchRounds";
import { scrapHound } from "./scrapHound";
import { shrapnel } from "./shrapnel";
import { smokeDouble } from "./smokeDouble";
import { spareBarrel } from "./spareBarrel";
import { speedLoader } from "./speedLoader";
import { tracerWarp } from "./tracerWarp";

/**
 * Calder's skills that act on their own or answer events, by skill id. The rest reshape his kit where it acts: Hair
 * Trigger in the Trigger, Breech Slam in Breaker, Vent Blast after each blow, Recoil Dash in the dodge, the shells in
 * `shells/` and Cylinder Break's skill in the ultimate.
 */
export const CALDER_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  ca_ricochet: ricochet,
  ca_pointblank: pointBlank,
  ca_speedload: speedLoader,
  ca_tracer: tracerWarp,
  ca_blastjump: blastJump,
  ca_shrapnel: shrapnel,
  ca_scorch: scorchRounds,
  ca_brass: hotBrass,
  ca_turret: spareBarrel,
  ca_double: smokeDouble,
  ca_hound: scrapHound,
  ca_drum: drumCylinder,
};
