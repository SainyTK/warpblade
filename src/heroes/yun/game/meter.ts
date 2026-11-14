import { hero } from "../../../game/state";
import type { HeroMeter } from "../../../types/heroModule";
import { ABILITY_TINT } from "../constants/abilities";
import { yun } from "./state";
import { mostSwords } from "./swords";

/** the SW bar under stamina: a cell per spirit sword he can hold, glowing when all are held; it flashes when I finds
 *  no sword to send */
export const YUN_METER: HeroMeter = {
  label: "SW",
  tint: ABILITY_TINT.stream,
  share: () => yun.swords / mostSwords(),
  cells: mostSwords,
  lit: () => yun.swords >= mostSwords(),
  flash: () => yun.swords === 0 && hero.denied.mp > 0,
  text: () => `${yun.swords}/${mostSwords()}`,
};
