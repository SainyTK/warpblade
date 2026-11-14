import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added damage share on every spin, `reach` spin reach multiple, `crescent` attack damage of each sand crescent a spin's last blow throws out both sides, `pull` the cyclone draws foes in first, `pierce` crescents pass through every foe */
const LEVELS = levelRows([
  { text: "Spins deal 15% more.", values: { bonus: 0.15 } },
  { text: "Spins +15% to +30%.", values: { bonus: 0.3 } },
  { text: "New: each spin throws a sand crescent out both sides.", values: { crescent: 0.35 } },
  { text: "New: spins reach 20% farther.", values: { reach: 1.2 } },
  { text: "Spins +30% to +35%; crescents 0.35 to 0.4.", values: { bonus: 0.35, crescent: 0.4 } },
  { text: "New: the cyclone pulls foes in before it throws them up.", values: { pull: 1 } },
  { text: "New: crescents pierce every foe in their way.", values: { pierce: 1 } },
  { text: "Spins +35% to +45%; crescents 0.4 to 0.5.", values: { bonus: 0.45, crescent: 0.5 } },
]);

export const WHIRLING_EDGE: SkillDef = {
  id: "za_whirling",
  name: "Whirling Edge",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Your spins hit harder and reach farther, then throw sand crescents out both sides.",
  levels: LEVELS,
  evolution: {
    partner: "za_unbroken",
    name: "Endless Turn",
    text: "At full Whirl every spin throws two crescents each way, and while you spin the ring never drops below its first turn.",
    row: evolvedRow(LEVELS[7], "Two crescents each way at full Whirl; the ring holds while you spin.", {
      double: 1,
      hold: 1,
    }),
  },
};
