import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a kill calls one, `life` seconds it runs, `power` attack damage a bite, `every` seconds between bites, `stagger` a bite staggers, `leap` hounds leap at foes in the air, `most` hounds at once, `boom` attack damage of the blast when it winds down, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A kill may call a clockwork hound that bites.",
    values: { chance: 0.3, life: 5, power: 0.25, every: 0.5, most: 1, cooldown: 1 },
  },
  { text: "Chance 30% to 50%.", values: { chance: 0.5 } },
  { text: "New: bites stagger.", values: { stagger: 0.3 } },
  { text: "Hounds run 8 s; bite 0.25 to 0.4.", values: { life: 8, power: 0.4 } },
  { text: "New: two hounds at once.", values: { most: 2 } },
  { text: "New: hounds leap at foes in the air; bite 0.4 to 0.6.", values: { power: 0.6, leap: 1 } },
  { text: "New: a hound blows up when it winds down.", values: { boom: 2 } },
  { text: "Bite 0.6 to 0.9.", values: { power: 0.9 } },
]);

export const SCRAP_HOUND: SkillDef = {
  id: "ca_hound",
  name: "Scrap Hound",
  kind: "summon",
  element: "venom",
  risk: "easy",
  button: "auto",
  text: "A foe falling may call a clockwork hound that runs down and bites the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "ca_drum",
    name: "Scrap Pack",
    text: "Three hounds, always at your side.",
    row: evolvedRow(LEVELS[7], "Three hounds, always out.", { most: 3, pack: 1 }),
  },
};
