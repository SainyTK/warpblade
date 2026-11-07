import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * duration: seconds the brand lasts after the last stack; perSecond: a stack's ability power per second; max: stacks;
 * parry: stacks a parry lays; slow: share a branded foe is slowed; block: stacks a block lays (0 off); spread: pixels a
 * parry brands around the attacker (0 off); taken: the damage a branded foe takes more (0 off); consume: the
 * evolution's ability power per stack spent by an impale or counter, over radius pixels
 */
const levels = grow({ duration: 4, perSecond: 0.8, max: 4, parry: 2, slow: 0, block: 0, spread: 0, taken: 0 }, [
  ["A parry brands the attacker; your blows feed the brand.", {}],
  ["The brand lasts longer and slows.", { duration: 6, perSecond: 0.9, slow: 0.2 }],
  ["More stacks.", { perSecond: 1, max: 6 }],
  ["Brand +40%.", { perSecond: 1.4 }],
  ["Blocks brand too.", { perSecond: 1.8, block: 1 }],
  ["The brand spreads on a parry.", { perSecond: 2.3, spread: 30 }],
  ["Hotter brand, more stacks.", { perSecond: 3, max: 8 }],
  ["Branded foes take more from you; a parry brands deeper.", { perSecond: 10, taken: 0.2, parry: 4 }],
]);

/** Ember Brand: a parried foe is branded, and every blow on it feeds the brand */
export const EMBER_BRAND: SkillDef = {
  id: "y_brand",
  name: "Ember Brand",
  kind: "dot",
  risk: "precise",
  button: "L",
  text: "A parry brands the attacker with fire, and each of your blows on it adds to the brand.",
  levels,
  evolution: {
    partner: "y_impale",
    name: "Pyre Mark",
    text: "An impale or counter on a branded foe spends the brand in one blast that brands every foe around it.",
    row: evolved(levels, "Impales and counters detonate the brand.", { consume: 12, radius: 40 }),
  },
};
