import type { SpriteCanvas } from "../../../../engine/sprite";
import { BASTION_ICONS } from "./bastion";
import { YSRA_FUSION_ICONS } from "./fusion";
import { LANCE_ICONS } from "./lance";
import { PYRE_ICONS } from "./pyre";

/** Ysra's skill icons: glaives, ember flames, the brace and the vault */
export const YSRA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...LANCE_ICONS,
  ...BASTION_ICONS,
  ...PYRE_ICONS,
  ...YSRA_FUSION_ICONS,
};
