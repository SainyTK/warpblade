import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

/** values: `cost` MP, `recharge` seconds, `power` ability power of the blast, `radius` pixels, `fuse` seconds before it blows on its own, `stun` seconds knocked down, `pull` draws foes in as it blows, `count` charges a cast, `echo` share of a second blast `echoDelay` seconds later */
const LEVELS = levelRows([
  {
    text: "The blast throws four hot rounds round it.",
    values: { cost: 13, recharge: 6, power: 1.5, radius: 34, fuse: 1.5 },
  },
  { text: "Blast 1.5 to 2.2.", values: { power: 2.2 } },
  { text: "New: the blast knocks foes down.", values: { stun: 0.6 } },
  { text: "New: the charge draws foes in as it blows.", values: { pull: 1 } },
  { text: "Blast 2.2 to 3.5; wider.", values: { power: 3.5, radius: 44 } },
  { text: "New: two charges a cast.", values: { count: 2 } },
  { text: "New: each charge blows again a moment later.", values: { echo: 0.6, echoDelay: 0.3 } },
  { text: "Blast 3.5 to 6.", values: { power: 6 } },
]);

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Blast Charge +50% and throws foes.", drill: { bonus: 0.5 } },
  { text: "New: the blast breaks guards.", drill: { heavy: 1 } },
  { text: "New: a second charge sticks to another foe.", drill: { second: 1 } },
  { text: "Blast Charge +50% to +120%.", drill: { bonus: 1.2 } },
  { text: "New: staggers for 1 s.", drill: { stagger: 1 } },
  { text: "Blast Charge +120% to +250%.", drill: { bonus: 2.5 } },
  { text: "New: cuts with Blast Charge loaded plant a small charge.", drill: { plant: 0.6 } },
  { text: "Blast Charge +250% to +500%.", drill: { bonus: 5 } },
]);

export const BLAST_CHARGE: SkillDef = {
  id: "ca_charge",
  name: "Blast Charge",
  kind: "spell",
  element: "blaze",
  risk: "timed",
  button: "I",
  text: "Blast Charge hits harder and throws foes.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_tracer",
    name: "Demolition",
    text: "Every cast lays a row of charges, and each blast is far wider.",
    row: evolvedRow(DRILL_LEVELS[7], "The blast throws four hot rounds.", {
      ...drillValues({ rounds: 4 }),
      radius: 60,
    }),
  },
};
