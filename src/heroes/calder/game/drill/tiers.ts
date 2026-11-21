import type { DrillProfile } from "../../../../types/drill";
import { CALDER_TIERS } from "../../constants/drill/tiers";
import { drawBreachCut, drawBuckshotWall, drawCylinderBreak, drawGreenLine } from "./looks/tiers";

const [breach, buckshot, line, cylinder] = CALDER_TIERS;

export const CALDER_DRILL_TIERS: DrillProfile["tiers"] = [
  { ...breach, drawStrike: drawBreachCut },
  { ...buckshot, drawStrike: drawBuckshotWall },
  { ...line, drawStrike: drawGreenLine },
  { ...cylinder, drawStrike: drawCylinderBreak },
];
