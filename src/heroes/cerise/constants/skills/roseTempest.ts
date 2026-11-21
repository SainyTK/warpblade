import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` share of the storm and the lunge, `cooldown` seconds, `charge` charging speed, `thrusts` more in the
 *  storm, `mark` the storm marks, `reach` share of the streak's reach, `behind` a streak behind her at this share,
 *  `lunge` added share of the lunge's own blow; evolved `finale` share of the level's power the ring of thrusts deals */
const LEVELS = levelRows([
  { text: "Rose Tempest deals +40% damage.", values: { power: 1.4 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: the storm sets the Rose mark on every foe it strikes.", values: { mark: 1 } },
  { text: "New: 6 more thrusts in the storm.", values: { thrusts: 6 } },
  { text: "Power +40% to +120%.", values: { power: 2.2 } },
  { text: "New: a second streak runs behind you.", values: { behind: 0.6 } },
  { text: "New: the streak reaches half again as far; the lunge +50%.", values: { reach: 1.5, lunge: 1.5 } },
  { text: "Power +120% to +400%.", values: { power: 5 } },
]);

export const ROSE_TEMPEST: SkillDef = {
  id: "ce_tempest",
  name: "Rose Tempest",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Rose Tempest grows: more thrusts, marks, a streak behind you. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Thousand Roses",
    text: "Where the lunge stops, a ring of thrusts bursts round you.",
    row: evolvedRow(LEVELS[7], "A ring of thrusts bursts where the lunge stops.", { finale: 6, power: 6 }),
  },
};
