import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: each a share of the dome's own burn at the charge level: `power` the burns, `pull` the dome draws foes in, `cooldown` seconds, `charge` charging speed, `heal` share of max HP each burn heals, `time` seconds added, `pillars` a pillar falls on a foe inside at each burn, `size` multiplies its radius, `follow` the dome walks with him */
const LEVELS = levelRows([
  { text: "The dome draws foes in and burns 30% harder.", values: { power: 1.3, pull: 1 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: each burn heals you 2% HP.", values: { heal: 0.02 } },
  { text: "Dome burns +70%.", values: { power: 1.7 } },
  { text: "New: the dome stands 1.5 s longer.", values: { time: 1.5 } },
  { text: "New: a pillar falls on a foe inside at each burn.", values: { pillars: 1 } },
  { text: "New: the dome is 30% wider.", values: { size: 1.3 } },
  { text: "Dome burns +120%.", values: { power: 2.2 } },
]);

export const SANCTUARY: SkillDef = {
  id: "al_sanctuary",
  name: "Sanctuary",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: "Sanctuary grows: it draws foes in, heals you, lasts longer and calls pillars of light. Grows with attack damage.",
  levels: LEVELS,
  evolution: {
    partner: "al_resolve",
    name: "Dawn Citadel",
    text: "The dome walks with him, stands 3 s longer and is half again as wide.",
    row: evolvedRow(LEVELS[7], "The dome walks with you.", { follow: 1, time: 4.5, size: 1.5 }),
  },
};
