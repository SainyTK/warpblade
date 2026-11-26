import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  {
    values: { power: 0.6, burn: 2, chill: 1.5, shock: 1 },
  },
  { values: { window: 1 } },
  { values: { power: 1.2 } },
  { values: { reach: 30 } },
  { values: { half: 0.5 } },
  { values: { power: 2, window: 1.5 } },
  { values: { refund: 1 } },
  { values: { power: 4.5, burn: 3, chill: 2.5, shock: 1.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "An arrival infuses the sword with the selected spell for 1 hit.", drill: { charge: 1 } },
  { text: "Spell cooldowns 15% shorter.", drill: { preparation: 0.85 } },
  { text: "New: an arrival takes 1 s off every spell cooldown.", drill: { hasten: 1 } },
  { text: "New: every infusion lasts 1 more hit.", drill: { infusion: 1 } },
  { text: "New: the arrival bursts with the selected spell.", drill: { burst: 0.6 } },
  { text: "Arrival infusion 1 to 2 hits; spell cooldowns 30% shorter.", drill: { charge: 2, preparation: 0.7 } },
  { text: "Infusions last 2 more hits; a stronger burst.", drill: { infusion: 2, burst: 1 } },
  { text: "Spell cooldowns 45% shorter; the burst doubles.", drill: { preparation: 0.55, burst: 2 } },
]);

export const SPELLWARP: SkillDef = {
  id: "k_spellwarp",
  name: "Spellwarp",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "L",
  text: "Warp Strike pours the selected spell into the sword, and spell cooldowns are shorter.",
  levels: LEVELS,
  evolution: {
    partner: "k_warpcraft",
    name: "Arcane Arrival",
    text: "Every arrival leaves the selected spell ready to cast.",
    row: evolvedRow(LEVELS[7], "Every arrival readies the selected spell.", {
      ...drillValues({ ready: 1 }),
      arcaneEvery: 3,
    }),
  },
};
