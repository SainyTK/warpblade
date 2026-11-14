import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` AP of the bloom, `reach` px round her, `recharge` seconds, `linger` seconds petals stay, `tick` AP
 *  each tick of them, `heal` HP per foe struck, `points` a Point for every two foes struck; evolved `echoes` blooms */
const LEVELS = levelRows([
  {
    text: "I: blades of petal burst round you, 1.6 AP, pushing foes off.",
    values: { power: 1.6, reach: 40, recharge: 6 },
  },
  { text: "New: petals linger 2 s and cut foes inside.", values: { linger: 2, tick: 0.3 } },
  { text: "Reach 40 to 56 px.", values: { reach: 56 } },
  { text: "New: heals 3 HP for each foe struck.", values: { heal: 3 } },
  { text: "Bloom 1.6 to 3 AP.", values: { power: 3 } },
  { text: "New: a Point for every two foes struck.", values: { points: 1 } },
  { text: "Recharge 6 to 4 s.", values: { recharge: 4 } },
  { text: "Bloom 3 to 6 AP; petals 0.3 to 0.8 AP a tick.", values: { power: 6, tick: 0.8 } },
]);

export const ROSE_BLOOM: SkillDef = {
  id: "ce_bloom",
  name: "Rose Bloom",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "I: a burst of petal blades round you that pushes foes off. Held, it is wider and pulls them in.",
  levels: LEVELS,
  evolution: {
    partner: "ce_petals",
    name: "Garden of Blades",
    text: "The bloom bursts twice more, wider each time.",
    row: evolvedRow(LEVELS[7], "Bursts twice more, wider each time.", { echoes: 2 }),
  },
};
