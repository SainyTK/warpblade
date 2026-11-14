import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` the lunge plants a sentinel, `time` seconds it stands, `power` AD each thrust, `every` seconds
 *  between thrusts, `reach` px it reaches, `most` sentinels at once, `pin` each thrust pins this long; evolved `bloom`
 *  AP of the burst when it fades */
const LEVELS = levelRows([
  {
    text: "The lunge: 50% to plant a rapier of light that thrusts at foes near it for 3 s, 0.8 AD.",
    values: { chance: 0.5, time: 3, power: 0.8, every: 0.5, reach: 40, most: 1 },
  },
  { text: "Chance 50% to 80%.", values: { chance: 0.8 } },
  { text: "New: up to two sentinels at once.", values: { most: 2 } },
  { text: "Thrusts 0.8 to 1 AD; it stands 4 s.", values: { power: 1, time: 4 } },
  { text: "New: its thrusts pin foes.", values: { pin: 0.4 } },
  { text: "New: it reaches 40 to 60 px; chance 100%.", values: { reach: 60, chance: 1 } },
  { text: "New: it thrusts twice as often.", values: { every: 0.25 } },
  { text: "Thrusts 1 to 1.5 AD; three at once.", values: { power: 1.5, most: 3 } },
]);

export const THORN_SENTINEL: SkillDef = {
  id: "ce_sentinel",
  name: "Thorn Sentinel",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "The lunge can plant a rapier of light in the floor that keeps thrusting at foes.",
  levels: LEVELS,
  evolution: {
    partner: "ce_lunge",
    name: "Thorn Garden",
    text: "A sentinel bursts into petal blades when it fades, 6 AD round it.",
    row: evolvedRow(LEVELS[7], "Bursts for 6 AD when it fades.", { bloom: 6 }),
  },
};
