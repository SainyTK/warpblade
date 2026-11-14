import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: values, damage a share of the run's own cut: `power` each cut, `pull` cuts draw foes in, `cooldown` seconds, `charge` charging speed, `cuts` more cuts, `finale` the breaching shot across the screen, `hot` every cut is a hot round */
const LEVELS = levelRows([
  { text: "Cuts hit 30% harder and draw foes in.", values: { power: 1.3, pull: 1 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: two more cuts.", values: { cuts: 2 } },
  { text: "New: the run ends in a breaching shot across the screen.", values: { finale: 3 } },
  { text: "Cut power +30% to +40%.", values: { power: 1.4 } },
  { text: "New: every cut is a hot round.", values: { hot: 1 } },
  { text: "New: four more cuts; the shot hits harder.", values: { cuts: 4, finale: 5 } },
  { text: "Cut power +40% to +50%; the shot hits far harder.", values: { power: 1.5, finale: 6 } },
]);

export const CYLINDER_BREAK: SkillDef = {
  id: "ca_break",
  name: "Cylinder Break",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Cylinder Break grows: more cuts, foes drawn in, and a breaching shot to end the run. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "ca_trigger",
    name: "Last Cylinder",
    text: "The run goes on through a second cylinder: twice the cuts, and the shot hits far harder.",
    row: evolvedRow(LEVELS[7], "Twice the cuts; a far harder shot.", { cuts: 13, finale: 14, power: 2.2 }),
  },
};
