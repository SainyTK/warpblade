import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: Brushline's stroke stays `time` s as a trail whose foes take `damage` ability power every `every` s; `rise`
 *  Moonrise leaves one too; `slow` foes on it are slowed; `store` ability power each tick stores, `focus` Focus fills this many times as fast on her own trail;
 *  `wide` the factor on its width and `burst` ability power a release adds to each foe on a trail */
const LEVELS = levelRows([
  {
    text: "Brushline's stroke stays on the floor 2 s; foes on it take ink damage.",
    values: { time: 2, damage: 0.4, every: 0.4, wide: 1 },
  },
  { text: "The trail stays 2 to 3 s.", values: { time: 3 } },
  { text: "New: Moonrise leaves a trail too.", values: { rise: 1 } },
  { text: "Trail damage +60%.", values: { damage: 0.65 } },
  { text: "New: foes on the trail are slowed.", values: { slow: 1 } },
  { text: "Trail damage +60% to +150%; 4 s.", values: { damage: 1, time: 4 } },
  { text: "New: Focus fills twice as fast while she stands on her trail.", values: { focus: 2 } },
  { text: "New: trail ticks store a small cut; damage +150% to +400%.", values: { damage: 2, store: 0.3 } },
]);

export const LINGERING_LINE: SkillDef = {
  id: SKILL.trail,
  name: "Lingering Line",
  kind: "dot",
  risk: "timed",
  button: "I",
  text: "Brushline's ink stays on the floor and burns the foes that stand in it.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.stroke,
    name: "Ink Sea",
    text: "Trails are twice as wide, and every release adds 1.5 ability power to each foe on a trail.",
    row: evolvedRow(LEVELS[7], "Twice as wide; releases burst on the trail.", { wide: 2, burst: 1.5 }),
  },
};
