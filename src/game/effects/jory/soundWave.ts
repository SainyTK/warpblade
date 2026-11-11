import { PAL } from "../../../constants/palette";
import { fleck, glow, place, px } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { grain } from "../../../utils/grain";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, particles, rng } from "../../state";
import { boxHit } from "../../world";
import { createImpact } from "../impact";

/** one sound wave along the floor: where it leaves from, which way, how far and how fast, and what it does to a foe */
export interface SoundWaveSpec {
  x: number;
  floor: number;
  dir: number;
  reach: number;
  speed: number;
  /** damage to each foe it passes, already worked out from his stats */
  damage: number;
  /** how tall the wave stands, in art pixels */
  height: number;
  /** a minion it passes staggers this long, or is knocked down with this throw */
  stagger?: number;
  launch?: number;
  /** the hit's source: the hero's own press when left out */
  source?: SourceId;
  /** turns back at the stage's edge and runs home (Crash Wave's bounce) */
  bounce?: boolean;
  /** stops at the first foe it lands on; otherwise it passes through every foe */
  stops?: boolean;
  /** seconds a foe it passes is slowed */
  slow?: number;
  /** told of each foe it lands on */
  struck?: (e: Enemy) => void;
}

/** the arcs that make up the wave front, nearest the leading edge first, in art pixels behind it */
const ARCS = [0, 4, 8] as const;

/**
 * A sound wave that runs along the floor and passes through foes, striking each once: three concentric cobalt arcs
 * leaning ahead, the leading one brightest, the trailing ones breaking up, with dust lifted off the floor under them
 */
export function createSoundWave(s: SoundWaveSpec): Effect {
  let travelled = 0;
  let dir = s.dir;
  let x = s.x;
  let bounced = false;
  let done = false;
  const hit = new Set<Enemy>();
  const seed = Math.floor(s.x * 3 + s.reach);
  const strike = () => {
    const front = x;
    const box = [Math.min(front, front - dir * 10), s.floor - s.height, Math.max(front, front - dir * 10), s.floor];
    for (const e of game.enemies) {
      if (e.hp <= 0 || hit.has(e) || !boxHit(box as [number, number, number, number], enemyBox(e))) continue;
      hit.add(e);
      const result = dealDamage(e, s.damage, {
        fromX: front - dir * 6,
        kx: dir * 40,
        stagger: s.stagger,
        launch: s.launch,
        source: s.source,
      });
      if (result === "blocked") continue;
      if (s.slow) e.chill = Math.max(e.chill, s.slow);
      game.fx.push(createImpact(e.x, s.floor - 10, dir, false, [PAL.beat[5], PAL.beat[4], PAL.beat[3], PAL.beat[2]]));
      s.struck?.(e);
      if (s.stops) done = true;
    }
  };
  return {
    update(dt) {
      const step = s.speed * dt;
      travelled += step;
      x += dir * step;
      if (s.bounce && !bounced && (x < 8 || x > 312)) {
        bounced = true;
        dir = -dir;
        hit.clear();
      }
      strike();
      if (done) return false;
      if (rng.chance(0.5))
        particles.spawn(PK.DUST, x, s.floor - 1, -dir * rng.range(10, 30), -rng.range(10, 24), rng.range(0.2, 0.4));
      return travelled < s.reach * (s.bounce ? 2 : 1);
    },
    draw() {
      place();
      const left = s.reach * (s.bounce ? 2 : 1) - travelled;
      const fade = Math.min(1, left / 24);
      for (let a = 0; a < ARCS.length; a++) {
        const ax = x - dir * ARCS[a];
        const k = fade * (1 - a * 0.28);
        const c = PAL.beat[5 - a];
        for (let i = 0; i <= s.height * 2; i++) {
          const v = i / (s.height * 2);
          // the front leans ahead at its middle, like a curved sound line
          const lean = Math.sin(v * Math.PI) * 3;
          if (a > 0 && grain(i + a * 31, seed) < 0.3 * a) continue;
          const fx = ax + dir * lean;
          const fy = s.floor - v * s.height;
          // the leading arc is a full art pixel wide with a dark edge behind it, so it reads against bright scenery
          if (a === 0) {
            px(fx - dir, fy, PAL.beat[1], k * 0.8);
            px(fx, fy, c, k);
          } else fleck(fx, fy, c, k * 1.4);
        }
      }
      glow(x, s.floor - s.height / 2, s.height * 0.7, PAL.beat[3], 0.18 * fade);
    },
  };
}
