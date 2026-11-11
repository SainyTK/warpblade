import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "20%: a horn-bearer sounds an 80 px cone, 0.5x.",
    values: { chance: 0.2, cooldown: 4, power: 0.5, cone: 80, blasts: 1, slow: 0, knock: 0, herald: 0 },
  },
  { text: "30% chance.", values: { chance: 0.3 } },
  { text: "It sounds twice.", values: { blasts: 2 } },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "Its blasts slow foes for 1 s.", values: { slow: 1 } },
  { text: "45% chance; a 110 px cone.", values: { chance: 0.45, cone: 110 } },
  { text: "The cone knocks minions down.", values: { knock: 1 } },
  { text: "1.2x; three blasts.", values: { power: 1.2, blasts: 3 } },
]);

/** War Horn. Design: docs/skills/jory.md. Values: chance: chance a kill calls one; cooldown: seconds between calls; power: attack damage of each blast; cone: pixels the cone reaches; blasts: blasts it sounds, one a beat; slow: seconds a blast slows foes; knock: 1 the cone knocks minions down; herald: 1 a herald stays and every 8th beat sounds both ways (evolution) */
export const WAR_HORN: SkillDef = {
  id: "j_horn",
  name: "War Horn",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A kill may call a ghostly horn-bearer who sounds a cone of sound.",
  levels: LEVELS,
  evolution: {
    partner: "j_crashWave",
    name: "Herald",
    text: "A herald stays with him and sounds both ways on every 8th beat.",
    row: evolvedRow(LEVELS[7], "A herald sounds both ways every 8th beat.", { herald: 1 }),
  },
};
