import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `burn` ability power a second to foes standing in it, `width` px, `time` seconds, `rush` Shield Rush leaves it too, `halt` holds foes' feet, `crest` Crest breaker leaves it too, `heal` share of max HP a second while he stands in it, `pulse` ability power of a pillar it calls each second */
const LEVELS = levelRows([
  { text: "Sunpillar leaves burning light for 2 s.", values: { burn: 0.3, width: 18, time: 2 } },
  { text: "It burns harder.", values: { burn: 0.45 } },
  { text: "New: Shield Rush leaves it where it ends.", values: { rush: 1 } },
  { text: "New: it holds the feet of foes in it.", values: { halt: 1 } },
  { text: "It lasts 3 s and spreads wider.", values: { time: 3, width: 24 } },
  { text: "New: Crest breaker leaves it too.", values: { crest: 1 } },
  { text: "New: standing in it heals you 1% HP a second.", values: { heal: 0.01 } },
  { text: "It burns almost five times as hard as at first.", values: { burn: 1.4 } },
]);

export const LINGERING_DAWN: SkillDef = {
  id: "al_dawn",
  name: "Lingering Dawn",
  kind: "dot",
  risk: "easy",
  button: "I",
  text: "Sunpillar leaves burning light on the floor where it falls. Grows with ability power.",
  levels: LEVELS,
  evolution: {
    partner: "al_falcon",
    name: "High Noon",
    text: "The burning light calls a small pillar on a foe in it every second.",
    row: evolvedRow(LEVELS[7], "Calls a pillar each second.", { pulse: 1 }),
  },
};
