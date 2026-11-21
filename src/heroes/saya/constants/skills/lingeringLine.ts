import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
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
  { text: "New: trail ticks store a small cut; damage +150% to +200%.", values: { damage: 1.2, store: 0.3 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Infused hits leave a bleeding ink line: 0.3x AP every 0.5 s for 3 s.", drill: { bleed: 0.3, time: 3 } },
  { text: "The bleed lasts 3 to 4 s.", drill: { time: 4 } },
  { text: "New: the bleed stacks up to 3 times.", drill: { stacks: 3 } },
  { text: "Bleed +60%.", drill: { bleed: 0.5 } },
  { text: "New: every slash stores 40% more.", drill: { store: 0.4 } },
  { text: "Bleed +60% to +150%.", drill: { bleed: 0.75 } },
  { text: "New: the bleed stacks up to 5 times.", drill: { stacks: 5 } },
  { text: "Bleed +150% to +250%.", drill: { bleed: 1.05 } },
]);

export const LINGERING_LINE: SkillDef = {
  id: SKILL.trail,
  name: "Lingering Line",
  kind: "dot",
  risk: "timed",
  button: "I",
  text: "Infused hits leave a bleeding ink line in the foe.",
  levels: DRILL,
  evolution: {
    partner: SKILL.stroke,
    name: "Ink Sea",
    text: "Every slash leaves the bleeding ink line, infused or not.",
    row: evolvedRow(DRILL[7], "Every slash leaves the ink line.", {
      ...drillValues({ always: 1 }),
      wide: 2,
      burst: 1.5,
    }),
  },
};
