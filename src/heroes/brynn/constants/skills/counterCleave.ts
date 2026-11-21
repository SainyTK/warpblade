import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The Counter Cleave hits the attacker 1.5 AD harder.", values: { power: 1.5 } },
    { text: "New: it reaches 12 px farther.", values: { reach: 12 } },
    { text: "New: it is a sure crit.", values: { crit: 1 } },
    { text: "Counter power +1.5 to +7.", values: { power: 7 } },
    { text: "New: a parry gives 20 more Heft.", values: { heft: 20 } },
    { text: "New: it throws a crescent ahead.", values: { wave: 2 } },
    { text: "New: her next 2 swings after a parry deal +50%.", values: { after: 0.5, afterBlows: 2 } },
    { text: "Counter power +7 to +25; the crescent hits harder.", values: { power: 25, wave: 5 } },
  ],
  [
    { text: "A parry cleaves foes in front for 1.2 AD.", drill: { power: 1.2 } },
    { text: "New: the parry window is 30% longer.", drill: { window: 0.3 } },
    { text: "New: the cleave staggers.", drill: { stagger: 0.6 } },
    { text: "Cleave 1.2 to 2 AD.", drill: { power: 2 } },
    { text: "New: the cleave is a sure critical hit.", drill: { crit: 1 } },
    { text: "Cleave 2 to 3.5 AD.", drill: { power: 3.5 } },
    { text: "New: the cleave sends a shockwave ahead.", drill: { wave: 1.5 } },
    { text: "Cleave 3.5 to 8 AD.", drill: { power: 8 } },
  ],
);

export const COUNTER_CLEAVE: SkillDef = {
  id: "br_counter",
  name: "Counter Cleave",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "A parry answers with a heavy cleave on every foe in front of her.",
  levels: LEVELS,
  evolution: {
    partner: "br_ironskin",
    name: "Iron Answer",
    text: "A block also answers with a half-power cleave.",
    row: evolvedRow(LEVELS[7], "A block also cleaves at half power.", {
      ...drillValues({ block: 0.5 }),
      blockCleave: 0.5,
    }),
  },
};
