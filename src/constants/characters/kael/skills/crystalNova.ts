import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ULT_CHARGE } from "../../../ultimate";

/** values, each damage a share of the nova ring's own blow at the charge level: `power` the ring, `pull` the ring draws
 *  foes in, `cooldown` seconds, `charge` charging speed, `phantoms` foes a phantom cuts and `phantom` each of its three
 *  cuts, `stars` stars on each foe struck and `star` each, `edges` cuts of the storm on each foe struck and `edge` each,
 *  `echo` a second wider ring, `echoes` how many, `follow` seconds the storm of edges stays round Kael */
const LEVELS = levelRows([
  { text: "The nova draws foes in to Kael and bursts 30% harder.", values: { power: 1.3, pull: 1 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: phantoms of Kael cut 2 struck foes from behind.", values: { phantoms: 2, phantom: 0.35 } },
  { text: "Nova power +30% to +70%.", values: { power: 1.7 } },
  { text: "New: crystal stars fall on each foe it strikes.", values: { stars: 2, star: 0.5 } },
  { text: "New: a storm of edges cuts every foe it struck.", values: { edges: 5, edge: 0.15 } },
  { text: "New: an echo nova bursts again, wider; 4 phantoms.", values: { echo: 0.5, echoes: 1, phantoms: 4 } },
  { text: "Nova power +70% to +100%; 3 stars; phantoms cut harder.", values: { power: 2, stars: 3, phantom: 0.45 } },
]);

export const CRYSTAL_NOVA: SkillDef = {
  id: "k_nova",
  name: "Crystal Nova",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Crystal Nova grows: it draws foes in, then phantoms, falling stars and a storm of edges join it. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "k_keen",
    name: "Supernova",
    text: "The nova bursts three times, each ring wider, and its storm of edges follows Kael for 4 seconds; every Keen blow in it adds a volley.",
    row: evolvedRow(LEVELS[7], "Three full bursts; the storm follows you for 4 s.", {
      echo: 1,
      echoes: 2,
      follow: 4,
    }),
  },
};
