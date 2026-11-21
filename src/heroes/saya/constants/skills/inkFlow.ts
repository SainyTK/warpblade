import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `perLine` added to a release for each cut stored in the foe past the first, `slow` foes holding cuts walk
 *  slowed, `splash` share of a release dealt to foes within `reach` px of it, `splashStore` share of the splash stored in those
 *  foes, `mp` MP back per foe of a full release */
const LEVELS = levelRows([
  { text: "A release deals +15% for each cut stored past the first.", values: { perLine: 0.15 } },
  { text: "New: foes holding stored cuts are slowed.", values: { slow: 1 } },
  { text: "Per cut +15% to +30%.", values: { perLine: 0.3 } },
  { text: "New: a release splashes 30% onto foes beside it.", values: { splash: 0.3, reach: 24 } },
  { text: "New: the splash stores a cut in the foes it reaches.", values: { splashStore: 0.5 } },
  { text: "Per cut +30% to +45%; splash 30% to 50%.", values: { perLine: 0.45, splash: 0.5 } },
  { text: "New: a full release gives 4 MP for each foe.", values: { mp: 4 } },
  { text: "Per cut +45% to +80%.", values: { perLine: 0.8 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "A warp arrival infuses the blade for 1 hit.", drill: { charge: 1 } },
  { text: "Preparation 15% faster.", drill: { preparation: 0.85 } },
  { text: "New: infusions last 1 more hit.", drill: { infusion: 1 } },
  { text: "New: an arrival shortens a preparation by 1 s.", drill: { hasten: 1 } },
  { text: "Preparation 15% to 30% faster.", drill: { preparation: 0.7 } },
  { text: "New: an arrival infuses for 2 hits.", drill: { charge: 2 } },
  { text: "New: infusions last 2 more hits.", drill: { infusion: 2 } },
  { text: "Preparation 30% to 45% faster.", drill: { preparation: 0.55 } },
]);

export const INK_FLOW: SkillDef = {
  id: SKILL.flow,
  name: "Ink Flow",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "A warp arrival pours ink into the blade, and spells prepare faster.",
  levels: DRILL,
  evolution: {
    partner: SKILL.reverse,
    name: "Spreading Ink",
    text: "Every warp arrival readies the selected spell at once.",
    row: evolvedRow(DRILL[7], "Every arrival readies the selected spell.", {
      ...drillValues({ ready: 1 }),
      splash: 1,
      reach: 40,
    }),
  },
};
