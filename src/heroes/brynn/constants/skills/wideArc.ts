import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The sweep hits harder and reaches 10 px farther.", values: { power: 0.4, reach: 10 } },
    { text: "New: the sweep cuts behind her too.", values: { behind: 1 } },
    { text: "Reach +10 to +20 px.", values: { reach: 20 } },
    { text: "New: the sweep drags foes in toward her.", values: { drag: 1 } },
    { text: "Sweep power +0.4 to +1.2.", values: { power: 1.2 } },
    { text: "New: the sweep reaches flying foes overhead.", values: { tall: 1 } },
    { text: "New: foes it strikes take +25% for 2 s.", values: { mark: 0.25, markTime: 2 } },
    { text: "Sweep power +1.2 to +2.2; reach +30 px.", values: { power: 2.2, reach: 30 } },
  ],
  [
    { text: "The first slash cuts for an extra 0.4 AD.", drill: { cut: 0.4 } },
    { text: "New: the first slash staggers foes.", drill: { stagger: 0.35 } },
    { text: "Extra cut 0.4 to 0.7 AD.", drill: { cut: 0.7 } },
    { text: "New: the first slash drags foes in toward her.", drill: { drag: 60 } },
    { text: "New: the sweep also cuts foes just behind her.", drill: { behind: 1 } },
    { text: "Extra cut 0.7 to 1.4 AD.", drill: { cut: 1.4 } },
    { text: "New: foes it strikes burn.", drill: { burn: 1.5 } },
    { text: "Extra cut 1.4 to 3 AD.", drill: { cut: 3 } },
  ],
);

export const WIDE_ARC: SkillDef = {
  id: "br_cleave",
  name: "Wide Arc",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The first slash, Wide Sweep, cuts harder and drags the crowd into the chain.",
  levels: LEVELS,
  evolution: {
    partner: "br_launch",
    name: "Horizon Cleave",
    text: "Every first slash throws a crimson crescent both ways.",
    row: evolvedRow(LEVELS[7], "The first slash throws crescents both ways.", {
      ...drillValues({ wave: 1.5 }),
      wave: 1,
    }),
  },
};
