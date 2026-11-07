import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * chance: a rite calls a salamander; cooldown: least seconds between calls; life: seconds it runs; bite: a bite's
 * ability power multiple, every `every` seconds; trail: its burning trail's power (0 off); count: salamanders a call;
 * flyers: it leaps at flyers; burst: its burst at the end (0 off); drake: the evolution's drake lasts this long and
 * breathes `breath` along `range` pixels every second
 */
const levels = grow(
  { chance: 0.5, cooldown: 3, life: 4, bite: 1.2, every: 0.5, trail: 0, count: 1, flyers: 0, burst: 0, drake: 0 },
  [
    ["Rites may call a salamander.", {}],
    ["Salamanders come more often.", { chance: 0.65 }],
    ["The salamander's trail burns.", { trail: 0.2 }],
    ["Bites harder.", { bite: 1.4 }],
    ["Two salamanders.", { count: 2 }],
    ["Lasts longer and leaps at flyers.", { life: 6, flyers: 1 }],
    ["Salamanders burst at the end.", { burst: 5 }],
    ["Comes more often and bites harder.", { chance: 0.8, bite: 1.8 }],
  ],
);

/** Salamander: a fire salamander runs out along the floor and bites what it meets */
export const SALAMANDER: SkillDef = {
  id: "y_salamander",
  name: "Salamander",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A rite may call a fire salamander that runs ahead along the floor, biting the foes it meets.",
  levels,
  evolution: {
    partner: "y_pillar",
    name: "Magma Drake",
    text: "A rite calls a drake that walks with you for 10 seconds and breathes fire along the floor every second.",
    row: evolved(levels, "A magma drake walks with you.", { drake: 10, breath: 4, range: 80 }),
  },
};
