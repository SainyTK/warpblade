import { GROUND } from "../../../constants/stage";
import { place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { DAY_SPARKS } from "./colors";
import { drawRoot, drawRootWarning } from "./drawRootSpike";

/** how long a root stands at full height, sinks back, and how tall it gets */
const ROOT = { rise: 0.08, stand: 0.32, sink: 0.25, height: 22, half: 4 } as const;
/** one Oakheart root attack: every root it raises shares this, so the line of roots can hurt Kael once */
export interface RootStrike {
  /** the heroes the roots have struck, by place in the room, so each is struck once */
  struck: Set<number>;
}

/** a root under the floor at x: a violet crack runs open for `mark` seconds, then a pointed root bursts up, stands, sinks */
export function createRootSpike(x: number, mark: number, dmg: number, strike: RootStrike, lean: number): Effect {
  let t = 0;
  let burst = false;
  const tall = ROOT.height * rng.range(0.8, 1.1);
  const height = (): number => {
    const u = t - mark;
    if (u < 0) return 0;
    if (u < ROOT.rise) return tall * (u / ROOT.rise);
    if (u < ROOT.rise + ROOT.stand) return tall;
    return tall * Math.max(0, 1 - (u - ROOT.rise - ROOT.stand) / ROOT.sink);
  };
  return {
    update(dt) {
      t += dt;
      if (t < mark) {
        if (rng.chance(0.08)) dust(x + rng.range(-3, 3), GROUND, 1);
        return true;
      }
      if (!burst) {
        burst = true;
        dust(x, GROUND, 4);
        shake(0.08, 1);
        for (let i = 0; i < 5; i++)
          particles.spawn(PK.SHARD, x, GROUND - 2, rng.range(-60, 60), -rng.range(60, 140), rng.range(0.3, 0.6), {
            col: DAY_SPARKS.bark[2],
            size: rng.range(1, 2),
          });
      }
      const h = height();
      eachStanding(() => {
        if (
          strike.struck.has(heroSlot()) ||
          t - mark >= ROOT.rise + ROOT.stand ||
          !boxHit([x - ROOT.half, GROUND - h, x + ROOT.half, GROUND], heroBox())
        )
          return;
        strike.struck.add(heroSlot());
        hurtHero(dmg, x);
      });
      return t < mark + ROOT.rise + ROOT.stand + ROOT.sink;
    },
    draw() {
      place();
      if (t < mark + ROOT.rise) drawRootWarning(x, Math.min(1, t / mark), t);
      const h = height();
      if (h >= 1) drawRoot(x, h, ROOT.half, lean, t < mark + ROOT.rise);
    },
  };
}
