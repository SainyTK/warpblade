import type { SkillDef } from "../../../../types/skill";

/** Hunting Call. Design: docs/skills/wenna.md. Values: life: seconds a Quarry lasts; bite: share more Wick bites deal to a Quarry; chill: 1 her blows chill the Quarry; pass: 1 a Quarry's death passes the mark to the nearest foe; rush: share faster Wicks walk toward a Quarry; count: Quarries she holds at once; pack: 1 every foe she hits becomes a Quarry and the Wicks split between them (evolution) */
export const HUNTING_CALL: SkillDef = {
  id: "w_quarry",
  name: "Hunting Call",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Her Quarry lasts longer and her Wicks bite it harder.",
  levels: [
    {
      text: "The Quarry lasts 6 s; bites on it deal 10% more.",
      values: { life: 6, bite: 0.1, chill: 0, pass: 0, rush: 0, count: 1, pack: 0 },
    },
    {
      text: "Your blows chill the Quarry.",
      values: { life: 6, bite: 0.1, chill: 1, pass: 0, rush: 0, count: 1, pack: 0 },
    },
    {
      text: "Bites on the Quarry deal 30% more.",
      values: { life: 6, bite: 0.3, chill: 1, pass: 0, rush: 0, count: 1, pack: 0 },
    },
    {
      text: "A Quarry's death passes the mark on.",
      values: { life: 6, bite: 0.3, chill: 1, pass: 1, rush: 0, count: 1, pack: 0 },
    },
    {
      text: "Wicks walk 30% faster toward the Quarry.",
      values: { life: 6, bite: 0.3, chill: 1, pass: 1, rush: 0.3, count: 1, pack: 0 },
    },
    { text: "Two Quarries at once.", values: { life: 6, bite: 0.3, chill: 1, pass: 1, rush: 0.3, count: 2, pack: 0 } },
    {
      text: "The Quarry lasts 8 s; bites on it deal 45% more.",
      values: { life: 8, bite: 0.45, chill: 1, pass: 1, rush: 0.3, count: 2, pack: 0 },
    },
    {
      text: "Bites on the Quarry deal 60% more.",
      values: { life: 8, bite: 0.6, chill: 1, pass: 1, rush: 0.3, count: 2, pack: 0 },
    },
  ],
  evolution: {
    partner: "w_tallow",
    name: "Pack Law",
    text: "Every foe she hits becomes a Quarry, the Wicks split between them, and bites on Quarries deal 100% more.",
    row: {
      text: "Every foe you hit is a Quarry; 100% more.",
      values: { life: 8, bite: 1, chill: 1, pass: 1, rush: 0.3, count: 2, pack: 1 },
    },
  },
};
