import type { SpriteCanvas } from "../../../../engine/sprite";
import { KAEL_EVOLVED_ICONS } from "./evolved";
import { KAEL_JOB_ICONS } from "./job";
import { KAEL_SKILL_BASE_ICONS } from "./skills";

/** Kael's skill icons, their evolved forms (`<id>_evo`), his own damage sources and his jobs */
export const KAEL_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...KAEL_SKILL_BASE_ICONS,
  ...KAEL_EVOLVED_ICONS,
  ...KAEL_JOB_ICONS,
};
