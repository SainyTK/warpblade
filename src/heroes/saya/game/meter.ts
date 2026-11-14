import type { HeroMeter } from "../../../types/heroModule";
import { FOCUS_BAR } from "../constants/focus";
import { maxBreaths, restShare } from "./focus";
import { saya } from "./state";

/** Focus on the HUD: a cell per breath, glowing when every breath is held */
export const FOCUS_METER: HeroMeter = {
  label: FOCUS_BAR.label,
  tint: FOCUS_BAR.tint,
  share: () => (saya.breaths + (saya.breaths < maxBreaths() ? restShare() : 0)) / maxBreaths(),
  cells: maxBreaths,
  lit: () => saya.breaths >= maxBreaths(),
};
