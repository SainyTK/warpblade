import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the air reap's attack damage multiple; burn: seconds it sets foes burning (0 off); around: it sweeps behind
 * her too; spike: it drives foes in the air into the floor; ring: the ring of fire it bursts in on the floor below, in
 * ability power (0 off); heavy: it builds Heat at the heavy rate; crescent: the evolved crescent of fire, in attack
 * damage
 */
const levels = grow({ power: 2.2, burn: 0, around: 0, spike: 0, ring: 0, heavy: 0 }, [
  ["The air reap hits harder.", {}],
  ["The reap sets foes burning.", { power: 2.5, burn: 2 }],
  ["The reap sweeps behind you too.", { power: 2.9, around: 1 }],
  ["Reap damage +25%.", { power: 3.6 }],
  ["The reap drives foes in the air into the floor.", { power: 4, spike: 1 }],
  ["The reap bursts in a ring of fire below you.", { power: 4.5, ring: 1.2 }],
  ["Reaps build Heat like a counter.", { power: 5, heavy: 1 }],
  ["Reap damage much higher.", { power: 10 }],
]);

/** Sunreap: her air reap becomes a weapon of its own */
export const SUNREAP: SkillDef = {
  id: "y_reap",
  name: "Sunreap",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Your air reap strikes far harder, burns, and grows into a sweep all round you.",
  levels,
  evolution: {
    partner: "y_firewalk",
    name: "Sunscythe",
    text: "Each reap throws a crescent of fire that runs on along the floor ahead, striking every foe it passes.",
    row: evolved(levels, "Reaps throw a crescent of fire.", { crescent: 5 }),
  },
};
