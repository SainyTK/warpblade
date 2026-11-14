import { hero } from "../../../game/state";
import type { HeroMeter } from "../../../types/heroModule";
import { ABILITY_TINT } from "../constants/abilities";
import { SPIRIT } from "../constants/swords";
import { yun } from "./state";

/** the SW bar under stamina: a cell per spirit sword he can hold, glowing when all are held; it flashes when I finds
 *  no sword to send */
export const YUN_METER: HeroMeter = {
  label: "SW",
  tint: ABILITY_TINT.stream,
  share: () => yun.swords / SPIRIT.most,
  cells: () => SPIRIT.most,
  lit: () => yun.swords >= SPIRIT.most,
  flash: () => yun.swords === 0 && hero.denied.mp > 0,
  text: () => `${yun.swords}/${SPIRIT.most}`,
};
