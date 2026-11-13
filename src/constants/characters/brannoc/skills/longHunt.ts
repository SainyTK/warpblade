import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "The Hunt's chop deals 2.4x.",
    values: { strike: 2.4, launch: 0, mark: 0, wolves: 0 },
  },
  { text: "The further the axe flew, the harder the chop, up to +4.5x.", values: { perPx: 0.025, cap: 4.5 } },
  { text: "The chop deals 3x.", values: { strike: 3 } },
  { text: "The chop launches minions.", values: { launch: 1 } },
  { text: "The hunted foe is marked: +20% for 5 s.", values: { mark: 0.2 } },
  { text: "Two Hunts in a row.", values: { charges: 2 } },
  { text: "The Hunt costs 6 MP.", values: { cost: 6 } },
  { text: "The chop deals 5.4x.", values: { strike: 5.4 } },
]);

/** Long Hunt. Design: docs/skills/brannoc.md. Values (read by his warp's `tune` and its arrival): strike: attack damage of the Hunt chop; perPx and cap: power added per pixel the axe flew, and the most it adds (left out until level 2, which keeps the shared numbers); launch: 1 the chop launches minions; mark: extra damage the hunted foe takes from all sources for 5 s; charges: Hunts in a row before the first comes back, and cost: MP a Hunt costs (each left out until its level, which keeps the shared number); wolves: 1 each Hunt sends a red wolf down the lane (evolution) */
export const LONG_HUNT: SkillDef = {
  id: "b_hunt",
  name: "Long Hunt",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The Hunt (J held) bites deeper, hunts twice in a row and marks its foe.",
  levels: LEVELS,
  evolution: {
    partner: "b_wolves",
    name: "Wolf's Road",
    text: "Each Hunt also sends a red wolf running down the lane ahead, 1.2x to each foe it passes.",
    row: evolvedRow(LEVELS[7], "Each Hunt sends a red wolf down the lane.", { wolves: 1 }),
  },
};
