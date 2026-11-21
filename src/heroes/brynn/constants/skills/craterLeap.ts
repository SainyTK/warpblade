import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The falling slam lands 0.8 AD harder.", values: { ring: 0.8 } },
    { text: "Its ring reaches 12 px farther.", values: { reach: 12 } },
    { text: "New: the landing sends shockwaves both ways.", values: { waves: 0.8 } },
    { text: "Landing power +0.8 to +2.", values: { ring: 2 } },
    { text: "New: the landing gives 20 Heft.", values: { heft: 20 } },
    { text: "New: foes the landing strikes are thrown up.", values: { launch: 1 } },
    { text: "New: the landing drags foes within 60 px in to her first.", values: { pull: 60, reach: 24, waves: 2 } },
    { text: "Landing power +2 to +4.5; shockwaves +2 to +4.", values: { ring: 4.5, waves: 4 } },
  ],
  [
    { text: "Landing from a fall rings foes near her for 0.8 AD.", drill: { ring: 0.8, radius: 30 } },
    { text: "New: a wall kick shoves foes near the wall for 0.6 AD.", drill: { kick: 0.6 } },
    { text: "New: one more air dash.", drill: { airDashes: 1 } },
    { text: "Landing ring 0.8 to 1.6 AD.", drill: { ring: 1.6 } },
    { text: "New: one more air slash per jump.", drill: { airSlashes: 1 } },
    { text: "The ring reaches 44 px.", drill: { radius: 44 } },
    { text: "New: the ring throws foes up.", drill: { launch: 1 } },
    { text: "Landing ring 1.6 to 4 AD.", drill: { ring: 4 } },
  ],
);

export const CRATER_LEAP: SkillDef = {
  id: "br_crater",
  name: "Crater Leap",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "A hard landing from a jump craters the floor round her.",
  levels: LEVELS,
  evolution: {
    partner: "br_spin",
    name: "Crater Pull",
    text: "The landing drags foes in and splits fissures both ways.",
    row: evolvedRow(LEVELS[7], "The landing drags foes in and splits fissures.", {
      ...drillValues({ fissure: 2 }),
      fissures: 1,
    }),
  },
};
