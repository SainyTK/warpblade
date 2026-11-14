import { hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { game, hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp, TAU } from "../../../../utils/math";
import { STORE_ANGLE } from "../moves/slashes";
import { storeCut } from "../store";

/** an ink arc that stays: its life, what it deals and stores, and whether it turns round her as a ring */
export interface InkArcSpec {
  life: number;
  now: number;
  store: number;
  ring: boolean;
}

/** how far the arc stands from her and how thick it is, how often it cuts the same foe, and how fast the ring turns */
const ARC = { radius: 22, width: 2.5, every: 0.5, spin: 6 } as const;

/**
 * Reverse Edge's crescent: an ink arc left standing where the return cut swept, cutting each foe that touches it once
 * (a ring round her cuts each foe every half second), with a white rim, thinning as it fades.
 */
export function createInkArc(o: InkArcSpec): Effect {
  const x0 = hero.x;
  const y0 = hero.y - 20;
  const face = hero.face;
  const last = new Map<Enemy, number>();
  let t = 0;
  const center = (): [number, number] => (o.ring ? [hero.x, hero.y - 18] : [x0, y0]);
  const covers = (e: Enemy): boolean => {
    const [cx, cy] = center();
    const [ex, ey] = enemyCenter(e);
    const d = Math.hypot(ex - cx, ey - cy);
    if (Math.abs(d - ARC.radius) > 10) return false;
    return o.ring || Math.sign(ex - cx) === face;
  };
  return {
    update(dt) {
      t += dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || !covers(e)) continue;
        const at = last.get(e);
        if (at !== undefined && (!o.ring || t - at < ARC.every)) continue;
        last.set(e, t);
        const [cx] = center();
        dealDamage(e, o.now, { fromX: cx, kx: Math.sign(e.x - cx) * 30, ky: -30 });
        if (o.store) storeCut(e, o.store, STORE_ANGLE.returnCut);
      }
      return t < o.life;
    },
    draw() {
      place();
      const u = clamp(t / o.life);
      const [cx, cy] = center();
      const ramp = skin.ramp;
      const spin = o.ring ? t * ARC.spin : 0;
      const span = o.ring ? TAU : 2.4;
      const a0 = o.ring ? spin : face > 0 ? -1.2 : Math.PI - 1.2;
      const steps = o.ring ? 28 : 12;
      for (let i = 0; i < steps; i++) {
        const a = a0 + (span * i) / steps;
        const b = a0 + (span * (i + 1)) / steps;
        const w =
          ARC.width *
          (1 - u * 0.6) *
          (o.ring ? 0.6 + 0.4 * Math.sin(i * 0.9 + spin) : Math.sin((Math.PI * (i + 0.5)) / steps));
        for (let k = 0; k <= w; k += 0.5) {
          const r = ARC.radius - k;
          line(
            cx + Math.cos(a) * r,
            cy + Math.sin(a) * r * 0.8,
            cx + Math.cos(b) * r,
            cy + Math.sin(b) * r * 0.8,
            ramp[k > w * 0.6 ? 2 : 1],
            1 - u * 0.4,
          );
        }
        hairline(
          cx + Math.cos(a) * (ARC.radius + 0.5),
          cy + Math.sin(a) * (ARC.radius + 0.5) * 0.8,
          cx + Math.cos(b) * (ARC.radius + 0.5),
          cy + Math.sin(b) * (ARC.radius + 0.5) * 0.8,
          WHITE,
          1 - u,
        );
      }
    },
  };
}
