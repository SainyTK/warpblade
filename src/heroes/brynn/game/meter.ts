import type { HeroMeter } from "../../../types/heroModule";
import { BRYNN_ACCENT } from "../constants/colors";
import { HEFT } from "../constants/heft";
import { heftFull, heftMost } from "./heft";
import { brynn } from "./state";

/** the HF bar: Heft in four cells, glowing when full and the next slam is a fissure */
export const BRYNN_METER: HeroMeter = {
  label: "HF",
  tint: BRYNN_ACCENT,
  share: () => brynn.heft / heftMost(),
  cells: () => HEFT.cells,
  lit: heftFull,
};
