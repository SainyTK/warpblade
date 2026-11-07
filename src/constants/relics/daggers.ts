import type { RelicDef } from "../../types/build";

/** Warp Daggers. Design: docs/growth-design.md */
export const DAGGERS: RelicDef = {
  id: "daggers",
  name: "Warp Daggers",
  text: "Daggers fly straight ahead where you face.",
  levels: [
    { damage: 5, cooldown: 1, amount: 1, pierce: 1, speed: 1, text: "A dagger flies ahead." },
    { damage: 5, cooldown: 1, amount: 2, pierce: 1, speed: 1, text: "One more dagger." },
    {
      damage: 5,
      cooldown: 1,
      amount: 2,
      pierce: 2,
      speed: 1.2,
      text: "Daggers pass through one more foe and fly faster.",
    },
    { damage: 6, cooldown: 1, amount: 2, pierce: 2, speed: 1.2, text: "Damage +1." },
    { damage: 6, cooldown: 0.85, amount: 3, pierce: 2, speed: 1.2, text: "One more dagger, thrown sooner." },
    {
      damage: 6,
      cooldown: 0.85,
      amount: 3,
      pierce: 3,
      speed: 1.4,
      text: "Daggers pass through one more foe and fly faster.",
    },
    { damage: 6, cooldown: 0.7, amount: 4, pierce: 3, speed: 1.4, text: "One more dagger, thrown sooner." },
    { damage: 8, cooldown: 0.7, amount: 4, pierce: 3, speed: 1.4, text: "Damage +2." },
  ],
  evolution: {
    charm: "multitude",
    name: "Dagger Storm",
    text: "Daggers fly ahead and behind, almost without pause.",
    stats: {
      damage: 9,
      cooldown: 0.3,
      amount: 4,
      pierce: 4,
      speed: 1.5,
      text: "Daggers fly ahead and behind, almost without pause.",
    },
  },
};

/** how the daggers fly, before the level's and the build's speed */
export const DAGGER_FLIGHT = {
  /** art pixels a second */
  speed: 300,
  /** height of the throw above the hero's feet, the space between the daggers of a volley, and how far ahead they start */
  lift: 15,
  spread: 3,
  ahead: 6,
  /** seconds between the daggers of one volley */
  spacing: 0.035,
  /** how far past a foe's body a dagger still strikes it */
  reach: 1.5,
  /** seconds before one dagger may strike the same foe again */
  gap: 0.45,
  kick: 30,
} as const;
