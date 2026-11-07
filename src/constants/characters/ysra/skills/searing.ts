import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * from: share of Heat the glaive burns from; perSecond: a Scorch stack's ability power per second; duration: seconds
 * stacks last; max: stacks a foe carries; guard: blocks and parries scorch the attacker; heavy: stacks a heavy blow
 * lays; flare: the damage a foe at max stacks takes more (0 off); spread: pixels a fallen foe's stacks leap; burst:
 * the burst at max stacks, as a share of the stacks' remaining damage, over burstRadius pixels
 */
const levels = grow({ from: 0.5, perSecond: 0.3, duration: 3, max: 3, guard: 0, heavy: 1, flare: 0 }, [
  ["Hot blows scorch foes.", {}],
  ["Your guard scorches too.", { guard: 1 }],
  ["More stacks, burning longer.", { perSecond: 0.4, duration: 4, max: 5 }],
  ["Scorch +12%.", { perSecond: 0.45 }],
  ["Every blow scorches.", { from: 0, perSecond: 0.5 }],
  ["Heavy blows scorch twice.", { perSecond: 0.55, heavy: 2 }],
  ["Scorch stacks to 8 and flares.", { perSecond: 0.65, max: 8, flare: 0.1 }],
  ["Scorch hotter and longer.", { perSecond: 0.75, duration: 5 }],
]);

/** Searing Edge: blows lay Scorch stacks; weak alone, a furnace late */
export const SEARING_EDGE: SkillDef = {
  id: "y_searing",
  name: "Searing Edge",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Above half Heat the glaive burns, and every blow scorches its foe. Scorch stacks.",
  levels,
  evolution: {
    partner: "y_kindling",
    name: "Wildfire",
    text: "A scorched foe that falls throws its stacks onto every foe near it, and a foe at full stacks bursts in flame.",
    row: evolved(levels, "Scorch spreads and bursts.", { spread: 50, burst: 2, burstRadius: 30 }),
  },
};
