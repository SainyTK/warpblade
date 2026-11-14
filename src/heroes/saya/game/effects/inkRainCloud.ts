import { GROUND } from "../../../../constants/stage";
import { circle, fleck, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, rng } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { approach, clamp } from "../../../../utils/math";
import { RAIN } from "../../constants/spells";
import { STORE_ANGLE } from "../moves/slashes";
import { storeCut } from "../store";

/** what a cloud of Ink Rain does: where it hangs, how wide, how long, what each drop deals and does */
export interface RainSpec {
  x: number;
  width: number;
  time: number;
  drop: number;
  store: number;
  stagger: number;
  follow: boolean;
  pin: number;
  last: number;
}

/** one falling drop */
interface Drop {
  x: number;
  y: number;
  big: boolean;
}

/**
 * Ink Rain: a dark cloud over the floor ahead that rains ink for its time; each drop that meets a foe cuts it a
 * little and stores a small cut, and with the skill's levels staggers it, pins a foe struck five times, drifts after
 * the nearest foe and ends in one great drop.
 */
export function createInkRain(o: RainSpec): Effect {
  const drops: Drop[] = [];
  const hits = new Map<Enemy, number>();
  let x = o.x;
  let t = 0;
  let next = 0;
  let ended = false;
  const top = GROUND - RAIN.height;
  const strike = (d: Drop): boolean => {
    for (const e of game.enemies) {
      if (e.hp <= 0 || !boxHit([d.x - 1, d.y - 3, d.x + 1, d.y + 1], enemyBox(e))) continue;
      const power = d.big ? o.last : o.drop;
      dealDamage(e, power, {
        fromX: d.x,
        stagger: o.stagger || undefined,
        stun: d.big ? RAIN.lastStun : undefined,
        source: "abilities",
      });
      storeCut(e, o.store, STORE_ANGLE.rise, "abilities");
      const n = (hits.get(e) ?? 0) + 1;
      hits.set(e, n);
      if (o.pin && n % RAIN.pinAfter === 0) e.pinned = Math.max(e.pinned, o.pin);
      return true;
    }
    return d.y >= GROUND;
  };
  return {
    update(dt) {
      t += dt;
      if (o.follow) {
        const foe = nearestFoe(x, GROUND - 10);
        if (foe) x = approach(x, foe.x, RAIN.drift * dt);
      }
      next -= dt;
      while (t < o.time && next <= 0) {
        next += RAIN.every;
        drops.push({ x: x + rng.range(-o.width / 2, o.width / 2), y: top, big: false });
      }
      if (t >= o.time && o.last && !ended) {
        ended = true;
        drops.push({ x, y: top, big: true });
      }
      for (const d of drops) d.y += RAIN.fall * dt;
      const left = drops.filter((d) => !strike(d));
      drops.length = 0;
      drops.push(...left);
      return t < o.time || drops.length > 0;
    },
    draw() {
      place();
      const ramp = skin.ramp;
      const fade = clamp((o.time - t) / 0.3);
      if (fade > 0) {
        const half = o.width / 2;
        for (let k = -half; k <= half; k += 7) {
          const r = 3 + 2.5 * Math.abs(Math.sin(k * 0.7)) * Math.cos((k / half) * 1.2);
          const y = top - 3 - r * 0.6 + Math.sin(k + t * 3) * 0.5;
          circle(x + k, y, r, ramp[1], fade);
          circle(x + k - 1, y - 1, r * 0.55, ramp[2], fade);
          fleck(x + k - 1, y - r + 0.5, WHITE, fade);
        }
        hairline(x - half, top + 1, x + half, top + 1, ramp[3], 0.7 * fade);
      }
      for (const d of drops) {
        if (d.big) {
          circle(d.x, d.y, 2.2, ramp[1]);
          fleck(d.x - 0.8, d.y - 1, WHITE);
        } else {
          line(d.x, d.y - 3, d.x, d.y, ramp[1]);
          fleck(d.x + 0.5, d.y - 3, WHITE);
        }
      }
    },
  };
}
