import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a cast calls a familiar, `life` seconds it stays, `every` seconds between shards, `power` ability
 *  power of a shard, `volley` shards a cast fires from a familiar already out, `pierce` foes one shard strikes, `most`
 *  familiars at once, `element` shards take the element cast, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A cast may call a crystal familiar that fires shards.",
    values: { chance: 0.4, life: 6, every: 1, power: 0.8, pierce: 1, most: 1, cooldown: 1 },
  },
  { text: "Chance 40% to 70%.", values: { chance: 0.7 } },
  { text: "New: a cast fires a volley of 3 from a familiar out.", values: { volley: 3 } },
  { text: "New: shards pierce a foe.", values: { pierce: 2 } },
  { text: "Familiars stay 10 s and fire faster.", values: { life: 10, every: 0.7 } },
  { text: "New: two familiars at once.", values: { most: 2 } },
  { text: "New: shards take the element just cast.", values: { element: 1 } },
  { text: "Shard power 0.8 to 1.4; fire faster.", values: { power: 1.4, every: 0.6 } },
]);

export const CRYSTAL_FAMILIAR: SkillDef = {
  id: "k_familiar",
  name: "Crystal Familiar",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "Casting may call a crystal familiar that fires homing shards.",
  levels: LEVELS,
  evolution: {
    partner: "k_volt",
    name: "Crystal Choir",
    text: "Three familiars, always out, and every shard arcs to another foe.",
    row: evolvedRow(LEVELS[7], "Three familiars, always out; shards arc.", { most: 3, every: 0.8, choir: 1 }),
  },
};
