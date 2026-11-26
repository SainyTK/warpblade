import type { DrillProfile } from "../../../../types/drill";
import { CERISE_TIER_DATA } from "../../constants/drill/tiers";
import { drawRisingRose, drawRoseTempest, drawRoseThrust, drawThornGale } from "./looks/tempest";

const [thrust, rising, gale, tempest] = CERISE_TIER_DATA;

export const CERISE_TIERS: DrillProfile["tiers"] = [
  { ...thrust, drawStrike: drawRoseThrust },
  { ...rising, drawStrike: drawRisingRose },
  { ...gale, drawStrike: drawThornGale },
  { ...tempest, drawStrike: drawRoseTempest },
];
