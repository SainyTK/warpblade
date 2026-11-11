import { KNUCKLE_WAVE } from "../../constants/hulda/knuckleWave";
import { WAVE_LOOK } from "../../constants/hulda/look";
import { fleck, glow, hairline, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { grain } from "../../utils/grain";
import { ease, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, progress } from "../state";
import { boxHit } from "../world";
import { fineRing, ray } from "./fine";
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
        const r = s.ring * (0.4 + ease.outCubic(k) * 0.6);
        const fade = (1 - k) * 2;
        // the burst: a bright ring with a dark rim and a dimmer one inside it, and rays thrown out past it
        fineRing(front(), y, r + 0.5, (r + 0.5) * 0.5, ramp[2], fade);
        fineRing(front(), y, r, r * 0.5, ramp[5 - Math.round(k * 2)], fade);
        fineRing(front(), y, r * 0.7, r * 0.35, ramp[3], fade * 0.6);
        for (let i = 0; i < WAVE_LOOK.rays; i++) {
          const a = ((i + grain(i, s.x)) / WAVE_LOOK.rays) * TAU;
          ray(front(), y, a, r * 0.8, r * (1.05 + 0.25 * grain(s.x, i)), ramp[6], ramp[4], fade);
        }
        glow(front(), y, WAVE_LOOK.light, ramp[3], 0.3 * (1 - k));
        return;
      }
      // a crescent of pushed air, bright with a dark rim, two thinner echoes behind it and lines of wind between them
      const x = front();
      const fade = 1 - (run / s.reach) * 0.6;
      const half = WAVE_LOOK.half;
      for (let dy = -half; dy <= half; dy += 0.5) {
        const bend = (dy * dy) / WAVE_LOOK.bend;
        const edge = 1 - Math.abs(dy) / half;
        const fx = x - s.dir * bend;
        fleck(fx + s.dir, y + dy, ramp[2], fade * 2);
        fleck(fx + s.dir * 0.5, y + dy, ramp[3], fade * 2);
        fleck(fx, y + dy, ramp[6], fade * 2);
        if (edge > 0.2) fleck(fx - s.dir * 0.5, y + dy, ramp[5], fade * 2);
        if (edge > 0.45) fleck(fx - s.dir, y + dy, ramp[4], fade * 1.4);
        for (let i = 1; i <= WAVE_LOOK.echoes; i++)
          if (edge > i * 0.25) fleck(fx - s.dir * i * WAVE_LOOK.echoGap, y + dy, ramp[5 - i], fade * (1 - i * 0.3));
      }
      for (const [dy, len] of WAVE_LOOK.wind)
        hairline(x - s.dir * (len + 3), y + dy, x - s.dir * 3, y + dy, ramp[4], (u) => fade * u * 0.8);
      glow(x, y, WAVE_LOOK.light, ramp[3], 0.3 * fade);
    },
  };
}
