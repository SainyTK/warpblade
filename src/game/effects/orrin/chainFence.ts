import { PAL, SPARKS } from "../../../constants/palette";
import { line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { dealDamage } from "../../damage";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { game, hero, particles, progress, rng } from "../../state";
import { drawLinks } from "./chainLinks";

/** what a fence does, read from Chain Fence's row when it is set */
export interface FenceSpec {
  length: number;
  power: number;
  stumble: number;
  slow: boolean;
  spark: number;
  life: number;
  /** Razor Fence: bleed stacks a crossing adds; the fence follows him */
  razor: number;
}

const KNEE = 7;

/**
 * Chain Fence: two posts on the floor with a chain at knee height between them. A foe that crosses the chain is cut and
 * stumbles, once each time it crosses; the chain sparks at foes near it; evolved, it is barbed and follows him.
 */
export function createChainFence(cx: number, floor: number, spec: FenceSpec): Effect {
  const side = new Map<Enemy, number>();
  const o = { x: cx, t: 0, spark: 0 };
  const half = spec.length / 2;
  return {
    update(dt) {
      o.t += dt;
      // the room swaps the fence's owner in before it steps, so `hero` is the one it follows
      if (spec.razor) o.x += (hero.x - o.x) * Math.min(1, dt * 2);
      o.spark -= dt;
      const sparking = spec.spark > 0 && o.spark <= 0;
      if (sparking) o.spark = 0.5;
      for (const e of game.enemies) {
        if (e.hp <= 0 || e.air) continue;
        const [x0, y0, x1, y1] = enemyBox(e);
        if (y1 < floor - KNEE - 2 || y0 > floor) continue;
        const was = side.get(e);
        const now = Math.sign((x0 + x1) / 2 - o.x) || 1;
        side.set(e, now);
        const within = Math.abs((x0 + x1) / 2 - o.x) < half + 6;
        if (sparking && within && Math.abs((x0 + x1) / 2 - o.x) < half) {
          dealDamage(e, progress.stats.ap * spec.spark, { source: "o_chainfence", dot: true });
          particles.spawn(PK.SPARK, e.x, floor - KNEE, rng.range(-60, 60), -rng.range(40, 100), 0.2, {
            sparks: SPARKS.volt,
          });
        }
        if (was === undefined || was === now || !within) continue;
        const [ex, ey] = enemyCenter(e);
        dealDamage(e, progress.stats.ap * spec.power, { fromX: ex - now * 6, kx: now * 30, source: "o_chainfence" });
        e.stun = Math.max(e.stun, spec.stumble);
        if (spec.slow) e.chill = Math.max(e.chill, 1.5);
        if (spec.razor)
          addStacks(e, "o_barbs", {
            stacks: spec.razor,
            max: 12,
            damage: progress.stats.ad * 0.15,
            every: 0.5,
            duration: 3,
          });
        particles.spawn(PK.SPARK, ex, ey, rng.range(-80, 80), -rng.range(40, 120), 0.25, { sparks: SPARKS.brass });
      }
      return o.t < spec.life;
    },
    drawBack() {
      place();
      const fade = Math.min(1, (spec.life - o.t) / 0.4, o.t / 0.15);
      const B = PAL.brass;
      for (const s of [-1, 1]) {
        const x = o.x + s * half;
        line(x, floor, x, floor - KNEE - 3, B[1], fade);
        px(x, floor - KNEE - 3, B[4], fade);
      }
      const sag = 2 + Math.sin(o.t * 4) * 0.5;
      for (let k = 0; k < 8; k++) {
        const u0 = k / 8;
        const u1 = (k + 1) / 8;
        const y0 = floor - KNEE + Math.sin(Math.PI * u0) * sag;
        const y1 = floor - KNEE + Math.sin(Math.PI * u1) * sag;
        drawLinks(o.x - half + spec.length * u0, y0, o.x - half + spec.length * u1, y1, spec.razor ? B[4] : undefined, fade);
      }
    },
    draw() {},
  };
}
