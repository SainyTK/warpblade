import type { HeroMeter } from "../../../types/heroModule";
import { CHAMBER_TINT } from "../constants/chamber";
import { chamberSize } from "./chamber";
import { calder } from "./state";

/** the chamber on the HUD: a cell per round, the count after it, aglow while hot and flashing on a dry click */
export const CALDER_METER: HeroMeter = {
  label: "RD",
  get tint() {
    return calder.hot ? CHAMBER_TINT.hot : CHAMBER_TINT.cold;
  },
  share: () => calder.rounds / chamberSize(),
  cells: () => chamberSize(),
  lit: () => calder.hot,
  flash: () => calder.click > 0,
  text: () => `${calder.rounds}/${chamberSize()}`,
};
