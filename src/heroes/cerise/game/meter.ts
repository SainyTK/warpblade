import type { HeroMeter } from "../../../types/heroModule";
import { pointCap } from "./points";
import { cerise } from "./state";

/** the PT bar: one rose pip per Point, glowing when full, flashing when one comes or goes */
export const POINTS_METER: HeroMeter = {
  label: "PT",
  tint: "#ff8fb0",
  share: () => cerise.points / pointCap(),
  cells: pointCap,
  lit: () => cerise.points >= pointCap(),
  flash: () => cerise.pointFlash > 0,
};
