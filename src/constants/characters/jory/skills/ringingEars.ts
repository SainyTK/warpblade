import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Boom leaves 1 Ringing stack, 0.1x a beat.",
    values: { stacks: 1, ap: 0.1, slow: 0, taken: 0, blind: 0, wider: 0, roar: 0 },
  },
  { text: "2 stacks.", values: { stacks: 2 } },
  { text: "Ringing foes are slowed.", values: { slow: 1 } },
  { text: "0.16x.", values: { ap: 0.16 } },
  { text: "Ringing foes take 10% more.", values: { taken: 0.1 } },
  { text: "An on-beat Boom blinds them 0.5 s.", values: { blind: 0.5 } },
  { text: "Boom rings 20% wider.", values: { wider: 0.2 } },
  { text: "3 stacks, 0.26x.", values: { stacks: 3, ap: 0.26 } },
]);

/** Ringing Ears. Design: docs/skills/jory.md. Values: stacks: stacks a Boom lays; ap: ability power each stack deals on each beat; slow: seconds ringing foes are slowed; taken: share more ringing foes take from every source; blind: seconds an on-beat Boom blinds them; wider: share wider his Boom rings; roar: 1 an on-beat Boom consumes the Ringing for a burst (evolution) */
export const RINGING_EARS: SkillDef = {
  id: "j_eardrum",
  name: "Ringing Ears",
  kind: "dot",
  risk: "timed",
  button: "K",
  text: "Boom leaves Ringing on the foes it reaches, which hurts on each beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_echo",
    name: "Deafening Roar",
    text: "An on-beat Boom consumes the Ringing on every foe it reaches for a burst.",
    row: evolvedRow(LEVELS[7], "An on-beat Boom bursts the Ringing.", { roar: 1 }),
  },
};
