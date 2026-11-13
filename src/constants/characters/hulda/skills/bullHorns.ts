import type { SkillDef } from "../../../../types/skill";

/** Bull Horns. Design: docs/skills/hulda.md. Values: carry: foes on the shoulder; slam: attack damage of the slam on each; ring: radius of the slam's ring (0 none); ringPower; time: seconds the rush runs; shove: 1 pushes big foes along into the slam; launch: 1 the slam throws minions up; armour: share of a blow taken in the rush (evolution: 0); crater: power of the evolved crater */
export const BULL_HORNS: SkillDef = {
  id: "h_bullHorns",
  name: "Bull Horns",
  kind: "movement",
  risk: "timed",
  button: "I",
  text: "The Bull Rush lifts foes onto your shoulder and slams them down at the end.",
  levels: [
    {
      text: "The rush lifts a foe and slams it.",
      values: { carry: 1, slam: 0.8, ring: 0, ringPower: 0, time: 0.32, shove: 0, launch: 0, armour: 0.5, crater: 0 },
    },
    {
      text: "Harder slam.",
      values: { carry: 1, slam: 1.2, ring: 0, ringPower: 0, time: 0.32, shove: 0, launch: 0, armour: 0.5, crater: 0 },
    },
    {
      text: "Carry two foes.",
      values: { carry: 2, slam: 1.2, ring: 0, ringPower: 0, time: 0.32, shove: 0, launch: 0, armour: 0.5, crater: 0 },
    },
    {
      text: "The slam knocks down foes near it.",
      values: {
        carry: 2,
        slam: 1.2,
        ring: 30,
        ringPower: 0.6,
        time: 0.32,
        shove: 0,
        launch: 0,
        armour: 0.5,
        crater: 0,
      },
    },
    {
      text: "Longer rush.",
      values: { carry: 2, slam: 1.2, ring: 30, ringPower: 0.6, time: 0.4, shove: 0, launch: 0, armour: 0.5, crater: 0 },
    },
    {
      text: "Carry three and shove big foes.",
      values: { carry: 3, slam: 1.2, ring: 30, ringPower: 0.6, time: 0.4, shove: 1, launch: 0, armour: 0.5, crater: 0 },
    },
    {
      text: "The slam throws foes up.",
      values: { carry: 3, slam: 1.2, ring: 30, ringPower: 0.6, time: 0.4, shove: 1, launch: 1, armour: 0.5, crater: 0 },
    },
    {
      text: "Slam far harder, bigger ring.",
      values: { carry: 3, slam: 3.5, ring: 40, ringPower: 1.5, time: 0.4, shove: 1, launch: 1, armour: 0.5, crater: 0 },
    },
  ],
  evolution: {
    partner: "h_ironHide",
    name: "Juggernaut",
    text: "Carry every foe you meet, rush twice as far without taking damage, and slam them into a crater.",
    row: {
      text: "Carry all, rush far untouched, crater.",
      values: { carry: 99, slam: 3.5, ring: 60, ringPower: 1.5, time: 0.64, shove: 1, launch: 1, armour: 0, crater: 5 },
    },
  },
};
