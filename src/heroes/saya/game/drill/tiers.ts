import type { DrillProfile } from "../../../../types/drill";
import { SAYA_TIER_DATA } from "../../constants/drill/tiers";
import { drawCrescentEdge, drawMoonlitDraw, drawSilentMoon, drawThousandLines } from "./effects/tierArt";

const [first, second, third, fourth] = SAYA_TIER_DATA;

export const SAYA_TIERS: DrillProfile["tiers"] = [
  { ...first, drawStrike: drawMoonlitDraw },
  { ...second, drawStrike: drawCrescentEdge },
  { ...third, drawStrike: drawThousandLines },
  { ...fourth, drawStrike: drawSilentMoon },
];
