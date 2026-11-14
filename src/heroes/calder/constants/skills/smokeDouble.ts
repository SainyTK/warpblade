import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a Trigger calls one, `power` share of a Trigger's blast it fires, `shots` rounds it fires, `cut` attack damage of a cut before it fires, `splash` attack damage of each round's splash, `hot` its rounds are hot, `doubles` called at once, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A Trigger may call a smoke double that fires it again.",
    values: { chance: 0.35, power: 1, shots: 1, doubles: 1, cooldown: 0.6 },
  },
  { text: "Chance 35% to 60%.", values: { chance: 0.6 } },
  { text: "New: the double cuts before it fires.", values: { cut: 1.5 } },
  { text: "Round power 1 to 2.", values: { power: 2 } },
  { text: "New: it fires twice.", values: { shots: 2 } },
  { text: "New: every Trigger calls one, and its rounds splash.", values: { chance: 1, splash: 0.5 } },
  { text: "New: its rounds are hot.", values: { hot: 1 } },
  { text: "Round power 2 to 5.", values: { power: 5 } },
]);

export const SMOKE_DOUBLE: SkillDef = {
  id: "ca_double",
  name: "Smoke Double",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A Trigger may leave a double of gunsmoke that fires the same round again.",
  levels: LEVELS,
  evolution: {
    partner: "ca_pointblank",
    name: "Gunsmoke Gallery",
    text: "Two doubles at a time, each firing three rounds.",
    row: evolvedRow(LEVELS[7], "Two doubles, three rounds each.", { doubles: 2, shots: 3 }),
  },
};
