import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the counter's attack damage multiple; window: seconds of the parry window; firm: share blocks cost less
 * stamina; crit: the counter always crits; stun: seconds it stuns; line: pixels it pierces ahead (0 off); refill:
 * a counter refills stamina; riposte: the bonus string blows deal after a counter, for riposteTime seconds; beam: the
 * evolved counter crosses the stage; critTime: seconds every blow crits after it
 */
const levels = grow({ power: 3.75, window: 0.12, firm: 0, crit: 0, stun: 1.1, line: 0, refill: 0, riposte: 0 }, [
  ["After a parry, J is a counter thrust.", { power: 8 }],
  ["A wider parry window and cheaper blocks.", { power: 9, window: 0.18, firm: 0.3 }],
  ["The counter always crits and stuns longer.", { power: 11, crit: 1, stun: 1.5 }],
  ["Counter damage +20%.", { power: 13 }],
  ["The counter runs through the line.", { power: 15, line: 70 }],
  ["Wider parry window; counters refill stamina.", { power: 17, window: 0.24, refill: 1 }],
  ["Counters empower your next blows.", { power: 35, riposte: 1, riposteTime: 3 }],
  ["Counter damage doubled.", { power: 70 }],
]);

/** Counter Thrust: the parry opens a counter that hits very hard and turns into a buff */
export const COUNTER: SkillDef = {
  id: "y_counter",
  name: "Counter Thrust",
  kind: "attack",
  risk: "precise",
  button: "L",
  text: "After a parry, J is a counter thrust that hits very hard.",
  levels,
  evolution: {
    partner: "y_brand",
    name: "Sun Piercer",
    text: "The counter is a burning thrust across the whole stage, and for 4 seconds after it every blow is a critical hit.",
    row: evolved(levels, "A thrust across the stage; then every blow crits.", { power: 90, beam: 1, critTime: 4 }),
  },
};
