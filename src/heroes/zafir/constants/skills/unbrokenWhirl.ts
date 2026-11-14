import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `hold` seconds the Whirl holds before it drains, `gain` its fill multiple, `lower` Whirl the ring's tiers need less, `reach` the ring's reach multiple, `power` attack damage added to its cuts, `floor` evolved, the Whirl never drains below the first ring */
const LEVELS = levelRows([
  { text: "The Whirl holds 0.5 s longer before it drains.", values: { hold: 1.6 } },
  { text: "New: hits fill the Whirl 30% faster.", values: { gain: 1.3 } },
  { text: "New: the ring turns from 10 less Whirl.", values: { lower: 10 } },
  { text: "New: the ring reaches 20% farther.", values: { reach: 1.2 } },
  { text: "The Whirl holds 2.2 s.", values: { hold: 2.2 } },
  { text: "New: the ring cuts 0.1 harder.", values: { power: 0.1 } },
  { text: "Ring 20% to 35% farther; fills 50% faster.", values: { reach: 1.35, gain: 1.5 } },
  { text: "Ring cuts 0.1 to 0.25 harder; turns from 20 less.", values: { power: 0.25, lower: 20 } },
]);

export const UNBROKEN_WHIRL: SkillDef = {
  id: "za_unbroken",
  name: "Unbroken Whirl",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "The Whirl holds longer and fills faster, and the sand ring turns sooner, wider and harder.",
  levels: LEVELS,
  evolution: {
    partner: "za_whirling",
    name: "Eye of the Dune",
    text: "The Whirl never drains below the first ring.",
    row: evolvedRow(LEVELS[7], "The ring never stops.", { floor: 1 }),
  },
};
