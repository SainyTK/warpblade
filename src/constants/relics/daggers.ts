import type { RelicDef } from "../../types/build";

/** Warp Daggers. Design: docs/growth-design.md */
export const DAGGERS: RelicDef = {
  id: "daggers",
  name: "Warp Daggers",
  text: "Daggers fly straight ahead where you face.",
  levels: [
    { damage: 5, cooldown: 1, amount: 1, pierce: 1, speed: 1, text: "A dagger flies ahead." },
    { damage: 5, cooldown: 1, amount: 2, pierce: 1, speed: 1, text: "One more dagger." },
    { damage: 9, cooldown: 1, amount: 3, pierce: 1, speed: 1, text: "One more dagger, damage +4." },
    { damage: 9, cooldown: 0.85, amount: 4, pierce: 1, speed: 1, text: "One more dagger, thrown sooner." },
    {
      damage: 9,
      cooldown: 0.85,
      amount: 4,
      pierce: 2,
      speed: 1.2,
      text: "Daggers pass through one more foe and fly faster.",
    },
    { damage: 9, cooldown: 0.7, amount: 5, pierce: 2, speed: 1.2, text: "One more dagger, thrown sooner." },
    { damage: 13, cooldown: 0.7, amount: 6, pierce: 2, speed: 1.2, text: "One more dagger, damage +4." },
    {
      damage: 13,
      cooldown: 0.6,
      amount: 6,
      pierce: 3,
      speed: 1.4,
      text: "Daggers pass through one more foe and fly faster.",
    },
  ],
  evolution: {
    charm: "multitude",
    name: "Dagger Storm",
    text: "Daggers fly ahead and behind, almost without pause.",
    stats: {
      damage: 14,
      cooldown: 0.3,
      amount: 6,
      pierce: 3,
      speed: 1.5,
      text: "Daggers fly ahead and behind, almost without pause.",
    },
  },
};
