import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of a moon's burst, `moons` moons a cast, `radius` the burst's reach, `recharge` seconds,
 *  `launch` the burst throws foes up, `glow` seconds a burst's glow burns; evolved, `pull` draws foes to each burst */
const LEVELS = levelRows([
  {
    text: "Learn Falling Moon: a crescent moon falls ahead and bursts.",
    values: { power: 2, moons: 1, radius: 26, recharge: 5 },
  },
  { text: "Burst 2 to 2.6.", values: { power: 2.6 } },
  { text: "New: two moons fall.", values: { moons: 2 } },
  { text: "New: the burst throws foes up; wider.", values: { launch: 1, radius: 32 } },
  { text: "New: the burst leaves a glow that burns 3 s.", values: { glow: 3 } },
  { text: "Burst 2.6 to 3.4; recharge 4.2 s.", values: { power: 3.4, recharge: 4.2 } },
  { text: "New: three moons fall.", values: { moons: 3 } },
  { text: "Burst 3.4 to 4.2; recharge 3.5 s.", values: { power: 4.2, recharge: 3.5 } },
]);

export const FALLING_MOON: SkillDef = {
  id: "ve_moon",
  name: "Falling Moon",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "An ability: crescent moons fall ahead of you and burst on the crowd.",
  levels: LEVELS,
  evolution: {
    partner: "ve_hex",
    name: "Eclipse",
    text: "Five moons fall in a wider row, and each burst draws foes in to its middle.",
    row: evolvedRow(LEVELS[7], "Five moons; each burst draws foes in.", { moons: 5, pull: 1, radius: 36 }),
  },
};
