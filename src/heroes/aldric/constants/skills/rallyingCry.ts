import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";
import { drillValues, onDrill } from "./drillLevels";

/** values: `radius` of the ring, `power` ability power of its blow, `valor` Valor it gives, `recharge` seconds, `blind` seconds struck foes are blinded, `extend` seconds it adds to Radiance, `haste` faster string blows for 4 s, `mark` extra damage struck foes take for 4 s */
const NATIVE = levelRows([
  {
    text: `Shout: throw foes back and gain 15 Valor (${ABILITY_COST.rally} MP).`,
    values: { radius: 40, power: 0.8, valor: 15, recharge: 7 },
  },
  { text: "A wider ring.", values: { radius: 50 } },
  { text: "New: struck foes are blinded for 1.5 s.", values: { blind: 1.5 } },
  { text: "New: during Radiance it adds 2 s to it.", values: { extend: 2 } },
  { text: "Ring power 1.2; 22 Valor.", values: { power: 1.2, valor: 22 } },
  { text: "New: string blows 20% faster for 4 s.", values: { haste: 0.2 } },
  { text: "New: struck foes take 15% more for 4 s.", values: { mark: 0.15 } },
  { text: "Ring power 2.4; 35 Valor; recharge 6 s.", values: { power: 2.4, valor: 35, recharge: 6 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Sunpillar stuns 0.4 s longer.", drill: { stun: 0.4 } },
  { text: "New: a second pillar falls 24 px past the foe.", drill: { second: 1 } },
  { text: "Sunpillar strikes 0.6 ability power harder.", drill: { extra: 0.6 } },
  { text: "New: Sunpillar burns foes with light stacks.", drill: { burn: 0.2 } },
  { text: "Pillar 0.6 to 1.2 harder.", drill: { extra: 1.2 } },
  { text: "New: a third pillar falls before the foe.", drill: { third: 1 } },
  { text: "Stun 0.4 to 1 s longer.", drill: { stun: 1 } },
  { text: "Pillar 1.2 to 4 harder.", drill: { extra: 4 } },
]);

export const RALLYING_CRY: SkillDef = {
  id: "al_rally",
  name: "High Sun",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Sunpillar stuns longer, strikes harder, burns and falls in a row.",
  levels: LEVELS,
  evolution: {
    partner: "al_falcon",
    name: "Zenith",
    text: "Every pillar strikes twice.",
    row: evolvedRow(LEVELS[7], "Every pillar strikes twice.", {
      ...drillValues({ twice: 1 }),
    }),
  },
};
