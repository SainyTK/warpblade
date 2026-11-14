import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
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

export const INK_FLOW: SkillDef = {
  id: SKILL.flow,
  name: "Ink Flow",
  kind: "attack",
  risk: "timed",
  button: "auto",
  text: "Each cut stored in a foe makes its release hit harder. Store many, then sheathe.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.reverse,
    name: "Spreading Ink",
    text: "A release splashes in full onto every foe within 40 px.",
    row: evolvedRow(LEVELS[7], "Releases splash in full within 40 px.", { splash: 1, reach: 40 }),
  },
};
