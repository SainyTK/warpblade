import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * The warp's numbers (`WarpTune`): cost MP, recharge seconds, charges, strike the arrival's attack damage multiple,
 * perPx and cap its distance bonus, path the thrown glaive's cut on its way. Her own: heat, Heat the arrival builds;
 * burn, seconds the wrench sets foes burning (0 off); rail, the attack damage multiple of the rail of fire that runs back
 * along the warp's line (0 off); back, the rail runs out again; pin, seconds the wrench pins what it strikes (0 off)
 */
const levels = grow({ cost: 6, recharge: 1.5, charges: 1, heat: 12, burn: 0, rail: 0 }, [
  ["The warp costs 6 MP and recharges in 1.5 s; the arrival builds more Heat.", {}],
  ["The thrown glaive cuts every foe on its way.", { path: 1 }],
  ["The wrench sets foes burning.", { burn: 2 }],
  ["The longer the throw, the harder the arrival.", { perPx: 0.025, cap: 5 }],
  ["Two warp charges.", { charges: 2 }],
  ["A rail of fire runs back along the warp's line and strikes it again.", { rail: 1.2 }],
  ["Recharge 1.5 to 1.1 s; the arrival builds even more Heat.", { recharge: 1.1, heat: 18 }],
  ["Arrival 1.8 to 7; the glaive's flight and the rail cut harder.", { strike: 7, path: 2.5, rail: 2 }],
]);

/** Ember Javelin: the hurled glaive comes back sooner, cuts its way in and leaves a rail of fire */
export const EMBER_JAVELIN: SkillDef = {
  id: "y_javelin",
  name: "Ember Javelin",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Hold J: the hurled glaive costs less, comes back sooner, cuts its way in and leaves a rail of fire.",
  levels,
  evolution: {
    partner: "y_warpath",
    name: "Rail Lance",
    text: "The rail runs back and out again, and the wrench pins every foe it strikes for 2 seconds.",
    row: evolved(levels, "The rail runs out and back; the wrench pins.", { back: 1, pin: 2 }),
  },
};
