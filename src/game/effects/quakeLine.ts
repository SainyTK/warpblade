import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { enemyCenter, walks } from "../enemies/enemy";
import { floorThud } from "../hero/hulda/effects/thud";
import { game, particles, rng } from "../state";
import { createFloorCrack, type FloorCrack } from "./floorCrack";

/** pixels a second the crack runs, and how often it throws a rock chunk up */
const SPEED = 380;
const CHUNK_EVERY = 10;

export interface Quake {
  /** where the fists hit, and the floor the crack runs along */
  x: number;
  floor: number;
  /** the crack's far ends, each side */
  ends: readonly number[];
  ramp: Ramp;
  /** seconds after the cast before the crack starts, the fists' fall */
  delay: number;
  /** the fists hit the floor */
  slam(): void;
  /** a foe on the floor the crack has reached */
  strike(e: Enemy): void;
}

/**
 * Quake Drop's crack: it runs out from her fists to each end, lit from below in her ramp and throwing rock chunks up,
 * and strikes every foe standing on the floor once as it passes under them.
 */
export function createQuakeLine(q: Quake): Effect {
  const struck = new Set<Enemy>();
  let cracks: FloorCrack[] | null = null;
  let thrown = 0;
  let t = 0;
  const start = () => {
    cracks = q.ends.map((end) => createFloorCrack(q.x, end, q.floor, SPEED, q.ramp));
    for (const c of cracks) game.fx.push(c);
    floorThud(q.x, q.floor, "big");
    q.slam();
  };
  return {
    update(dt) {
      t += dt;
      if (t < q.delay) return true;
      if (!cracks) start();
      const run = cracks ?? [];
      const reach = run[0]?.front() ?? 0;
      while (thrown * CHUNK_EVERY < reach) {
        thrown++;
        for (const end of q.ends) {
          const x = q.x + Math.sign(end - q.x) * thrown * CHUNK_EVERY;
          if (Math.abs(x - q.x) > Math.abs(end - q.x)) continue;
          for (let i = 0; i < 2; i++)
            particles.spawn(PK.SHARD, x, q.floor - 1, rng.range(-30, 30), -rng.range(90, 180), rng.range(0.5, 0.9), {
              col: rng.chance(0.5) ? q.ramp[2] : q.ramp[1],
              size: rng.range(2, 3.5),
            });
        }
      }
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || e.air || !walks(e)) continue;
        const [cx] = enemyCenter(e);
        const hit = q.ends.some((end, i) => {
          const dir = Math.sign(end - q.x) || 1;
          const along = (cx - q.x) * dir;
          return along >= -6 && along <= (run[i]?.front() ?? 0) + 4;
        });
        if (!hit) continue;
        struck.add(e);
        q.strike(e);
      }
      return run.some((c, i) => c.front() < Math.abs(q.ends[i] - q.x));
    },
    draw() {},
  };
}
