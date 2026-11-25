import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { grit: 0.1, gritMost: 4 },
  { grit: 0.15 },
  { gritHalt: 0.5 },
  { gritTaken: 0.25 },
  { cyclone: 2, gritMost: 6 },
  { grit: 0.25 },
  { fuse: 1.5 },
  { grit: 1, fuse: 6 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The sand ring grinds grit into foes, 0.1 a second each." },
  { text: "Grit 0.1 to 0.15." },
  { text: "New: a foe full of grit stands held for 0.5 s." },
  { text: "New: the ring cuts gritted foes 25% harder." },
  { text: "New: the twin turn grinds in two grit; up to 6 grit.", drill: { third: 2 } },
  { text: "Grit 0.15 to 0.25." },
  { text: "New: a foe full of grit fuses to glass and shatters, 1.5 a grit." },
  { text: "Grit 0.25 to 1; shatter 1.5 to 6 a grit." },
]);

export const SCOURING_SAND: SkillDef = {
  id: "za_scour",
  name: "Scouring Sand",
  kind: "dot",
  element: "blaze",
  risk: "timed",
  button: "auto",
  text: "The sand ring grinds grit into foes that bleeds on its own; full of grit, they fuse to glass and shatter.",
  levels: LEVELS,
  evolution: {
    partner: "za_unbroken",
    name: "Glassing Wind",
    text: "Every slash grinds grit in, and a shatter cuts every foe round it.",
    row: evolvedRow(LEVELS[7], "Every slash grinds grit; shatters cut round them.", {
      spin: 1,
      splash: 1,
      ...drillValues({ slash: 1 }),
    }),
  },
};
