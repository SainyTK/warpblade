import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { bonus: 2, window: 0.1 } },
  { values: { window: 0.14 } },
  { values: { guardBreak: 1 } },
  { values: { wave: 1.5 } },
  { values: { bonus: 5 } },
  { values: { streak: 0.25, streakCap: 1 } },
  { values: { cleave: 3 } },
  { values: { bonus: 20, wave: 10 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The third slash deals +50%.", drill: { finisher: 0.5 } },
  { text: "Third slash +50% to +80%.", drill: { finisher: 0.8 } },
  { text: "New: the third slash staggers the foe.", drill: { stagger: 0.4 } },
  { text: "New: the third slash sends a crystal wave forward.", drill: { wave: 1 } },
  { text: "New: the second slash is a sure critical hit with an extra cut.", drill: { second: 0.4 } },
  { text: "Third slash +80% to +150%; the wave doubles.", drill: { finisher: 1.5, wave: 2 } },
  { text: "New: a second wave follows, a little higher.", drill: { twin: 1 } },
  { text: "Third slash +150% to +300%; the wave doubles again.", drill: { finisher: 3, wave: 4 } },
]);

export const KEEN_EDGE: SkillDef = {
  id: "k_keen",
  name: "Keen Edge",
  kind: "attack",
  element: "storm",
  risk: "precise",
  button: "J",
  text: "The third slash of the chain is Keen: it hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "k_phase",
    name: "Peerless Edge",
    text: "Every third finisher that lands throws a gold cross wave, and for 3 seconds every slash hits like the third.",
    row: evolvedRow(LEVELS[7], "Every 3rd finisher: a cross wave, then 3 s of finisher slashes.", {
      ...drillValues({ crossEvery: 3, free: 3, cross: 8 }),
      cross: 330,
      crossEvery: 3,
      free: 3,
    }),
  },
};
