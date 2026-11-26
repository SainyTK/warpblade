import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `valor` share more Valor from every deed, `radiance` seconds added to Radiance, `heal` share of max HP each blow heals during Radiance, `mp` MP a block gives, `haste` faster string blows during Radiance, `barrier` kindling Radiance raises Bulwark, `dome` kindling Radiance raises a small Sanctuary */
const NATIVE = levelRows([
  { text: "Valor +20%; HP +10.", values: { valor: 0.2 }, stats: { hp: 10 } },
  { text: "Radiance lasts 1 s longer.", values: { radiance: 1 } },
  { text: "New: blows during Radiance heal 1% HP.", values: { heal: 0.01 } },
  { text: "New: each block gives 2 MP.", values: { mp: 2 } },
  { text: "Valor +40%; HP +25.", values: { valor: 0.4 }, stats: { hp: 25 } },
  { text: "New: string blows 15% faster during Radiance.", values: { haste: 0.15 } },
  { text: "New: kindling Radiance raises Bulwark.", values: { barrier: 1 } },
  { text: "Radiance lasts 2 s longer; HP +40.", values: { radiance: 2 }, stats: { hp: 40 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "One more air dash.", drill: { airDashes: 1 } },
  { text: "New: an air dash restores the air slash.", drill: { restore: 1 } },
  { text: "New: a dash heals 1% HP.", drill: { heal: 0.01 } },
  { text: "New: the first blow after a dash +50%.", drill: { after: 0.5 } },
  { text: "Two more air dashes.", drill: { airDashes: 2 } },
  { text: "Blow after a dash +50% to +120%; a dash heals 2%.", drill: { after: 1.2, heal: 0.02 } },
  { text: "New: blows cannot touch you for 0.3 s after a dash.", drill: { guard: 0.3 } },
  { text: "Blow after a dash +120% to +300%.", drill: { after: 3 } },
]);

export const RESOLVE: SkillDef = {
  id: "al_resolve",
  name: "Resolve",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "L",
  pact: PACT.mending,
  text: "More air dashes, healing dashes and a harder blow after each dash.",
  levels: LEVELS,
  evolution: {
    partner: "al_sanctuary",
    name: "Unbroken",
    text: "Every dash lays burning dawn light where it ends.",
    row: evolvedRow(LEVELS[7], "Dashes lay burning dawn light.", {
      ...drillValues({ ground: 0.4 }),
      valor: 1,
      dome: 1,
    }),
  },
};
