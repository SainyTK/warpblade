import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` attack damage of the sword of light, `swords` how many fall, `mark` extra damage the foe takes for 3 s, `counter` a Counterbash calls it too, `keen` seconds added to the Keen moment */
const NATIVE = levelRows([
  { text: "A Keen blow calls a sword of light on its foe.", values: { power: 1.5, swords: 1 } },
  { text: "Sword of light 1.5 to 2.5.", values: { power: 2.5 } },
  { text: "New: the foe takes 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "New: a Counterbash calls it too.", values: { counter: 1 } },
  { text: "Sword of light 2.5 to 5.", values: { power: 5 } },
  { text: "New: two swords fall.", values: { swords: 2 } },
  { text: "New: the Keen moment is 0.05 s longer.", values: { keen: 0.05 } },
  { text: "Sword of light 5 to 12.", values: { power: 12 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "One more Sky cut per jump.", drill: { airSlashes: 1 } },
  { text: "New: a Sky cut that lands calls a sword of light on the foe.", drill: { swords: 1 } },
  { text: "New: Sky cut adds a light cut of 0.5 attack.", drill: { extra: 0.5 } },
  { text: "New: two swords fall.", drill: { swords: 2 } },
  { text: "One more Sky cut, three per jump.", drill: { airSlashes: 2 } },
  { text: "Light cut 0.5 to 1.5.", drill: { extra: 1.5 } },
  { text: "New: three swords fall.", drill: { swords: 3 } },
  { text: "Light cut 1.5 to 4.", drill: { extra: 4 } },
]);

export const VERDICT: SkillDef = {
  id: "al_verdict",
  name: "Verdict",
  kind: "attack",
  element: "storm",
  risk: "precise",
  button: "J",
  text: "More Sky cuts in the air, and each one that lands calls swords of light down on its foe.",
  levels: LEVELS,
  evolution: {
    partner: "al_lance",
    name: "Final Verdict",
    text: "Every blow of the ground chain also calls a sword of light on its foe.",
    row: evolvedRow(LEVELS[7], "Every ground blow calls a sword.", {
      ...drillValues({ chain: 1 }),
      pillar: 1.6,
    }),
  },
};
