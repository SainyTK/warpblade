import { PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { CharmId } from "../../../types/build";
import { gem } from "./parts";

/** Charm icons by `charm_<id>`. Core owns this file; the gems stand in until then. */
export const CHARM_ICONS: Record<`charm_${CharmId}`, (s: SpriteCanvas) => void> = {
  charm_might: (s) => gem(s, 8, 8, 6, 8),
  charm_haste: (s) => gem(s, 8, 8, 6, 8),
  charm_multitude: (s) => gem(s, 8, 8, 6, 8),
  charm_reach: (s) => gem(s, 8, 8, 6, 8),
  charm_persistence: (s) => gem(s, 8, 8, 6, 8),
  charm_swiftness: (s) => gem(s, 8, 8, 6, 8),
  charm_fortune: (s) => gem(s, 8, 8, 6, 8, PAL.heal),
  charm_vigor: (s) => gem(s, 8, 8, 6, 8, PAL.heal),
  charm_insight: (s) => gem(s, 8, 8, 6, 8),
  charm_resonance: (s) => gem(s, 8, 8, 6, 8),
};
