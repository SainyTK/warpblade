import type { SkillDef } from "../../../../types/skill";

/** Still Point. Design: docs/skills/mirel.md. Values: power: share more her blows deal to a foe inside a Stillfield or stopped; crit: 1 such hits always crit; sand: Sand such a hit gives back; mark: share more a foe hit this way takes from every source, for markTime seconds; instant: 1 the hit's echo lands at once; twice: 1 a hit on a stopped foe is stored twice for the restart (evolution) */
export const STILL_POINT: SkillDef = {
  id: "m_stillpoint",
  name: "Still Point",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Her blows hit much harder on a foe in a Stillfield or stopped.",
  levels: [
    {
      text: "Blows on still foes deal 40% more.",
      values: { power: 0.4, crit: 0, sand: 0, mark: 0, markTime: 0, instant: 0, twice: 0 },
    },
    {
      text: "Blows on still foes always crit.",
      values: { power: 0.4, crit: 1, sand: 0, mark: 0, markTime: 0, instant: 0, twice: 0 },
    },
    {
      text: "A blow on a still foe gives back 3 Sand.",
      values: { power: 0.4, crit: 1, sand: 3, mark: 0, markTime: 0, instant: 0, twice: 0 },
    },
    {
      text: "Blows on still foes deal 80% more.",
      values: { power: 0.8, crit: 1, sand: 3, mark: 0, markTime: 0, instant: 0, twice: 0 },
    },
    {
      text: "A still foe you hit is marked: +15% for 2 s.",
      values: { power: 0.8, crit: 1, sand: 3, mark: 0.15, markTime: 2, instant: 0, twice: 0 },
    },
    {
      text: "The blow's echo lands at once.",
      values: { power: 0.8, crit: 1, sand: 3, mark: 0.15, markTime: 2, instant: 1, twice: 0 },
    },
    {
      text: "Blows on still foes deal 120% more.",
      values: { power: 1.2, crit: 1, sand: 3, mark: 0.15, markTime: 2, instant: 1, twice: 0 },
    },
    {
      text: "Blows on still foes deal 180% more.",
      values: { power: 1.8, crit: 1, sand: 3, mark: 0.15, markTime: 2, instant: 1, twice: 0 },
    },
  ],
  evolution: {
    partner: "m_foretell",
    name: "Frozen Instant",
    text: "A hit on a stopped foe is stored twice for the restart.",
    row: {
      text: "Hits on stopped foes are stored twice.",
      values: { power: 1.8, crit: 1, sand: 3, mark: 0.15, markTime: 2, instant: 1, twice: 1 },
    },
  },
};
