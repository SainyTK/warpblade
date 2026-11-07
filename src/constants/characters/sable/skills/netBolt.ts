import type { SkillDef } from "../../../../types/skill";

/** Net Bolt: A weighted net that pins foes where it lands. Values: mp, cooldown: its cost and recharge; width: the net's half width in pixels; power: ability power to each foe; hold: seconds; mark: damage taken added while held; drag: foes are pulled to the middle; nets: nets per cast; pitch: a bolt sets the net alight. Design: docs/skills/sable.md */
export const NET_BOLT: SkillDef = {
  id: "s_net",
  name: "Net Bolt",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A weighted net that pins foes where it lands.",
  levels: [
    {
      text: "Shoot a net that pins foes where it lands.",
      values: { mp: 25, cooldown: 5, width: 20, power: 3, hold: 1.5, mark: 0, drag: 0, nets: 1, pitch: 0 },
    },
    {
      text: "Cheaper and quicker.",
      values: { mp: 20, cooldown: 4, width: 20, power: 3, hold: 1.5, mark: 0, drag: 0, nets: 1, pitch: 0 },
    },
    {
      text: "Netted foes take 25% more damage.",
      values: { mp: 20, cooldown: 4, width: 20, power: 3, hold: 1.5, mark: 0.25, drag: 0, nets: 1, pitch: 0 },
    },
    {
      text: "A wider net.",
      values: { mp: 20, cooldown: 4, width: 30, power: 3, hold: 1.5, mark: 0.25, drag: 0, nets: 1, pitch: 0 },
    },
    {
      text: "The net drags foes together.",
      values: { mp: 20, cooldown: 4, width: 30, power: 3, hold: 1.5, mark: 0.25, drag: 1, nets: 1, pitch: 0 },
    },
    {
      text: "Holds longer and bites harder.",
      values: { mp: 20, cooldown: 4, width: 30, power: 7, hold: 2.5, mark: 0.25, drag: 1, nets: 1, pitch: 0 },
    },
    {
      text: "Shoot two nets at once.",
      values: { mp: 20, cooldown: 4, width: 30, power: 7, hold: 2.5, mark: 0.25, drag: 1, nets: 2, pitch: 0 },
    },
    {
      text: "Netted foes take 60% more from everything.",
      values: { mp: 20, cooldown: 4, width: 30, power: 12, hold: 2.5, mark: 0.6, drag: 1, nets: 2, pitch: 0 },
    },
  ],
  evolution: {
    partner: "s_keg",
    name: "Pitch Net",
    text: "The net is soaked in pitch: a bolt sets it alight, burning every foe in it and every foe they touch.",
    row: {
      text: "A bolt sets the net alight.",
      values: { mp: 20, cooldown: 4, width: 30, power: 12, hold: 2.5, mark: 0.6, drag: 1, nets: 2, pitch: 1 },
    },
  },
};
