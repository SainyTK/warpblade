import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: each a share of the dome's own burn at the charge level: `power` the burns, `pull` the dome draws foes in, `cooldown` seconds, `charge` charging speed, `heal` share of max HP each burn heals, `time` seconds added, `pillars` a pillar falls on a foe inside at each burn, `size` multiplies its radius, `follow` the dome walks with him */
const NATIVE = levelRows([
  { text: "The dome draws foes in and burns 30% harder.", values: { power: 1.3, pull: 1 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: each burn heals you 2% HP.", values: { heal: 0.02 } },
  { text: "Dome burns +70%.", values: { power: 1.7 } },
  { text: "New: the dome stands 1.5 s longer.", values: { time: 1.5 } },
  { text: "New: a pillar falls on a foe inside at each burn.", values: { pillars: 1 } },
  { text: "New: the dome is 30% wider.", values: { size: 1.3 } },
  { text: "Dome burns +120%.", values: { power: 2.2 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Charged skills +30%.", drill: { tier: 0.3 } },
  { text: "New: charged skills draw foes in.", drill: { pull: 120 } },
  { text: "Charge 20% faster.", drill: { charge: 0.2 } },
  { text: "Charged skills +30% to +80%.", drill: { tier: 0.8 } },
  { text: "New: an echo strikes again for 40%.", drill: { echo: 0.4 } },
  { text: "Charged skills reach 25% farther.", drill: { reach: 0.25 } },
  { text: "New: each charged skill heals 4% HP.", drill: { heal: 0.04 } },
  { text: "Charged skills +80% to +250%.", drill: { tier: 2.5 } },
]);

export const SANCTUARY: SkillDef = {
  id: "al_sanctuary",
  name: "Sanctuary",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: "The four charged skills hit harder, draw foes in, charge faster and echo.",
  levels: LEVELS,
  evolution: {
    partner: "al_resolve",
    name: "Dawn Citadel",
    text: "Every charged skill bursts twice more.",
    row: evolvedRow(LEVELS[7], "Every charged skill bursts twice more.", {
      ...drillValues({ burst: 0.5 }),
      follow: 1,
      time: 4.5,
      size: 1.5,
    }),
  },
};
