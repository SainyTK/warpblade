import type { SkillDef } from "../../../../types/skill";

/** Long Rewind. Design: docs/skills/mirel.md. Values: back: seconds of HP loss a Stopped Moment looks back over; heal: share of it she gets back; stop: share longer the attacker stays stopped; ring: pixels round the attacker in which other foes stop too; returns: share of the damage a stopped foe took that lands again on its restart; field: radius of a free Stillfield that opens on the attacker; fieldLife: seconds it stands; secondChance: 1 once per wave a fatal blow rewinds her 2 s along her path and restores all HP lost in them (evolution) */
export const LONG_REWIND: SkillDef = {
  id: "m_longrewind",
  name: "Long Rewind",
  kind: "passive",
  risk: "precise",
  button: "K",
  text: "Her parry, the Stopped Moment, rewinds more of the HP she lost and holds foes longer.",
  levels: [
    {
      text: "A parry looks back 2.5 s and gives back 65%.",
      values: { back: 2.5, heal: 0.65, stop: 0, ring: 0, returns: 0.4, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "Foes stay stopped 50% longer.",
      values: { back: 2.5, heal: 0.65, stop: 0.5, ring: 0, returns: 0.4, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "Foes within 30 px of the attacker stop too.",
      values: { back: 2.5, heal: 0.65, stop: 0.5, ring: 30, returns: 0.4, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "60% of their stored damage returns.",
      values: { back: 2.5, heal: 0.65, stop: 0.5, ring: 30, returns: 0.6, field: 0, fieldLife: 0, secondChance: 0 },
    },
    {
      text: "A free 30 px Stillfield opens on the attacker.",
      values: { back: 2.5, heal: 0.65, stop: 0.5, ring: 30, returns: 0.6, field: 30, fieldLife: 1.5, secondChance: 0 },
    },
    {
      text: "Looks back 3 s; gives back 80%.",
      values: { back: 3, heal: 0.8, stop: 0.5, ring: 30, returns: 0.6, field: 30, fieldLife: 1.5, secondChance: 0 },
    },
    {
      text: "Foes within 50 px of the attacker stop too.",
      values: { back: 3, heal: 0.8, stop: 0.5, ring: 50, returns: 0.6, field: 30, fieldLife: 1.5, secondChance: 0 },
    },
    {
      text: "Stopped twice as long; all stored damage returns.",
      values: { back: 3, heal: 0.8, stop: 1, ring: 50, returns: 1, field: 30, fieldLife: 1.5, secondChance: 0 },
    },
  ],
  evolution: {
    partner: "m_pastself",
    name: "Second Chance",
    text: "Once per wave a fatal blow rewinds her 2 s along her path and restores all HP lost in them.",
    row: {
      text: "Once a wave, a fatal blow is undone.",
      values: { back: 3, heal: 0.8, stop: 1, ring: 50, returns: 1, field: 30, fieldLife: 1.5, secondChance: 1 },
    },
  },
};
