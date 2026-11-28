import { GROUND, W } from "../../../../constants/stage";
import { glow, hairline, place, viewX } from "../../../../engine/frame";
import { eachStanding } from "../../../../game/coopHooks";
import { fxRng, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { grain } from "../../../../utils/grain";
import { clamp } from "../../../../utils/math";
import { blowBreeze, pushHero } from "../../wind";
import { SKY_FOES as C } from "../colors";
import { mindOf } from "./mind";
import { GUST_PUSH, ROC_WINDUP, stormWindup, stormy } from "./moves";

const STREAKS = 34;
const SPEED = 300;
const CHEVRONS = 5;

function chevron(x: number, y: number, dir: number, a: number): void {
  hairline(x, y - 3, x + dir * 3, y, C.plume[3], a);
  hairline(x + dir * 3, y, x, y + 3, C.plume[3], a);
  hairline(x - dir, y - 3, x + dir * 2, y, C.plume[1], a * 0.7);
}

export function createRocGust(e: Enemy): Effect {
  let t = 0;
  let blowing = 0;
  const live = () => (e.state === "charge" || e.state === "swipe") && e.hp > 0 && e.stagger <= 0;
  return {
    update(dt) {
      t += dt;
      if (!live()) return false;
      if (e.state !== "swipe") return true;
      blowing += dt;
      const dir = mindOf(e).gustDir;
      const storm = stormy(e);
      const ramp = clamp(blowing / 0.25);
      blowBreeze(dir, 0.6 + ramp * 0.4);
      eachStanding(() => {
        pushHero(
          dir * (storm ? GUST_PUSH.airStorm : GUST_PUSH.air) * ramp,
          dir * (storm ? GUST_PUSH.groundStorm : GUST_PUSH.ground) * ramp,
          dt,
        );
      });
      if (fxRng.chance(dt * 30))
        particles.spawn(
          PK.DUST,
          e.x + fxRng.range(-60, 60),
          GROUND - 1,
          dir * fxRng.range(80, 160),
          -fxRng.range(4, 20),
          0.6,
          {
            col: C.plume[1],
            size: fxRng.range(1, 2),
          },
        );
      return true;
    },
    draw() {
      place();
      const dir = mindOf(e).gustDir;
      const left = viewX();
      if (e.state === "charge") {
        const u = clamp(t / (ROC_WINDUP.gust * stormWindup(e)));
        for (let i = 0; i < CHEVRONS; i++) {
          const x = e.x + dir * (30 + i * 22 + ((t * 40) % 22));
          chevron(x, GROUND - 6 - (i % 2) * 8, dir, u * (1 - i / CHEVRONS) * 0.9);
        }
        glow(e.x + dir * 20, e.y + 6, 26, C.plume[1], 0.12 * u);
        return;
      }
      const a = clamp(blowing / 0.2);
      for (let i = 0; i < STREAKS; i++) {
        const y = GROUND - 4 - grain(i, 3) * 86;
        const len = 8 + grain(i, 7) * 18;
        const speed = SPEED * (0.7 + grain(i, 11) * 0.6);
        const span = W + 60;
        const travel = (grain(i, 13) * span + blowing * speed) % span;
        const x = dir > 0 ? left - 30 + travel : left + W + 30 - travel;
        if (grain(i, 17) > a) continue;
        const head = i % 3 === 0 ? 3 : 2;
        hairline(
          x,
          y,
          x - dir * len,
          y + Math.sin(blowing * 6 + i) * 0.8,
          (u) => C.plume[u < 0.3 ? head : u < 0.65 ? 1 : 0],
        );
      }
    },
  };
}
