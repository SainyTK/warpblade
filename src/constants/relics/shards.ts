import type { RelicDef } from "../../types/build";

/** Orbit Shards. Design: docs/growth-design.md */
export const SHARDS: RelicDef = {
  id: "shards",
  name: "Orbit Shards",
  text: "Crystal shards circle you for a while, then rest.",
  levels: [
    { damage: 8, cooldown: 3, amount: 1, area: 1, duration: 3, speed: 1, text: "A crystal shard circles you." },
    { damage: 8, cooldown: 3, amount: 2, area: 1, duration: 3, speed: 1, text: "One more shard." },
    { damage: 8, cooldown: 3, amount: 2, area: 1.25, duration: 3, speed: 1.3, text: "Wider and faster circle." },
    {
      damage: 14,
      cooldown: 3,
      amount: 2,
      area: 1.25,
      duration: 3.5,
      speed: 1.3,
      text: "Damage +6, lasts 0.5 s longer.",
    },
    { damage: 14, cooldown: 3, amount: 3, area: 1.25, duration: 3.5, speed: 1.3, text: "One more shard." },
    { damage: 14, cooldown: 3, amount: 3, area: 1.5, duration: 3.5, speed: 1.6, text: "Wider and faster circle." },
    { damage: 20, cooldown: 3, amount: 3, area: 1.5, duration: 4, speed: 1.6, text: "Damage +6, lasts 0.5 s longer." },
    { damage: 20, cooldown: 3, amount: 4, area: 1.5, duration: 4, speed: 1.6, text: "One more shard." },
  ],
  evolution: {
    charm: "persistence",
    name: "Shard Halo",
    text: "The shards never rest, and two more join them.",
    stats: {
      damage: 26,
      cooldown: 0,
      amount: 6,
      area: 1.6,
      duration: 0,
      speed: 1.6,
      text: "The shards never rest, and two more join them.",
    },
  },
};
