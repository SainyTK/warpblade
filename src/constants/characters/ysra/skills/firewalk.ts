import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * cut: the attack damage multiple of the glaive cut on each foe the dodge passes through; sweeps: air sweeps before she
 * lands; burn: seconds the cut sets foes burning (0 off); heat: Heat for each foe cut (0 off); turn: the sweep behind
 * her as the dodge ends, in attack damage (0 off); pin: seconds a cut foe is pinned (0 off); pillars: the evolved
 * pillars along the dodge's path, in ability power
 */
const levels = grow({ cut: 0.9, sweeps: 1, burn: 0, heat: 0, turn: 0, pin: 0 }, [
  ["The dodge cuts every foe it passes through.", {}],
  ["Air string +1: two air sweeps before you land.", { cut: 1, sweeps: 2 }],
  ["Foes cut are set burning.", { cut: 1.2, burn: 2 }],
  ["Each foe cut builds Heat.", { cut: 1.4, heat: 6 }],
  ["Cut damage +30%.", { cut: 1.8 }],
  ["The dodge ends in a sweep behind you.", { cut: 2, turn: 1.5 }],
  ["Foes cut are pinned for a moment.", { cut: 2.3, pin: 0.8 }],
  ["Cut and sweep much harder.", { cut: 4.2, turn: 3 }],
]);

/** Firewalk: her front dodge cuts through the foes it passes, and her air string grows */
export const FIREWALK: SkillDef = {
  id: "y_firewalk",
  name: "Firewalk",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Your front dodge cuts every foe it passes through with the glaive, and opens up the air.",
  levels,
  evolution: {
    partner: "y_pillar",
    name: "Pillar Stride",
    text: "A row of flame pillars bursts up along the dodge's path a moment after you pass.",
    row: evolved(levels, "Pillars burst along your path.", { pillars: 4 }),
  },
};
