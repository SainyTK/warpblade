import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "20%: a shade stabs the nearest foe 3 times from behind, 0.5x.",
    values: { chance: 0.2, stabs: 3, power: 0.5, linger: 0, shades: 1, twoMoons: 0 },
  },
  { text: "35% chance.", values: { chance: 0.35 } },
  { text: "Four stabs.", values: { stabs: 4 } },
  { text: "The shade lingers 3 s.", values: { linger: 3 } },
  { text: "Stabs deal 0.7x.", values: { power: 0.7 } },
  { text: "Two shades.", values: { shades: 2 } },
  { text: "Stabs deal 0.9x.", values: { power: 0.9 } },
  { text: "55% chance.", values: { chance: 0.55 } },
]);

/** Shadow Double. Design: docs/skills/tallis.md. Values: chance: chance a perfect dodge or a rise calls it; stabs: stabs it strikes; power: attack damage a stab deals, from behind; linger: seconds it stays after, stabbing again; shades: shades called; twoMoons: 1 every rise calls one (evolution) */
export const SHADOW_DOUBLE: SkillDef = {
  id: "t_double",
  name: "Shadow Double",
  kind: "summon",
  risk: "timed",
  button: "L",
  text: "A perfect dodge or a rise may call a shade of him behind the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "t_sink",
    name: "Two Moons",
    text: "Every rise from the pool leaves a shade behind the nearest foe.",
    row: evolvedRow(LEVELS[7], "Every rise calls a shade.", { twoMoons: 1 }),
  },
};
