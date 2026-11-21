import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { behind: 0.2 },
  { behind: 0.35 },
  { wounds: 1 },
  { both: 10 },
  { behind: 0.55 },
  { keenBoth: 1 },
  { bothWounds: 1 },
  { behind: 0.9, both: 20 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The rising turn deals +35%; cuts behind you deal +20%.", drill: { second: 0.35 } },
  { text: "Cuts behind you +20% to +35%." },
  { text: "New: a cut behind you opens an extra wound.", drill: { wounds: 1 } },
  { text: "Rising turn +35% to +70%.", drill: { second: 0.7 } },
  { text: "New: the rising turn staggers; cuts behind +35% to +55%.", drill: { stagger: 0.4 } },
  { text: "Rising turn +70% to +150%.", drill: { second: 1.5 } },
  { text: "New: the rising turn blinds minions for 1 s.", drill: { blind: 1 } },
  { text: "Rising turn +150% to +350%; cuts behind +55% to +90%.", drill: { second: 3.5 } },
]);

export const TWO_FACED_CUT: SkillDef = {
  id: "za_twofaced",
  name: "Two-Faced Cut",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The rising turn, the second slash, hits harder, and every cut behind you hits harder too.",
  levels: LEVELS,
  evolution: {
    partner: "za_dune",
    name: "Mirror Dance",
    text: "Every rising turn throws a mirror ring behind you that cuts every foe there for twice attack damage, and cuts behind you deal 50% more.",
    row: evolvedRow(LEVELS[7], "A mirror ring behind you after every rising turn.", {
      backAll: 0.5,
      ...drillValues({ mirror: 2 }),
    }),
  },
};
