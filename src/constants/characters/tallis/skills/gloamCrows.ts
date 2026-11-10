import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "15%: three crows dive at foes, 0.4x each.",
    values: { chance: 0.15, cooldown: 2, count: 3, power: 0.4, blind: 0, circle: 0, murder: 0 },
  },
  { text: "25% chance.", values: { chance: 0.25 } },
  { text: "Five crows.", values: { count: 5 } },
  { text: "Crows blind for 0.5 s.", values: { blind: 0.5 } },
  { text: "Crows deal 0.6x.", values: { power: 0.6 } },
  { text: "Crows circle him for 5 s and dive again.", values: { circle: 5 } },
  { text: "Crows deal 0.8x.", values: { power: 0.8 } },
  { text: "Crows deal 1.0x.", values: { power: 1 } },
]);

/** Gloam Crows. Design: docs/skills/tallis.md. Values: chance: chance a blow from behind sends them; cooldown: seconds between flocks; count: crows; power: attack damage each dive deals; blind: seconds a dive blinds its foe; circle: seconds they circle him after; murder: 1 every cast on I sends a flock (evolution) */
export const GLOAM_CROWS: SkillDef = {
  id: "t_crows",
  name: "Gloam Crows",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A blow from behind may send crows diving at foes.",
  levels: LEVELS,
  evolution: {
    partner: "t_needles",
    name: "Murder of Crows",
    text: "Every cast on I sends a flock as well.",
    row: evolvedRow(LEVELS[7], "Every cast on I sends a flock.", { murder: 1 }),
  },
};
