import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * power: the counter's attack damage multiple; time: seconds after a parry in which J is the counter; firm: share
 * blocks cost less stamina; crit: the counter always crits; stun: seconds it stuns; line: pixels it pierces ahead (0
 * off); refill: a counter refills stamina; riposte: the bonus string blows deal after a counter, for riposteTime
 * seconds; beam: the evolved counter crosses the stage; critTime: seconds every blow crits after it
 */
const levels = grow({ power: 3.75, time: 0.8, firm: 0, crit: 0, stun: 1.1, line: 0, refill: 0, riposte: 0 }, [
  ["The counter thrust after a parry hits far harder.", { power: 8 }],
  ["Cheaper blocks; J stays a counter longer after a parry.", { power: 9, time: 1.2, firm: 0.3 }],
  ["The counter always crits and stuns longer.", { power: 11, crit: 1, stun: 1.5 }],
  ["Counter damage +20%.", { power: 13 }],
  ["The counter runs through the line.", { power: 15, line: 70 }],
  ["Counters refill stamina.", { power: 19, refill: 1 }],
  ["Counters empower your next blows.", { power: 35, riposte: 1, riposteTime: 3 }],
  ["Counter damage up.", { power: 45 }],
]);

/** Counter Thrust: the counter a parry opens hits very hard and turns into a buff */
export const COUNTER: SkillDef = {
  id: "y_counter",
  name: "Counter Thrust",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "The counter thrust, J right after a parry, hits very hard and grows into a buff.",
  levels,
  evolution: {
    partner: "y_brand",
    name: "Sun Piercer",
    text: "The counter is a burning thrust across the whole stage, and for 4 seconds after it every blow is a critical hit.",
    row: evolved(levels, "A thrust across the stage; then every blow crits.", { power: 120, beam: 1, critTime: 4 }),
  },
};
