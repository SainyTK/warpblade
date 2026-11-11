import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "22 MP: an 80 px dome for 8 beats repeats 30% of his last blow.",
    values: { mp: 22, cooldown: 10, radius: 80, beats: 8, share: 0.3, follow: 0, slow: 0, cathedral: 0 },
  },
  { text: "40%.", values: { share: 0.4 } },
  { text: "The dome follows him.", values: { follow: 1 } },
  { text: "50%.", values: { share: 0.5 } },
  { text: "A 100 px dome.", values: { radius: 100 } },
  { text: "Foes inside are slowed.", values: { slow: 0.5 } },
  { text: "65%.", values: { share: 0.65 } },
  { text: "80%; 10 beats.", values: { share: 0.8, beats: 10 } },
]);

/** Echo Chamber. Design: docs/skills/jory.md. Values: mp: MP; cooldown: seconds; radius: pixels the dome reaches; beats: beats it stands; share: share of his last landed blow it repeats; follow: 1 the dome follows him; slow: seconds foes inside are slowed; cathedral: 1 140 px, 16 beats, and it repeats his last two blows (evolution) */
export const ECHO_CHAMBER: SkillDef = {
  id: "j_echo",
  name: "Echo Chamber",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A spell on I: a dome of sound at his feet; on each beat, foes inside take a share of his last blow again.",
  levels: LEVELS,
  evolution: {
    partner: "j_eardrum",
    name: "Cathedral",
    text: "A 140 px dome for 16 beats that repeats his last two blows.",
    row: evolvedRow(LEVELS[7], "140 px, 16 beats, his last two blows.", { cathedral: 1, radius: 140, beats: 16 }),
  },
};
