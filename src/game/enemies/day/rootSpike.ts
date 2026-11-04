import { GROUND } from "../../../constants/stage";
import { glow, line, place, polygon, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { DAY_SPARKS, DAY_COLORS as DC } from "./colors";

/** how long a root stands at full height, sinks back, and how tall it gets */
const ROOT = { rise: 0.08, stand: 0.32, sink: 0.25, height: 22, half: 4 } as const;
/** one Oakheart root attack: every root it raises shares this, so the line of roots can hurt Kael once */
export interface RootStrike {
  hit: boolean;
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
      if (
        !strike.hit &&
        t - mark < ROOT.rise + ROOT.stand &&
        boxHit([x - ROOT.half, GROUND - h, x + ROOT.half, GROUND], heroBox())
      ) {
        strike.hit = true;
        hurtHero(dmg, x);
      }
      return t < mark + ROOT.rise + ROOT.stand + ROOT.sink;
    },
    draw() {
      place();
      const B = DC.bark;
      if (t < mark + ROOT.rise) {
        // the warning: a crack in the floor that widens and brightens until the root breaks through
        const k = Math.min(1, t / mark);
        const w = 2 + k * 4;
        line(x - w, GROUND, x + w, GROUND, k > 0.7 ? DC.crackHot : DC.crack, 0.5 + k * 0.5);
        px(x - w * 0.5, GROUND - 1, DC.crack, k);
        px(x + w * 0.6, GROUND + 1, DC.crack, k);
        glow(x, GROUND, 6 + k * 6, DC.crack, 0.2 + k * 0.35);
      }
      const h = height();
      if (h < 1) return;
      const top = GROUND - h;
      const tip = x + lean * h * 0.18;
      polygon(
        [
          [x - ROOT.half, GROUND],
          [tip, top],
          [x + ROOT.half, GROUND],
        ],
        B[2],
      );
      polygon(
        [
          [x - 1, GROUND],
          [tip, top],
          [x + ROOT.half, GROUND],
        ],
        B[3],
      );
      line(x - ROOT.half - 1, GROUND, tip - 1, top, DC.outline);
      line(x + ROOT.half + 1, GROUND, tip + 1, top, DC.outline);
      line(x + 1, GROUND - 2, tip + 0.5, top + 2, B[4]);
      px(tip, top - 1, DC.outline);
      px(tip, top, DC.thornTip);
      // a pair of leaves and a fleck of rift light where it broke the floor
      if (h > 10) {
        px(x - 3, GROUND - h * 0.55, DC.leaf[3]);
        px(x - 4, GROUND - h * 0.55 - 1, DC.leaf[4]);
        px(x + 3, GROUND - h * 0.35, DC.leaf[2]);
      }
      glow(x, GROUND - 2, 10, DC.crack, 0.25);
    },
  };
}
