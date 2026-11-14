import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `valor` share more Valor from every deed, `radiance` seconds added to Radiance, `heal` share of max HP each blow heals during Radiance, `mp` MP a block gives, `haste` faster string blows during Radiance, `barrier` kindling Radiance raises Bulwark, `dome` kindling Radiance raises a small Sanctuary */
const LEVELS = levelRows([
  { text: "Valor +20%; HP +10.", values: { valor: 0.2 }, stats: { hp: 10 } },
  { text: "Radiance lasts 1 s longer.", values: { radiance: 1 } },
  { text: "New: blows during Radiance heal 1% HP.", values: { heal: 0.01 } },
  { text: "New: each block gives 2 MP.", values: { mp: 2 } },
  { text: "Valor +40%; HP +25.", values: { valor: 0.4 }, stats: { hp: 25 } },
  { text: "New: string blows 15% faster during Radiance.", values: { haste: 0.15 } },
  { text: "New: kindling Radiance raises Bulwark.", values: { barrier: 1 } },
  { text: "Radiance lasts 2 s longer; HP +40.", values: { radiance: 2 }, stats: { hp: 40 } },
]);

export const RESOLVE: SkillDef = {
  id: "al_resolve",
  name: "Resolve",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Valor fills faster, Radiance lasts longer, and you have more HP.",
  levels: LEVELS,
  evolution: {
    partner: "al_sanctuary",
    name: "Unbroken",
    text: "Valor fills twice as fast, and kindling Radiance raises a small Sanctuary round him.",
    row: evolvedRow(LEVELS[7], "Valor twice as fast; Radiance raises a dome.", { valor: 1, dome: 1 }),
  },
};
