import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `ring` added landing power (AD), `reach` added pixels each side, `waves` shockwaves both ways at this
 *  power (AD), `heft` Heft the landing gives, `launch` foes it strikes are thrown up, `pull` foes this close are
 *  dragged in first, `fissures` the landing cracks the floor both ways */
const LEVELS = levelRows([
  { text: "The falling slam lands 0.8 AD harder.", values: { ring: 0.8 } },
  { text: "Its ring reaches 12 px farther.", values: { reach: 12 } },
  { text: "New: the landing sends shockwaves both ways.", values: { waves: 0.8 } },
  { text: "Landing power +0.8 to +2.", values: { ring: 2 } },
  { text: "New: the landing gives 20 Heft.", values: { heft: 20 } },
  { text: "New: foes the landing strikes are thrown up.", values: { launch: 1 } },
  { text: "New: the landing drags foes within 60 px in to her first.", values: { pull: 60, reach: 24, waves: 2 } },
  { text: "Landing power +2 to +4.5; shockwaves +2 to +4.", values: { ring: 4.5, waves: 4 } },
]);

export const CRATER_LEAP: SkillDef = {
  id: "br_crater",
  name: "Crater Leap",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "The falling slam lands harder and wider, and sends shockwaves along the floor.",
  levels: LEVELS,
  evolution: {
    partner: "br_spin",
    name: "Star Crater",
    text: "Every falling slam splits the floor with fissures both ways.",
    row: evolvedRow(LEVELS[7], "The landing splits fissures both ways.", { fissures: 1 }),
  },
};
