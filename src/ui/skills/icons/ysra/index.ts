import type { SpriteCanvas } from "../../../../engine/sprite";
import { BURN_ICONS } from "./burns";
import { GLAIVE_ICONS } from "./glaive";
import { RITE_ICONS } from "./rites";
import { STANCE_ICONS } from "./stance";
import { SUMMON_ICONS } from "./summons";
import { ULTIMATE_ICONS } from "./ultimates";

/** Ysra's skill icons and their evolved forms (`<id>_evo`): glaives, ember flames, pillars, shades and beasts of fire */
export const YSRA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...GLAIVE_ICONS,
  ...STANCE_ICONS,
  ...RITE_ICONS,
  ...BURN_ICONS,
  ...SUMMON_ICONS,
  ...ULTIMATE_ICONS,
};
