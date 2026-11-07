import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * least: Heat it needs; time: seconds per full bar spent; rate: attack speed while it lasts; burst: each blow's burst
 * in attack damage, over radius pixels; feed: share of Heat blows still build in it; nova: the end nova's ability
 * power multiple (0 off); reach: pixels her blows gain; perKill: seconds a kill adds; hold: the evolution's seconds
 * past each landed blow; scorch: stacks a burst lays
 */
const levels = grow({ least: 60, time: 6, rate: 1.2, burst: 0.9, radius: 16, feed: 0, nova: 0, reach: 0, perKill: 0 }, [
  ["A rite: spend all your Heat to burn hot.", {}],
  ["Overheat feeds on your blows.", { feed: 0.5 }],
  ["Wider bursts.", { radius: 28 }],
  ["Faster and hotter.", { rate: 1.35, burst: 1.5 }],
  ["Overheat ends in a nova.", { nova: 8 }],
  ["Your blows reach further.", { reach: 16 }],
  ["Kills extend Overheat.", { perKill: 0.5 }],
  ["Much faster and hotter.", { rate: 1.6, burst: 3 }],
]);

/** Overheat: bank Heat, then burn it in a short frenzy */
export const OVERHEAT_SKILL: SkillDef = {
  id: "y_overheat",
  name: "Overheat",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A rite: spend all your Heat to burn hot for a while, attacking faster with every blow bursting in flame.",
  levels,
  evolution: {
    partner: "y_searing",
    name: "Sunheart",
    text: "Overheat lasts as long as your blows keep landing, every burst scorches, and it ends in a huge nova.",
    row: evolved(levels, "Burn while your blows land.", { hold: 1.5, scorch: 2, nova: 20 }),
  },
};
