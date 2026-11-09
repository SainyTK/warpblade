import type { SkillDef } from "../../../../types/skill";
import { BRIGHT_FANGS } from "./brightFangs";
import { CHAIN_KINDLE } from "./chainKindle";
import { CHANGELING_STEP } from "./changelingStep";
import { DEEP_TALLOW } from "./deepTallow";
import { GUTTERING } from "./guttering";
import { HOT_WAX } from "./hotWax";
import { HUNTING_CALL } from "./huntingCall";
import { LAMPFLIES } from "./lampflies";
import { LAMP_VOLLEY } from "./lampVolley";
import { OPEN_SHUTTER } from "./openShutter";
import { PACK_LUNGE } from "./packLunge";
import { PROCESSION } from "./procession";
import { REMEMBRANCE } from "./remembrance";
import { SINGE } from "./singe";
import { SMOULDER } from "./smoulder";
import { THOUSAND_CANDLES } from "./thousandCandles";
import { TWIN_WICK } from "./twinWick";
import { WAX_EFFIGY } from "./waxEffigy";
import { WAX_POOL } from "./waxPool";
import { WICK_HOP } from "./wickHop";

/** Wenna's 20 skills, in the order the Codex lists them. Design: docs/skills/wenna.md */
export const WENNA_SKILL_DEFS: readonly SkillDef[] = [
  HUNTING_CALL,
  BRIGHT_FANGS,
  OPEN_SHUTTER,
  PACK_LUNGE,
  GUTTERING,
  CHAIN_KINDLE,
  CHANGELING_STEP,
  WICK_HOP,
  PROCESSION,
  LAMP_VOLLEY,
  WAX_POOL,
  WAX_EFFIGY,
  SINGE,
  HOT_WAX,
  SMOULDER,
  LAMPFLIES,
  TWIN_WICK,
  REMEMBRANCE,
  DEEP_TALLOW,
  THOUSAND_CANDLES,
];
