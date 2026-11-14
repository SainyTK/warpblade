import type { HeroMeter } from "../../../types/heroModule";
import { FOCUS, FOCUS_BAR } from "../constants/focus";
import { saya } from "./state";

/** Focus on the HUD: a cell per breath, glowing when every breath is held */
export const FOCUS_METER: HeroMeter = {
  label: FOCUS_BAR.label,
  tint: FOCUS_BAR.tint,
  share: () => (saya.breaths + (saya.breaths < FOCUS.max ? saya.rest / FOCUS.rest : 0)) / FOCUS.max,
  cells: () => FOCUS.max,
  lit: () => saya.breaths >= FOCUS.max,
};
