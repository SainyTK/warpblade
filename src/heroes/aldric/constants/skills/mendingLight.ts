import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";

/** values: `heal` share of max HP healed, `ring` radius, `power` ability power of the ring, `recharge` seconds, `barrier` raises Bulwark, `valor` Valor it gives, `regen` share of max HP healed each second for 3 s, `stun` seconds the ring knocks foes down */
const LEVELS = levelRows([
  {
    text: `Heal 8% HP and burn foes around you (${ABILITY_COST.mend} MP).`,
    values: { heal: 0.08, ring: 34, power: 0.8, recharge: 9 },
  },
  { text: "Heal 8% to 10%.", values: { heal: 0.1 } },
  { text: "New: it raises Bulwark.", values: { barrier: 1 } },
  { text: "New: it gives 20 Valor.", values: { valor: 20 } },
  { text: "A wider, stronger ring.", values: { ring: 44, power: 1.2 } },
  { text: "New: heals 2% HP a second for 3 s more.", values: { regen: 0.02 } },
  { text: "New: the ring knocks foes down.", values: { stun: 0.8 } },
  { text: "Heal 15%; ring power 1.6; recharge 7 s.", values: { heal: 0.15, power: 1.6, recharge: 7 } },
]);

export const MENDING_LIGHT: SkillDef = {
  id: "al_mend",
  name: "Mending Light",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A new ability: heal, and a ring of light burns the foes around you. Held, more of both. Grows with ability power.",
  levels: LEVELS,
  evolution: {
    partner: "al_penance",
    name: "Absolution",
    text: "The ring lays Penance on every foe it burns.",
    row: evolvedRow(LEVELS[7], "The ring lays Penance.", {}),
  },
};
