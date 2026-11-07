import { KNUCKLE_WAVE } from "../../constants/hulda/knuckleWave";
import { ellipseRing, glow, hairline, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, progress } from "../state";
import { boxHit } from "../world";
import { createImpact } from "./impact";

/** one wave: where it starts, which way, how far, what it deals; read from Knuckle Wave's row when the blow lands */
export interface WaveSpec {
  x: number;
  floor: number;
  dir: number;
  reach: number;
  power: number;
  pierce: boolean;
  stagger: number;
  /** radius of the burst where it ends; 0 for none */
  ring: number;
}

/** strike every foe whose middle is within `r` of a point, once */
function burst(x: number, y: number, r: number, s: WaveSpec, struck: Set<Enemy>): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > r) continue;
    struck.add(e);
    dealDamage(e, progress.stats.ad * s.power, {
      fromX: x,
      kx: Math.sign(cx - x) * KNUCKLE_WAVE.kick,
      stagger: s.stagger,
    });
  }
  sfx.hit(false, 0.7);
}

/**
 * A pressure wave pushed off Hulda's fist: it travels along at fist height and strikes each foe it meets once (the first
 * only, until it pierces), and the evolved wave bursts in a ring where it ends. It rides her blow, so its hits count as
 * her attacks.
 */
export function createKnuckleWave(s: WaveSpec, ramp: Ramp): Effect {
  const struck = new Set<Enemy>();
  const y = s.floor - KNUCKLE_WAVE.height;
  let run = 0;
  let spent = false;
  let ringT = -1;
  const front = (): number => s.x + s.dir * run;
  return {
    update(dt) {
      if (ringT >= 0) {
        ringT += dt;
        return ringT < KNUCKLE_WAVE.ringLife;
      }
      run = Math.min(s.reach, run + KNUCKLE_WAVE.speed * dt);
      const x = front();
      const half = KNUCKLE_WAVE.tall / 2;
      const box = [Math.min(x, x - s.dir * 6), y - half, Math.max(x, x - s.dir * 6), y + half] as const;
      for (const e of game.enemies) {
        if (spent || e.hp <= 0 || struck.has(e) || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        const [cx, cy] = enemyCenter(e);
        dealDamage(e, progress.stats.ad * s.power, {
          fromX: x - s.dir * 8,
          kx: s.dir * KNUCKLE_WAVE.kick,
          stagger: s.stagger,
        });
        game.fx.push(createImpact(cx - s.dir * 3, cy, s.dir, false));
        if (!s.pierce) spent = true;
      }
      if (run < s.reach && !spent) return true;
      if (!s.ring) return false;
      ringT = 0;
      burst(x, y, s.ring, s, struck);
      return true;
    },
    draw() {
      place();
      if (ringT >= 0) {
        const k = ringT / KNUCKLE_WAVE.ringLife;
        ellipseRing(
          front(),
          y,
          s.ring * (0.4 + k * 0.6),
          s.ring * 0.5 * (0.4 + k * 0.6),
          ramp[5 - Math.round(k * 2)],
          1 - k,
        );
        glow(front(), y, s.ring * 0.6, ramp[3], 0.3 * (1 - k));
        return;
      }
      // a bright crescent of pushed air with two faint echoes behind it
      const x = front();
      const fade = 1 - (run / s.reach) * 0.6;
      for (let i = 0; i < 3; i++) {
        const bx = x - s.dir * i * 3;
        const c = ramp[6 - i * 2];
        for (let dy = -6; dy <= 6; dy++) {
          const bend = Math.round((dy * dy) / 12);
          px(bx - s.dir * bend, y + dy, c, fade * (1 - i * 0.3));
          if (i === 0) px(bx - s.dir * (bend + 1), y + dy, ramp[4], fade * 0.8);
        }
      }
      hairline(x - s.dir * 10, y - 3, x - s.dir * 3, y - 3, ramp[4], fade * 0.5);
      hairline(x - s.dir * 10, y + 3, x - s.dir * 3, y + 3, ramp[4], fade * 0.5);
      glow(x, y, 8, ramp[4], 0.35 * fade);
    },
  };
}
