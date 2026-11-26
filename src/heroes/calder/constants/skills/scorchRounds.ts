import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a tick per stack, `max` stacks, `splash` the blast's splash burns too, `shots` shots burn too, `spread` a burning foe that falls passes its fire on, `consume` attack damage per stack when a Trigger consumes `at` stacks or more */
const LEVELS = levelRows([
  { text: "Trigger rounds set the struck foe burning.", values: { damage: 0.15, max: 4 } },
  { text: "Burn 0.15 to 0.25.", values: { damage: 0.25 } },
  { text: "New: the blast's splash burns too.", values: { splash: 1 } },
  { text: "New: slugs and pellets burn too.", values: { shots: 1 } },
  { text: "Burn 0.25 to 0.3.", values: { damage: 0.3 } },
  { text: "New: a burning foe that falls sets the nearest foe alight.", values: { spread: 1 } },
  { text: "New: up to 8 stacks.", values: { max: 8 } },
  { text: "Burn 0.3 to 0.7.", values: { damage: 0.7 } },
]);

export const SCORCH_ROUNDS: SkillDef = {
  id: "ca_scorch",
  name: "Scorch Rounds",
  kind: "dot",
  element: "blaze",
  risk: "timed",
  button: "auto",
  text: "A Trigger's round sets the struck foe burning green.",
  levels: LEVELS,
  evolution: {
    partner: "ca_flare",
    name: "Phosphor Heart",
    text: "A Trigger on a foe burning with 4 stacks or more consumes the fire in one burst.",
    row: evolvedRow(LEVELS[7], "Triggers consume 4 or more stacks in a burst.", { consume: 2.5, at: 4 }),
  },
};
