import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "25%: a wraith slashes for 4 s, 0.5x every 0.6 s.",
    values: { chance: 0.25, cooldown: 2, life: 4, power: 0.5, bleed: 0, blind: 0, wraiths: 1, burst: 0, legion: 0 },
  },
  { text: "40% chance.", values: { chance: 0.4 } },
  { text: "Wraith slashes bleed.", values: { bleed: 1 } },
  { text: "Wraiths fight for 6 s.", values: { life: 6 } },
  { text: "Slashes blind minions 0.5 s; 0.7x.", values: { power: 0.7, blind: 0.5 } },
  { text: "Two wraiths at once.", values: { wraiths: 2 } },
  { text: "A wraith bursts as it ends; 0.9x.", values: { power: 0.9, burst: 1 } },
  { text: "Slashes deal 1.2x.", values: { power: 1.2 } },
]);

/** Hollow Wraith. Design: docs/skills/tallis.md. Values: chance: chance a kill from behind raises one; cooldown: seconds between wraiths; life: seconds it fights; power: attack damage a slash deals; bleed: 1 its slashes bleed; blind: seconds a slash blinds a minion; burst: attack damage it bursts for as it ends, within 24 px; wraiths: wraiths that may stand at once; legion: 1 every kill from behind raises one, and its slashes bleed (evolution) */
export const HOLLOW_WRAITH: SkillDef = {
  id: "t_wraith",
  name: "Hollow Wraith",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A foe he fells from behind may rise as a wraith that fights for him.",
  levels: LEVELS,
  evolution: {
    partner: "t_openVeins",
    name: "Legion of Dusk",
    text: "Every kill from behind raises a wraith, and its slashes bleed.",
    row: evolvedRow(LEVELS[7], "Every kill from behind raises a wraith.", { legion: 1, wraiths: 4, cooldown: 0 }),
  },
};
