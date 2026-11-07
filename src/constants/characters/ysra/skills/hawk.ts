import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * chance: a parry calls a hawk; cooldown: least seconds between calls; dives: dives before it leaves (0 with `life`);
 * life: seconds it hunts (0: it leaves after its dives); every: seconds between dives; power: a dive's attack damage
 * multiple; block: the chance a block calls it; burn: seconds a dive sets foes burning; burst: pixels a dive bursts
 * over (0 off); most: hawks flying at once; flock: the evolution's hawks a parry calls, guard the damage cut while two
 * or more fly
 */
const levels = grow(
  { chance: 0.6, cooldown: 3, dives: 3, life: 0, every: 0.5, power: 2.5, block: 0, burn: 0, burst: 0, most: 1 },
  [
    ["A parry may call a sun hawk.", {}],
    ["The hawk answers more often.", { chance: 0.8 }],
    ["The hawk stays and keeps diving its foe.", { power: 3, dives: 0, life: 6, every: 1 }],
    ["Dives hit harder.", { power: 3.5 }],
    ["Blocks may call the hawk too.", { power: 4, block: 0.25 }],
    ["Every parry calls a burning hawk.", { power: 4.5, chance: 1, burn: 2 }],
    ["Dives burst.", { power: 9, burst: 24 }],
    ["Two hawks, far harder dives.", { power: 42, every: 0.8, most: 2 }],
  ],
);

/** Sun Hawk: a bird of fire answers the parry and keeps diving */
export const SUN_HAWK: SkillDef = {
  id: "y_hawk",
  name: "Sun Hawk",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A parry may call a sun hawk that keeps diving the attacker until it falls.",
  levels,
  evolution: {
    partner: "y_counter",
    name: "Sunflock",
    text: "A parry calls five hawks that dive the attacker together, and while two or more fly you take 20% less damage.",
    row: evolved(levels, "A flock answers every parry.", { power: 90, flock: 5, most: 5, guard: 0.2 }),
  },
};
