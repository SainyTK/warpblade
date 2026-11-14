import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values, each damage a share of the waltz's own blow at the charge level: `power` the cuts, `top` it fills Tempo,
 *  `cooldown` seconds, `charge` charging speed, `cuts` more cuts on each foe, `launch` its cuts throw foes up, `finale` a
 *  closing cross on every foe it struck, `untouch` seconds she cannot be touched after it, `twice` (evolved) it dances twice */
const LEVELS = levelRows([
  { text: "The waltz cuts 30% harder and fills Tempo.", values: { power: 1.3, top: 1 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: each foe takes 2 more cuts.", values: { cuts: 2, power: 1.45 } },
  { text: "Power +45% to +80%.", values: { power: 1.8 } },
  { text: "New: its cuts throw foes up.", values: { launch: 1 } },
  { text: "New: it closes with a cross on every foe it struck.", values: { finale: 0.6 } },
  { text: "New: you cannot be touched for 2 s after it.", values: { untouch: 2 } },
  { text: "Power +80% to +110%; 2 more cuts.", values: { power: 2.1, cuts: 4, finale: 0.9 } },
]);

export const DUSK_WALTZ: SkillDef = {
  id: "ve_waltz",
  name: "Dusk Waltz",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Dusk Waltz grows: more cuts on every foe, a launch, a closing cross, and Tempo filled. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Endless Waltz",
    text: "The waltz dances twice, and the second dance reaches every foe on the screen.",
    row: evolvedRow(LEVELS[7], "It dances twice, the second across the screen.", { twice: 1 }),
  },
};
