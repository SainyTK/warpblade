import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cost` MP, `recharge` seconds, `power` ability power of the blast, `radius` pixels, `fuse` seconds before it blows on its own, `stun` seconds knocked down, `pull` draws foes in as it blows, `count` charges a cast, `echo` share of a second blast `echoDelay` seconds later */
const LEVELS = levelRows([
  {
    text: "Learn Blast Charge: a charge that blows when touched.",
    values: { cost: 13, recharge: 6, power: 3, radius: 34, fuse: 2.5 },
  },
  { text: "Blast 3 to 4.5.", values: { power: 4.5 } },
  { text: "New: the blast knocks foes down.", values: { stun: 0.6 } },
  { text: "New: the charge draws foes in as it blows.", values: { pull: 1 } },
  { text: "Blast 4.5 to 7; wider.", values: { power: 7, radius: 44 } },
  { text: "New: two charges a cast.", values: { count: 2 } },
  { text: "New: each charge blows again a moment later.", values: { echo: 0.6, echoDelay: 0.3 } },
  { text: "Blast 7 to 12.", values: { power: 12 } },
]);

export const BLAST_CHARGE: SkillDef = {
  id: "ca_charge",
  name: "Blast Charge",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn Blast Charge: a charge on the floor ahead blows when a foe touches it.",
  levels: LEVELS,
  evolution: {
    partner: "ca_tracer",
    name: "Demolition",
    text: "Every cast lays a row of charges, and each blast is far wider.",
    row: evolvedRow(LEVELS[7], "A row of charges; far wider blasts.", { radius: 60 }),
  },
};
