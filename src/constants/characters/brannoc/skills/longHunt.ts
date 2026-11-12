import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Hunt reaches 150 px; the chop deals 40% more.",
    values: { reach: 150, power: 0.4, free: 0, launch: 0, mark: 0, stamina: 0, wolves: 0 },
  },
  { text: "A second Hunt within 0.6 s is free.", values: { free: 0.6 } },
  { text: "The chop deals 70% more.", values: { power: 0.7 } },
  { text: "The chop launches minions.", values: { launch: 1 } },
  { text: "The hunted foe is marked: +20% for 5 s.", values: { mark: 0.2 } },
  { text: "Hunt costs 5 less stamina.", values: { stamina: 5 } },
  { text: "The chop deals 100% more.", values: { power: 1 } },
  { text: "The chop deals 140% more.", values: { power: 1.4 } },
]);

/** Long Hunt. Design: docs/skills/brannoc.md. Values: reach: pixels Hunt looks ahead for a foe; power: share more the Hunt Chop deals; free: seconds after a Hunt in which the next is free (0 for none); launch: 1 the chop launches minions; mark: extra damage the hunted foe takes from all sources for 5 s; stamina: stamina less Hunt costs; wolves: 1 each Hunt sends a red wolf down the lane (evolution) */
export const LONG_HUNT: SkillDef = {
  id: "b_hunt",
  name: "Long Hunt",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Hunt reaches further and its chop bites deeper.",
  levels: LEVELS,
  evolution: {
    partner: "b_wolves",
    name: "Wolf's Road",
    text: "Each Hunt also sends a red wolf running down the lane ahead, 1.2x to each foe it passes.",
    row: evolvedRow(LEVELS[7], "Each Hunt sends a red wolf down the lane.", { wolves: 1 }),
  },
};
