import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `power` share of the storm and the lunge, `cooldown` seconds, `charge` charging speed, `thrusts` more in the
 *  storm, `mark` the storm marks, `reach` share of the streak's reach, `behind` a streak behind her at this share,
 *  `lunge` added share of the lunge's own blow; evolved `finale` share of the level's power the ring of thrusts deals */
const NATIVE = levelRows([
  { text: "Rose Tempest deals +40% damage.", values: { power: 1.4 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: the storm sets the Rose mark on every foe it strikes.", values: { mark: 1 } },
  { text: "New: 6 more thrusts in the storm.", values: { thrusts: 6 } },
  { text: "Power +40% to +120%.", values: { power: 2.2 } },
  { text: "New: a second streak runs behind you.", values: { behind: 0.6 } },
  { text: "New: the streak reaches half again as far; the lunge +50%.", values: { reach: 1.5, lunge: 1.5 } },
  { text: "Power +120% to +400%.", values: { power: 5 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Charged skills +30%.", drill: { tier: 0.3 } },
  { text: "New: charged skills set the Rose mark on every foe in reach.", drill: { mark: 1 } },
  { text: "Charge 25% faster.", drill: { charge: 0.25 } },
  { text: "Charged skills +30% to +80%.", drill: { tier: 0.8 } },
  { text: "New: an echo streak follows each charged skill at 30%.", drill: { echo: 0.3 } },
  { text: "New: charged skills draw foes 30 px in; reach +20%.", drill: { pull: 30, reach: 0.2 } },
  { text: "Charged skills +80% to +150%.", drill: { tier: 1.5 } },
  { text: "Charged skills +150% to +250%; echo 60%.", drill: { tier: 2.5, echo: 0.6 } },
]);

export const ROSE_TEMPEST: SkillDef = {
  id: "ce_tempest",
  name: "Rose Tempest",
  kind: "ultimate",
  element: "venom",
  risk: "easy",
  button: "J",
  text: "The four Rose Tempest charged skills on held J hit harder.",
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Rose Storm",
    text: "Every charged skill sends four more streaks, two each way.",
    row: evolvedRow(LEVELS[7], "Each charged skill: four more streaks.", {
      ...drillValues({ storm: 1 }),
      finale: 6,
      power: 6,
    }),
  },
};
