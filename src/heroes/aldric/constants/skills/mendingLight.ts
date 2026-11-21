import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";
import { drillValues, onDrill } from "./drillLevels";

/** values: `heal` share of max HP healed, `ring` radius, `power` ability power of the ring, `recharge` seconds, `barrier` raises Bulwark, `valor` Valor it gives, `regen` share of max HP healed each second for 3 s, `stun` seconds the ring knocks foes down */
const NATIVE = levelRows([
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

const LEVELS = onDrill(NATIVE, [
  { text: "Mending Light heals 1% more HP for each foe it strikes.", drill: { heal: 0.01 } },
  { text: "New: the light pushes foes away.", drill: { knock: 110 } },
  { text: "New: it leaves burning dawn light for 2 s.", drill: { ground: 0.25, time: 2 } },
  { text: "New: its blast strikes 0.8 ability power harder.", drill: { extra: 0.8 } },
  { text: "Heals 2.5% more per foe.", drill: { heal: 0.025 } },
  { text: "Blast 0.8 to 1.8 harder.", drill: { extra: 1.8 } },
  { text: "New: the burning light lasts 4 s.", drill: { time: 4 } },
  { text: "Blast 1.8 to 4 harder.", drill: { extra: 4 } },
]);

export const MENDING_LIGHT: SkillDef = {
  id: "al_mend",
  name: "Mending Light",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Mending Light heals more, pushes foes away and leaves burning light.",
  levels: LEVELS,
  evolution: {
    partner: "al_penance",
    name: "Absolution",
    text: "Mending Light lays full Penance on every foe it strikes.",
    row: evolvedRow(LEVELS[7], "The light lays full Penance.", {
      ...drillValues({ penance: 8 }),
    }),
  },
};
