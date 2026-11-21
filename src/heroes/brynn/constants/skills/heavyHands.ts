import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "Keen blows deal +150% to the foe they hit first.", values: { bonus: 1.5 } },
    { text: "The Keen beat lasts 0.14 to 0.18 s.", values: { window: 0.18 } },
    { text: "New: the crescent off a Keen blow flies farther and hits harder.", values: { wave: 0.6, waveReach: 0.5 } },
    { text: "New: a Keen blow gives 10 more Heft.", values: { heft: 10 } },
    { text: "Heavy bonus +150% to +350%.", values: { bonus: 3.5 } },
    {
      text: "Every air slash drops a quake on the floor below her.",
      values: { streak: 0.3, streakCap: 0.9 },
    },
    { text: "New: a Keen slam is a fissure from half Heft.", values: { halfFissure: 1 } },
    { text: "Heavy bonus +350% to +2000%; the crescent hits far harder.", values: { bonus: 20, wave: 4 } },
  ],
  [
    { text: "The air slash cuts for an extra 0.4 AD.", drill: { cut: 0.4 } },
    { text: "New: one more air slash per jump.", drill: { airSlashes: 1 } },
    { text: "New: the air slash spikes foes into the floor.", drill: { spike: 1 } },
    { text: "Extra cut 0.4 to 0.9 AD.", drill: { cut: 0.9 } },
    { text: "New: after an air slash, landing rings the floor for 1 AD.", drill: { ring: 1 } },
    { text: "Extra cut 0.9 to 1.6 AD.", drill: { cut: 1.6 } },
    { text: "New: two more air slashes per jump.", drill: { airSlashes: 2 } },
    { text: "Extra cut 1.6 to 3.5 AD; the landing ring 3 AD.", drill: { cut: 3.5, ring: 3 } },
  ],
);

export const HEAVY_HANDS: SkillDef = {
  id: "br_heavy",
  name: "Heavy Hands",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "The air slash, Falling Slam, hits harder and comes more often.",
  levels: LEVELS,
  evolution: {
    partner: "br_slam",
    name: "Meteor Hands",
    text: "Every Keen blow also splits the floor with a fissure ahead of her.",
    row: evolvedRow(LEVELS[7], "Every air slash quakes the floor below.", {
      ...drillValues({ quake: 1.5 }),
      heavyFissure: 0.8,
      bonus: 30,
    }),
  },
};
