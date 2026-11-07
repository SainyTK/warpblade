import { PAL, SPARKS } from "../../constants/palette";
import { SHARD_ORBIT as O } from "../../constants/relics/shards";
import { ellipseRing, glow, place, polygon, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { RelicBehavior, RelicMemory } from "../../types/build";
import { PK } from "../../types/particle";
import { buildStats, relicStats } from "../../utils/build";
import { WHITE } from "../../utils/color";
import { approach, TAU } from "../../utils/math";
import { pruneHits, type RelicHit, takeHit } from "../../utils/relicHits";
import { dealDamage } from "../damage";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, particles, progress, rng } from "../state";
import { touches } from "./relicTargets";

type ShardMemory = {
  /** seconds since the hero took the relic */
  t: number;
  /** seconds left circling, then seconds left resting */
  on: number;
  rest: number;
  /** angle of the first shard */
  angle: number;
  /** 0 hidden to 1 full size */
  grow: number;
  /** seconds until the next hit may chime */
  chime: number;
  hits: RelicHit[];
};

const memoryOf = (m: RelicMemory): ShardMemory => m as ShardMemory;
const stats = (level: number, evolved: boolean) => relicStats("shards", level, evolved, buildStats(progress.build));
const middleY = (): number => hero.y - O.lift;

/** where shard i of n sits on the tilted orbit, and whether it is on the near half */
function shardAt(m: ShardMemory, i: number, n: number, radius: number): [number, number, boolean] {
  const a = m.angle + (i * TAU) / n;
  const s = Math.sin(a);
  return [hero.x + Math.cos(a) * radius, middleY() + s * radius * O.tilt, s > 0];
}

/** shards breaking up into glints as they rest */
function scatter(m: ShardMemory, n: number, radius: number): void {
  for (let i = 0; i < n; i++) {
    const [x, y] = shardAt(m, i, n, radius);
    for (let k = 0; k < 4; k++)
      particles.spawn(PK.SPARK, x, y, rng.range(-50, 50), rng.range(-70, 10), rng.range(0.15, 0.3), {
        sparks: SPARKS.crystal,
      });
  }
}

function strike(m: ShardMemory, level: number, evolved: boolean): void {
  const s = stats(level, evolved);
  const radius = O.radius * s.area;
  for (let i = 0; i < s.amount; i++) {
    const [x, y] = shardAt(m, i, s.amount, radius);
    for (const e of game.enemies) {
      if (e.hp <= 0 || !touches(e, x, y, O.reach) || !takeHit(m.hits, e, i, m.t, O.gap)) continue;
      const side = Math.sign(enemyCenter(e)[0] - hero.x) || hero.face;
      dealDamage(e, s.damage, { source: "shards", fromX: x, kx: side * O.kick });
      for (let k = 0; k < 3; k++)
        particles.spawn(PK.SPARK, x, y, side * rng.range(40, 110), rng.range(-80, 20), rng.range(0.12, 0.25), {
          sparks: SPARKS.crystal,
        });
      if (m.chime <= 0) {
        sfx.chime(4);
        m.chime = O.gap / 3;
      }
    }
  }
}

/** one crystal shard, spinning on its long axis; the near ones are drawn larger */
function drawShard(x: number, y: number, size: number, spin: number, evolved: boolean): void {
  const C = PAL.crystal;
  const h = (evolved ? 4.5 : 3.5) * size;
  const w = (0.7 + Math.abs(Math.cos(spin)) * (evolved ? 1.6 : 1.3)) * size;
  const lit = Math.cos(spin) > 0;
  polygon(
    [
      [x, y - h],
      [x + w, y],
      [x, y + h],
      [x - w, y],
    ],
    (u) => (u < x === lit ? C[5] : C[3]),
  );
  px(x - 0.5, y - h + 1, WHITE);
  if (evolved) px(x - 0.5, y - 0.5, C[6]);
  glow(x, y, evolved ? 9 : 6, C[4], evolved ? 0.34 : 0.24);
}

/** a short arc of fading glints behind each shard */
function drawTrail(m: ShardMemory, i: number, n: number, radius: number, near: boolean, evolved: boolean): void {
  const C = PAL.crystal;
  const steps = evolved ? 5 : 3;
  for (let k = 1; k <= steps; k++) {
    const a = m.angle + (i * TAU) / n - k * 0.14;
    const s = Math.sin(a);
    if (s > 0 !== near) continue;
    px(hero.x + Math.cos(a) * radius, middleY() + s * radius * O.tilt, k === 1 ? C[4] : C[3], 1 - k / (steps + 1));
  }
}

function drawHalf(m: ShardMemory, level: number, evolved: boolean, near: boolean): void {
  if (m.grow <= 0 || hero.state === "dead") return;
  const s = stats(level, evolved);
  const radius = O.radius * s.area * (0.4 + 0.6 * m.grow);
  place();
  if (evolved)
    ellipseRing(
      hero.x,
      middleY(),
      radius,
      radius * O.tilt,
      PAL.crystal[near ? 3 : 2],
      near ? 0.4 : 0.25,
      near ? 1 : -1,
    );
  for (let i = 0; i < s.amount; i++) {
    const [x, y, front] = shardAt(m, i, s.amount, radius);
    drawTrail(m, i, s.amount, radius, near, evolved);
    if (front !== near) continue;
    const depth = front ? 1 : 0.8;
    drawShard(x, y, m.grow * depth, m.t * 9 + i * 1.7, evolved);
  }
}

/** Orbit Shards: crystal shards circle the hero for a while, then rest. Evolved, they never rest. Design: docs/growth-design.md */
export const shards: RelicBehavior = {
  create: (): ShardMemory => ({ t: 0, on: 0, rest: 0, angle: 0, grow: 0, chime: 0, hits: [] }),
  update(memory, level, evolved, dt) {
    const m = memoryOf(memory);
    const s = stats(level, evolved);
    m.t += dt;
    m.chime -= dt;
    if (!evolved) {
      if (m.on > 0) {
        m.on -= dt;
        if (m.on <= 0) {
          m.rest = s.cooldown;
          scatter(m, s.amount, O.radius * s.area);
        }
      } else {
        m.rest -= dt;
        if (m.rest <= 0) m.on = s.duration;
      }
    }
    const active = evolved || m.on > 0;
    m.grow = active ? approach(m.grow, 1, dt / O.grow) : 0;
    m.angle += ((O.speed * s.speed) / (O.radius * s.area)) * dt;
    pruneHits(m.hits, m.t);
    if (m.grow >= 1) strike(m, level, evolved);
  },
  drawBack: (memory, level, evolved) => drawHalf(memoryOf(memory), level, evolved, false),
  draw: (memory, level, evolved) => drawHalf(memoryOf(memory), level, evolved, true),
};
