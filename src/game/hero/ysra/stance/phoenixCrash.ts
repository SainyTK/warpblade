import { EMBER } from "../../../../constants/characters/ysra/look";
import { W } from "../../../../constants/stage";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PF, PK } from "../../../../types/particle";
import { emberBurst } from "../../../effects/emberBurst";
import { drawPhoenix } from "../../../effects/phoenix";
import { layCinder } from "../../../spells/rites/cinder";
import { game, hero, lights, particles, rng } from "../../../state";
import { hitStop, shake } from "../../../world";
import { stance } from "./memory";

/** the floor fire a phoenix crash floods: a patch every this many pixels, each tick this multiple of ability power */
const FLOOD_STEP = 10;
const FLOOD_POWER = 0.5;

/** Phoenix Dive: while she dives, a phoenix of forge-fire wraps her, wings opening as she falls */
export function createPhoenixWings(): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      const on = hero.state === "dive" && !stance.landed;
      if (on && rng.chance(0.8))
        particles.spawn(
          PK.FIRE,
          hero.x + rng.range(-4, 4),
          hero.y - rng.range(4, 16),
          rng.range(-30, 30),
          -rng.range(10, 50),
          0.35,
          {
            col: 0,
            size: rng.range(1.6, 3),
            flag: rng.chance(0.2) ? PF.SMOKES : 0,
          },
        );
      if (on) lights.add(hero.x, hero.y - 10, 50, EMBER[4], 0.6, 0.05);
      return on;
    },
    draw() {
      drawPhoenix(hero.x, hero.y - 10, hero.face * Math.SQRT1_2, Math.SQRT1_2, Math.min(1, 0.4 + t * 4), game.t * 30);
    },
  };
}

/** the phoenix bursts where she lands: a blast of embers, wings of fire along the floor both ways, and the floor
 *  flooded with fire `reach` pixels each way for `flood` seconds */
export function phoenixCrash(x: number, floor: number, reach: number, flood: number): void {
  emberBurst(x, floor - 6, reach * 0.8, floor);
  for (let fx = x - reach; fx <= x + reach; fx += FLOOD_STEP)
    if (fx > 4 && fx < W - 4)
      layCinder(fx, floor, {
        life: flood,
        power: FLOOD_POWER,
        halfWidth: FLOOD_STEP / 2,
        overlap: 1,
        halt: 0,
        source: "y_dive",
      });
  for (let i = 0; i < 40; i++) {
    const dir = rng.chance(0.5) ? 1 : -1;
    particles.spawn(
      PK.FIRE,
      x,
      floor - rng.range(1, 8),
      dir * rng.range(80, 260),
      -rng.range(5, 40),
      rng.range(0.3, 0.6),
      {
        col: 0,
        size: rng.range(1.6, 3),
        flag: rng.chance(0.3) ? PF.SMOKES : 0,
      },
    );
  }
  hitStop(0.07);
  shake(0.35, 5);
  sfx.boom();
}
