import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Boom and Counterbeat leave 1 Ringing stack, 0.1x a beat.",
    values: { stacks: 1, ap: 0.1, slow: 0, block: 0, taken: 0, blind: 0, wider: 0, roar: 0 },
  },
  { text: "2 stacks.", values: { stacks: 2 } },
  { text: "Ringing foes are slowed.", values: { slow: 1 } },
  { text: "A blow blocked on his drum rings its attacker; 0.16x.", values: { block: 1, ap: 0.16 } },
  { text: "Ringing foes take 10% more.", values: { taken: 0.1 } },
  { text: "An on-beat Boom or Counterbeat blinds them 0.5 s.", values: { blind: 0.5 } },
  { text: "Boom and Counterbeat ring 20% wider.", values: { wider: 0.2 } },
  { text: "3 stacks, 0.26x.", values: { stacks: 3, ap: 0.26 } },
]);

/** Ringing Ears. Design: docs/skills/jory.md. Values: stacks: stacks a Boom or Counterbeat lays; ap: ability power each stack deals on each beat; slow: seconds ringing foes are slowed; block: 1 a blow blocked on his drum lays a stack on its attacker; taken: share more ringing foes take from every source; blind: seconds an on-beat Boom or Counterbeat blinds them; wider: share wider his Boom and Counterbeat ring; roar: 1 an on-beat Boom or Counterbeat consumes the Ringing for a burst (evolution) */
export const RINGING_EARS: SkillDef = {
  id: "j_eardrum",
  name: "Ringing Ears",
  kind: "dot",
  risk: "timed",
  button: "K",
  text: "Boom and Counterbeat leave Ringing on the foes they reach, which hurts on each beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_echo",
    name: "Deafening Roar",
    text: "An on-beat Boom or Counterbeat consumes the Ringing on every foe it reaches for a burst.",
    row: evolvedRow(LEVELS[7], "An on-beat Boom or Counterbeat bursts the Ringing.", { roar: 1 }),
  },
};
