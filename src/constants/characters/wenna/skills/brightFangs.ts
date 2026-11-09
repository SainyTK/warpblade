import type { SkillDef } from "../../../../types/skill";

/** Bright Fangs. Design: docs/skills/wenna.md. Values: power: share more every Wick bite deals; reach: pixels added to a bite's reach; knock: 1 bites knock minions back; twice: 1 every third bite of a Wick hits twice; every: seconds between a Wick's bites, the base kit's 0.8; blue: 1 every bite also strikes the next foe behind its target and adds 2 Singe (evolution) */
export const BRIGHT_FANGS: SkillDef = {
  id: "w_fangs",
  name: "Bright Fangs",
  kind: "attack",
  risk: "easy",
  button: "auto",
  text: "Her Wicks bite harder, further and faster.",
  levels: [
    { text: "Wick bites deal 30% more.", values: { power: 0.3, reach: 0, knock: 0, twice: 0, every: 0.8, blue: 0 } },
    { text: "Bites reach 8 px further.", values: { power: 0.3, reach: 8, knock: 0, twice: 0, every: 0.8, blue: 0 } },
    { text: "Wick bites deal 45% more.", values: { power: 0.45, reach: 8, knock: 0, twice: 0, every: 0.8, blue: 0 } },
    { text: "Bites knock minions back.", values: { power: 0.45, reach: 8, knock: 1, twice: 0, every: 0.8, blue: 0 } },
    {
      text: "Every third bite hits twice.",
      values: { power: 0.45, reach: 8, knock: 1, twice: 1, every: 0.8, blue: 0 },
    },
    { text: "Wick bites deal 60% more.", values: { power: 0.6, reach: 8, knock: 1, twice: 1, every: 0.8, blue: 0 } },
    { text: "Wicks bite every 0.6 s.", values: { power: 0.6, reach: 8, knock: 1, twice: 1, every: 0.6, blue: 0 } },
    { text: "Wick bites deal 90% more.", values: { power: 0.9, reach: 8, knock: 1, twice: 1, every: 0.6, blue: 0 } },
  ],
  evolution: {
    partner: "w_singe",
    name: "Blue Flame",
    text: "Every bite also strikes the next foe behind its target and adds 2 Singe.",
    row: {
      text: "Bites strike the foe behind and Singe.",
      values: { power: 0.9, reach: 8, knock: 1, twice: 1, every: 0.6, blue: 1 },
    },
  },
};
