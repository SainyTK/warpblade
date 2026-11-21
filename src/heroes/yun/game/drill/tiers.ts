import type { DrillProfile } from "../../../../types/drill";
import { YUN_TIER_DATA } from "../../constants/drill/tiers";
import { drawJadeRain } from "./tierArt";

const [first, second, third, fourth] = YUN_TIER_DATA;

export const YUN_TIERS: DrillProfile["tiers"] = [
  { ...first, drawStrike: drawJadeRain },
  { ...second, drawStrike: drawJadeRain },
  { ...third, drawStrike: drawJadeRain },
  { ...fourth, drawStrike: drawJadeRain },
];
