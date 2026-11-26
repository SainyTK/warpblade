import { BIG_KILL } from "../../constants/hitFeel";
import { circle, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { WHITE } from "../../utils/color";
import { ease, TAU } from "../../utils/math";
import { fxRng } from "../state";
import { fineRing, ray } from "./fine";

export function createKillBurst(x: number, y: number, boss: boolean, ramp: Ramp): Effect {
  const reach = boss ? BIG_KILL.bossRing : BIG_KILL.ring;
  const rays = Array.from({ length: BIG_KILL.rays }, (_, i) => ({
    a: (i / BIG_KILL.rays) * TAU + fxRng.range(-0.25, 0.25),
    len: reach * fxRng.range(0.6, 1.1),
  }));
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < BIG_KILL.life;
    },
    draw() {
      place();
      const u = t / BIG_KILL.life;
      const f = 1 - u;
      const open = ease.outCubic(u);
      for (const r of rays)
        ray(x, y, r.a, r.len * open * 0.55, r.len * open, u < 0.3 ? WHITE : ramp[4], ramp[3], f * 1.4);
      const ring = reach * open + 2;
      fineRing(x, y, ring, ring * 0.8, ramp[5], f * f * 1.6);
      fineRing(x, y, ring * 0.7, ring * 0.56, ramp[3], f * f);
      if (u < BIG_KILL.coreUntil) {
        const core = BIG_KILL.core * (1 - u / BIG_KILL.coreUntil) + 1;
        circle(x, y, core + 1.5, ramp[4]);
        circle(x, y, core * 0.5, WHITE);
      }
    },
  };
}
