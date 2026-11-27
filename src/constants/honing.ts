import type { HoningDef, HoningId } from "../types/build";

export const HONING: Readonly<Record<HoningId, HoningDef>> = {
  whetstone: { name: "Whetstone", text: "Attack damage +4%.", icon: "edge", scale: { ad: 0.04 } },
  focus: { name: "Focus", text: "Ability power +4%.", icon: "arcana", scale: { ap: 0.04 } },
  keenEye: { name: "Keen Eye", text: "Critical chance +1.5%.", icon: "precision", stats: { crit: 0.015 } },
};

export const HONING_IDS = Object.keys(HONING) as HoningId[];
