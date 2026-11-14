import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `shards` shards a cast drops, `power` ability power of each, `recharge` seconds, `splash` pixels added to a shard's shatter, `aim` shards fall on the nearest foes ahead, `wounds` wounds a shard opens */
const LEVELS = levelRows([
  {
    text: "Learn Glass Rain: shards of glass fall on the ground ahead.",
    values: { shards: 3, power: 0.9, recharge: 4.5 },
  },
  { text: "Power 0.9 to 1.2.", values: { power: 1.2 } },
  { text: "New: shards shatter wider.", values: { splash: 6 } },
  { text: "New: a fourth shard.", values: { shards: 4 } },
  { text: "Power 1.2 to 2.", values: { power: 2 } },
  { text: "New: shards fall on the nearest foes ahead.", values: { aim: 1 } },
  { text: "New: each shard opens a wound; five shards.", values: { wounds: 1, shards: 5 } },
  { text: "Power 2 to 4; recharge 4.5 to 3.5 s.", values: { power: 4, recharge: 3.5 } },
]);

export const GLASS_RAIN: SkillDef = {
  id: "za_glass",
  name: "Glass Rain",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn Glass Rain on I: shards of fused sand fall on the ground ahead and shatter on what they meet. Held, twice as many over twice the ground.",
  levels: LEVELS,
  evolution: {
    partner: "za_gale",
    name: "Glass Storm",
    text: "A second rain falls behind you on the nearest foes there.",
    row: evolvedRow(LEVELS[7], "A second rain falls behind you.", {}),
  },
};
