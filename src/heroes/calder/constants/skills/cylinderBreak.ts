import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Charged skills +30%.", drill: { tier: 0.3 } },
  { text: "New: charge 15% faster.", drill: { rate: 0.15 } },
  { text: "New: each charged skill fires an extra hot round.", drill: { rounds: 1 } },
  { text: "Charged skills +30% to +80%.", drill: { tier: 0.8 } },
  { text: "New: charged skills reach 25% farther.", drill: { reach: 0.25 } },
  { text: "Charged skills +150%; charge 30% faster.", drill: { tier: 1.5, rate: 0.3 } },
  { text: "New: charged skills stagger every foe they reach.", drill: { stagger: 0.8 } },
  { text: "Charged skills +80% to +250%; three rounds.", drill: { tier: 2.5, rounds: 3 } },
]);

export const CYLINDER_BREAK: SkillDef = {
  id: "ca_break",
  name: "Cylinder Break",
  kind: "ultimate",
  element: "blaze",
  risk: "easy",
  button: "U",
  text: "Breach Cut, Buckshot Wall, Green Line and Cylinder Break, the four charged skills on held J, hit harder.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_trigger",
    name: "Last Cylinder",
    text: "Every charged skill bursts twice more into every foe it reached.",
    row: evolvedRow(DRILL_LEVELS[7], "Charged skills burst twice more.", {
      ...drillValues({ echo: 2 }),
      cuts: 13,
      finale: 14,
      power: 2.2,
    }),
  },
};
