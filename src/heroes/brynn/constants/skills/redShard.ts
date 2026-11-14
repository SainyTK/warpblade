import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a landed string blow throws a shard, `power` AD a strike, `strikes` strikes a shard makes,
 *  `count` shards at a time, `mark` a struck foe takes this much more for a while, `pierce` a strike passes through,
 *  `cooldown` least seconds between shards, `orbit` shards circle her for good */
const LEVELS = levelRows([
  {
    text: "A blow may chip off a red shard of her crystal that darts at foes.",
    values: { chance: 0.25, power: 0.5, strikes: 3, count: 1, cooldown: 0.5 },
  },
  { text: "Chance 25% to 40%.", values: { chance: 0.4 } },
  { text: "New: a Keen blow always throws one.", values: { heavyShard: 1 } },
  { text: "New: a shard's strike marks the foe, +10% from her for 2 s; 5 strikes.", values: { strikes: 5, mark: 0.1 } },
  { text: "Power 0.5 to 0.9 AD.", values: { power: 0.9 } },
  { text: "New: two shards out at once.", values: { count: 2 } },
  { text: "New: shard strikes pass through to a second foe.", values: { pierce: 1 } },
  { text: "Power 0.9 to 1.8 AD; three shards.", values: { power: 1.8, count: 3 } },
]);

export const RED_SHARD: SkillDef = {
  id: "br_shard",
  name: "Red Shard",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "Her blows chip red shards off the crystal in Anvilheart that dart at foes on their own.",
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Shard Halo",
    text: "Four shards circle her for good and dart out at every foe near her.",
    row: evolvedRow(LEVELS[7], "Four shards circle her for good.", { orbit: 1, count: 4 }),
  },
};
