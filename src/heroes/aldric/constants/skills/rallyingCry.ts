import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";

/** values: `radius` of the ring, `power` ability power of its blow, `valor` Valor it gives, `recharge` seconds, `blind` seconds struck foes are blinded, `extend` seconds it adds to Radiance, `haste` faster string blows for 4 s, `mark` extra damage struck foes take for 4 s */
const LEVELS = levelRows([
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
  { text: "Ring power 1.6; 35 Valor; recharge 6 s.", values: { power: 1.6, valor: 35, recharge: 6 } },
]);

export const RALLYING_CRY: SkillDef = {
  id: "al_rally",
  name: "Rallying Cry",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A new ability: a shout that throws foes back in a ring and fills Valor. Held, a wider ring. Grows with ability power.",
  levels: LEVELS,
  evolution: {
    partner: "al_step",
    name: "War Cry",
    text: "The shout fills Valor to the full at once.",
    row: evolvedRow(LEVELS[7], "Fills Valor at once.", {}),
  },
};
