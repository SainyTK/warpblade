import { fleck, glow, hairline, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { WARDEN } from "./colors";
import { lanternPoint, threadEnds } from "./ward";

export function createWardThreads(e: Enemy, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "summon" && e.hp > 0 && e.stun <= 0;
    },
    draw() {
      place();
      const u = clamp(t / windup);
      const [lx, ly] = lanternPoint(e);
      for (const [tx, ty] of threadEnds(e)) {
        const steps = 10;
        let px = lx;
        let py = ly;
        for (let k = 1; k <= steps * u; k++) {
          const v = k / steps;
          const nx = lerp(lx, tx, v);
          const ny = lerp(ly, ty, v) - Math.sin(v * Math.PI) * 12 + Math.sin(t * 30 + k) * 1.2;
          hairline(px, py, nx, ny, k % 2 ? WARDEN.light[3] : WARDEN.light[4], 0.4 + u * 0.5);
          px = nx;
          py = ny;
        }
        fleck(px, py, WARDEN.light[4], u);
      }
      glow(lx, ly, 8 + u * 10, WARDEN.light[3], 0.25 + u * 0.4);
    },
  };
}
