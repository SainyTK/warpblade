import type { HeroMeter } from "../../../types/heroModule";
import { tempoMost, tempoShare, tempoTop } from "./tempo";

/** Tempo on the HUD: one cell a stack, glowing at the top */
export const TEMPO_METER: HeroMeter = {
  label: "TP",
  tint: "#b8a0ff",
  share: tempoShare,
  cells: tempoMost,
  lit: tempoTop,
};
