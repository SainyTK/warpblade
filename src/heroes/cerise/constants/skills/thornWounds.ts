import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `damage` AD a tick per stack, `max` stacks, `duration` seconds, `lungeStacks` the lunge lays,
 *  `taken` added damage a bleeding foe takes, `riposteStacks` a riposte link lays, `halt` seconds a thorn holds a walker's feet; evolved `burst` AD per stack the
 *  lunge tears out */
const NATIVE = levelRows([
  { text: "Thrusts leave a bleeding thorn: 0.1 AD a tick, up to 4.", values: { damage: 0.1, max: 4, duration: 3 } },
  { text: "Up to 4 to 6 thorns.", values: { max: 6 } },
  { text: "New: the lunge leaves 3 thorns.", values: { lungeStacks: 3 } },
  { text: "Thorns 0.1 to 0.25 AD a tick.", values: { damage: 0.25 } },
  { text: "New: bleeding foes take +15% from every source.", values: { taken: 0.15 } },
  { text: "New: riposte links leave 2 thorns.", values: { riposteStacks: 2 } },
  {
    text: "The lunge bursts every thorn in its foe for 1 AD each.",
    values: { max: 10, duration: 5, halt: 0.4 },
  },
  { text: "Thorns 0.25 to 0.7 AD a tick.", values: { damage: 0.7 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Thrusts leave a bleeding thorn: 0.1 AD a tick, up to 4.", drill: { damage: 0.1, max: 4, lunge: 1 } },
  { text: "Up to 4 to 6 thorns.", drill: { max: 6 } },
  { text: "New: the lunge leaves 3 thorns.", drill: { lunge: 3 } },
  { text: "Thorns 0.1 to 0.2 AD.", drill: { damage: 0.2 } },
  { text: "New: Rose Edge hits leave 2 more thorns.", drill: { infused: 2 } },
  { text: "Up to 8 thorns; 0.3 AD.", drill: { max: 8, damage: 0.3 } },
  { text: "New: the lunge leaves 5 thorns.", drill: { lunge: 5 } },
  { text: "Thorns 0.3 to 0.6 AD.", drill: { damage: 0.6 } },
]);

export const THORN_WOUNDS: SkillDef = {
  id: "ce_thorns",
  name: "Thorn Wounds",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Thrusts leave bleeding thorns.",
  levels: LEVELS,
  evolution: {
    partner: "ce_pin",
    name: "Thorn Burst",
    text: "The lunge tears every thorn out at once for 1 AD each.",
    row: evolvedRow(LEVELS[7], "The lunge bursts thorns, 1 AD each.", {
      ...drillValues({ burst: 1 }),
      burst: 2.5,
    }),
  },
};
