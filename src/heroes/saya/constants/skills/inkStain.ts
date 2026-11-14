import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: a foe holding cuts takes `share` of them each second; `consume` added to its release; `grow` the share the
 *  stored cut grows each second; `linger` s the stain keeps ticking after a release; `stagger` s each tick staggers;
 *  `keep` share of each cut left stored after a release */
const LEVELS = levelRows([
  { text: "Foes holding stored cuts take 5% of them each second.", values: { share: 0.05 } },
  { text: "New: a release takes +20% from the stain.", values: { consume: 0.2 } },
  { text: "Stain 5% to 9% a second.", values: { share: 0.09 } },
  { text: "New: stored cuts grow 5% each second they wait.", values: { grow: 0.05 } },
  { text: "Stain 9% to 14% a second.", values: { share: 0.14 } },
  { text: "New: the stain keeps ticking 2 s after the release.", values: { linger: 2 } },
  { text: "New: each tick staggers the foe.", values: { stagger: 0.12 } },
  { text: "Stain 14% to 30% a second; cuts grow 10%.", values: { share: 0.3, grow: 0.1 } },
]);

export const INK_STAIN: SkillDef = {
  id: SKILL.stain,
  name: "Ink Stain",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "A cut waiting in a foe stains it: the foe takes a share of it every second until the sheathe.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.weep,
    name: "Indelible",
    text: "A release leaves half of each foe's cut stored in it for the next sheathe.",
    row: evolvedRow(LEVELS[7], "Half of each cut stays stored after a release.", { keep: 0.5 }),
  },
};
