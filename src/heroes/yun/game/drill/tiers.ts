import type { DrillProfile } from "../../../../types/drill";
import { YUN_TIER_DATA } from "../../constants/drill/tiers";
import { drawJadeRain } from "./tierArt";

const [first, second, third, fourth] = YUN_TIER_DATA;

export const YUN_TIERS: DrillProfile["tiers"] = [
  { ...first, art: "tier1", drawStrike: drawJadeRain },
  { ...second, art: "tier2", drawStrike: drawJadeRain },
  { ...third, art: "tier3", drawStrike: drawJadeRain },
  { ...fourth, art: "tier4", drawStrike: drawJadeRain },
];
