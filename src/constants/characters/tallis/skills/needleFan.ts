import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "A fan of 5 needles out to 90 px, 0.6x each.",
    values: { mp: 16, cooldown: 5, count: 5, power: 0.6, range: 90, pierce: 0, bleed: 0, ironRain: 0 },
  },
  { text: "Needles pierce.", values: { pierce: 1 } },
  { text: "Needles deal 0.75x.", values: { power: 0.75 } },
  { text: "7 needles.", values: { count: 7 } },
  { text: "Needles leave a bleed.", values: { bleed: 1 } },
  { text: "Recharges in 3.5 s.", values: { cooldown: 3.5 } },
  { text: "Needles deal 0.8x.", values: { power: 0.8 } },
  { text: "Needles deal 0.96x.", values: { power: 0.96 } },
]);

/** Needle Fan. Design: docs/skills/tallis.md. Values: mp: MP; cooldown: seconds; count: needles; power: ability power each deals; range: pixels they fly; pierce: 1 they pierce; bleed: 1 they bleed; ironRain: 1 needles also fall from above on every foe on screen (evolution) */
export const NEEDLE_FAN: SkillDef = {
  id: "t_needles",
  name: "Needle Fan",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A spell on I: a fan of needles thrown ahead.",
  levels: LEVELS,
  evolution: {
    partner: "t_quickKnives",
    name: "Iron Rain",
    text: "Every cast also drops needles from above on every foe on screen.",
    row: evolvedRow(LEVELS[7], "Needles also fall on every foe on screen.", { ironRain: 1 }),
  },
};
