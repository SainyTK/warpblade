import type { RelicDef } from "../../types/build";

/** Orbit Shards. Design: docs/growth-design.md */
export const SHARDS: RelicDef = {
  id: "shards",
  name: "Orbit Shards",
  text: "Crystal shards circle you for a while, then rest.",
  levels: [
    { damage: 10, cooldown: 3, amount: 1, area: 1, duration: 3, speed: 1, text: "A crystal shard circles you." },
    { damage: 10, cooldown: 3, amount: 2, area: 1, duration: 3, speed: 1, text: "One more shard." },
    { damage: 10, cooldown: 3, amount: 2, area: 1.25, duration: 3, speed: 1.3, text: "Wider and faster circle." },
    {
      damage: 14,
      cooldown: 3,
      amount: 2,
      area: 1.25,
      duration: 3.5,
      speed: 1.3,
      text: "Damage +4, lasts 0.5 s longer.",
    },
    { damage: 14, cooldown: 3, amount: 3, area: 1.25, duration: 3.5, speed: 1.3, text: "One more shard." },
    { damage: 14, cooldown: 3, amount: 3, area: 1.5, duration: 3.5, speed: 1.6, text: "Wider and faster circle." },
    { damage: 18, cooldown: 3, amount: 3, area: 1.5, duration: 4, speed: 1.6, text: "Damage +4, lasts 0.5 s longer." },
    { damage: 18, cooldown: 3, amount: 4, area: 1.5, duration: 4, speed: 1.6, text: "One more shard." },
  ],
  evolution: {
    charm: "persistence",
    name: "Shard Halo",
    text: "The shards never rest, and two more join them.",
    stats: {
      damage: 22,
      cooldown: 0,
      amount: 6,
      area: 1.6,
      duration: 0,
      speed: 1.6,
      text: "The shards never rest, and two more join them.",
    },
  },
};

/** how the shards move and strike, before the level's area and speed */
export const SHARD_ORBIT = {
  /** orbit radius in art pixels */
  radius: 24,
  /** the orbit's height as a share of its width: a ring seen from a little above */
  tilt: 0.4,
  /** art pixels a second along the orbit, so a wider orbit turns no faster */
  speed: 170,
  /** height of the orbit's middle above the hero's feet */
  lift: 16,
  /** how far past a foe's body a shard still strikes it */
  reach: 2.5,
  /** seconds before one shard may strike the same foe again */
  gap: 0.45,
  /** seconds the shards take to grow in or fade out */
  grow: 0.16,
  /** push on a struck foe, away from the hero */
  kick: 40,
} as const;
