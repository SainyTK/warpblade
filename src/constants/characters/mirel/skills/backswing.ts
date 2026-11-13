import type { SkillDef } from "../../../../types/skill";

/** Backswing. Design: docs/skills/mirel.md. Values: power: share more the first blow after a rewind deals (a Stopped Moment, or Second Chance); window: seconds after the rewind the blow counts; crit: 1 the blow always crits; heal: share of max HP the blow heals; stagger: seconds it staggers the foe; undone: 1 the blow replays on its foe, at full power, every blow she landed in the time the rewind looked back over (evolution) */
export const BACKSWING: SkillDef = {
  id: "m_backswing",
  name: "Backswing",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A blow just after a Stopped Moment hits much harder.",
  levels: [
    {
      text: "A blow 0.4 s after a Stopped Moment deals 60% more.",
      values: { power: 0.6, window: 0.4, crit: 0, heal: 0, stagger: 0, undone: 0 },
    },
    { text: "The blow always crits.", values: { power: 0.6, window: 0.4, crit: 1, heal: 0, stagger: 0, undone: 0 } },
    {
      text: "The window grows to 0.6 s.",
      values: { power: 0.6, window: 0.6, crit: 1, heal: 0, stagger: 0, undone: 0 },
    },
    { text: "The blow heals 3% HP.", values: { power: 0.6, window: 0.6, crit: 1, heal: 0.03, stagger: 0, undone: 0 } },
    {
      text: "The blow deals 100% more.",
      values: { power: 1, window: 0.6, crit: 1, heal: 0.03, stagger: 0, undone: 0 },
    },
    {
      text: "The blow staggers for 1 s.",
      values: { power: 1, window: 0.6, crit: 1, heal: 0.03, stagger: 1, undone: 0 },
    },
    {
      text: "The blow deals 160% more.",
      values: { power: 1.6, window: 0.6, crit: 1, heal: 0.03, stagger: 1, undone: 0 },
    },
    {
      text: "The blow deals 260% more.",
      values: { power: 2.6, window: 0.6, crit: 1, heal: 0.03, stagger: 1, undone: 0 },
    },
  ],
  evolution: {
    partner: "m_longrewind",
    name: "Undone",
    text: "The first blow after a Stopped Moment replays on its foe, at full power, every blow she landed in the time it looked back over.",
    row: {
      text: "Replay every rewound blow on the foe.",
      values: { power: 2.6, window: 0.6, crit: 1, heal: 0.03, stagger: 1, undone: 1 },
    },
  },
};
