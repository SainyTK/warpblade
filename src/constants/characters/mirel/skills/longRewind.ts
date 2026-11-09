import type { SkillDef } from "../../../../types/skill";

/** Long Rewind. Design: docs/skills/mirel.md. Values: back: seconds of path Rewind plays back; heal: share of the HP lost in them she gets back; cost: Sand a Rewind costs; power: attack damage foes on the path take; dodge: seconds at the start that count as a perfect dodge; field: radius of a free Stillfield where the Rewind began; fieldLife: seconds it stands; secondChance: 1 once per wave a fatal blow rewinds her 2 s and restores all HP lost in them (evolution) */
export const LONG_REWIND: SkillDef = {
  id: "m_longrewind",
  name: "Long Rewind",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Rewind looks further back, heals more and hurts foes on the path.",
  levels: [
    {
      text: "Rewind looks back 1.6 s and heals 50%.",
      values: { back: 1.6, heal: 0.5, cost: 40, power: 0, dodge: 0.12, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "Rewind costs 30 Sand.",
      values: { back: 1.6, heal: 0.5, cost: 30, power: 0, dodge: 0.12, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "Foes on the path take 0.6x.",
      values: { back: 1.6, heal: 0.5, cost: 30, power: 0.6, dodge: 0.12, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "The perfect dodge window grows to 0.2 s.",
      values: { back: 1.6, heal: 0.5, cost: 30, power: 0.6, dodge: 0.2, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "Foes on the path take 1.0x.",
      values: { back: 1.6, heal: 0.5, cost: 30, power: 1, dodge: 0.2, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "A free 24 px field stands 1 s where it began.",
      values: { back: 1.6, heal: 0.5, cost: 30, power: 1, dodge: 0.2, field: 24, fieldLife: 1, secondChance: 0 },
    },
    {
      text: "Rewind heals 65%.",
      values: { back: 1.6, heal: 0.65, cost: 30, power: 1, dodge: 0.2, field: 24, fieldLife: 1, secondChance: 0 },
    },
    {
      text: "Foes on the path take 1.6x.",
      values: { back: 1.6, heal: 0.65, cost: 30, power: 1.6, dodge: 0.2, field: 24, fieldLife: 1, secondChance: 0 },
    },
  ],
  evolution: {
    partner: "m_pastself",
    name: "Second Chance",
    text: "Once per wave a fatal blow rewinds her 2 s and restores all HP lost in them.",
    row: {
      text: "Once a wave, a fatal blow is undone.",
      values: { back: 1.6, heal: 0.65, cost: 30, power: 1.6, dodge: 0.2, field: 24, fieldLife: 1, secondChance: 1 },
    },
  },
};
