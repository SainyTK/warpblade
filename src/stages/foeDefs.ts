import type { EnemyDef } from "../constants/enemies";
import type { StageFoeType } from "../types/enemy";
import { ARCHIVE_DEFS } from "./archive/foes/defs";
import { BLIGHT_DEFS } from "./blight/foes/defs";
import { CITADEL_DEFS } from "./citadel/foes/defs";
import { FOUNDRY_DEFS } from "./foundry/foes/defs";
import { GLACIER_DEFS } from "./glacier/foes/defs";
import { MARSH_DEFS } from "./marsh/foes/defs";
import { MOONLIT_DEFS } from "./moonlit/foes/defs";
import { PROLOGUE_DEFS } from "./prologue/foes/defs";
import { SKYWAY_DEFS } from "./skyway/foes/defs";
import { VEIL_DEFS } from "./veil/foes/defs";

export const STAGE_FOE_DEFS: Record<StageFoeType, EnemyDef> = {
  ...PROLOGUE_DEFS,
  ...MARSH_DEFS,
  ...MOONLIT_DEFS,
  ...VEIL_DEFS,
  ...FOUNDRY_DEFS,
  ...GLACIER_DEFS,
  ...SKYWAY_DEFS,
  ...BLIGHT_DEFS,
  ...ARCHIVE_DEFS,
  ...CITADEL_DEFS,
};
