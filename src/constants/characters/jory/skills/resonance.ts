import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "His blows add Resonance, up to 3, 0.06x a beat each.",
    values: { max: 3, ap: 0.06, double: 0, slow: 0, sympathy: 0 },
  },
  { text: "0.09x.", values: { ap: 0.09 } },
  { text: "Up to 5 stacks.", values: { max: 5 } },
  { text: "0.13x.", values: { ap: 0.13 } },
  { text: "Accents add two stacks.", values: { double: 1 } },
  { text: "Resonating foes are slowed; 0.18x.", values: { slow: 0.6, ap: 0.18 } },
  { text: "Up to 7 stacks.", values: { max: 7 } },
  { text: "0.26x.", values: { ap: 0.26 } },
]);

/** Resonance. Design: docs/skills/jory.md. Values: max: most stacks on a foe; ap: ability power each stack deals on each beat; double: 1 an Accent adds two stacks; slow: seconds a foe is slowed when stacks are laid; sympathy: 1 each Accent spreads the stacks to foes within 40 px (evolution) */
export const RESONANCE: SkillDef = {
  id: "j_resonance",
  name: "Resonance",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "His blows leave Resonance on foes, which hums on each beat for ability power.",
  levels: LEVELS,
  evolution: {
    partner: "j_gong",
    name: "Sympathy",
    text: "Each Accent spreads the Resonance on its foe to every foe within 40 px.",
    row: evolvedRow(LEVELS[7], "Accents spread Resonance 40 px.", { sympathy: 1 }),
  },
};
