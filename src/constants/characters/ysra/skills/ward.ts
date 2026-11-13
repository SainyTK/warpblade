import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * lash: attack damage multiple of the fire a block lashes back at the attacker; cost: share of the block's stamina it
 * still costs; push: speed the block shoves the attacker back at (0 off); stagger: seconds a block staggers a small foe
 * (0 off); wall: attack damage multiple a held guard burns foes pressed against it with, every WARD.every seconds (0
 * off); ring: the evolution's ring of fire on every block, in ability power
 */
const levels = grow({ lash: 1.2, cost: 1, push: 0, stagger: 0, wall: 0 }, [
  ["Blocks lash fire back at the attacker.", {}],
  ["Blocks cost half the stamina.", { cost: 0.5 }],
  ["Blocks shove the attacker back.", { push: 160 }],
  ["Lash damage +40%.", { lash: 1.7 }],
  ["A held guard burns foes pressed against it.", { wall: 0.4 }],
  ["Blocks stagger small foes; the lash hits harder.", { stagger: 0.6, lash: 2.2 }],
  ["The lash and the guard burn hotter.", { lash: 3, wall: 0.7 }],
  ["Lash damage much higher.", { lash: 5, wall: 1 }],
]);

/** Haft Ward: her firm block answers every blow it stops with fire */
export const HAFT_WARD: SkillDef = {
  id: "y_ward",
  name: "Haft Ward",
  kind: "attack",
  risk: "easy",
  button: "K",
  text: "Hold K: every blow your guard blocks lashes fire back at the attacker.",
  levels,
  evolution: {
    partner: "y_kindling",
    name: "Temple Gate",
    text: "Blocks cost no stamina, and every block bursts a ring of fire around you.",
    row: evolved(levels, "Free blocks that burst in a ring of fire.", { cost: 0, ring: 3 }),
  },
};
