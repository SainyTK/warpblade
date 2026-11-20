import { PAL, SPARKS } from "../../../../constants/palette";
import { place, sparkle } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { game, hero, lights, particles, progress, rng } from "../../../../game/state";
import { struckThisSwing } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { SHARDS, SHATTER } from "../../constants/prism";
import { isPrism } from "./job";
import { drawShard, shardSpots } from "./shardLook";
import { shardsBreak } from "./sound";

/** a white flash on a shard's own pixel as it bursts */
const FLASH = 0.08;

/** a shard lodges in a foe as the Prism Knight: at most `SHARDS.most`, all of them falling away `SHARDS.last` seconds
 *  after the newest. The stack never ticks: its damage is the shatter's */
export function lodgeShard(e: Enemy | null): void {
  if (!e || e.hp <= 0 || !isPrism()) return;
  addStacks(e, SHARDS.source, {
    stacks: 1,
    max: SHARDS.most,
    damage: 0,
    every: SHARDS.last * 10,
    duration: SHARDS.last,
  });
}

/** every foe the blow just out struck takes a shard */
export function lodgeInStruck(): void {
  for (const e of game.enemies) if (struckThisSwing(e)) lodgeShard(e);
}

/** a white star on the shard's pixel that is gone in a blink */
function flash(x: number, y: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < FLASH;
    },
    draw() {
      place();
      sparkle(x, y, 3 * (1 - t / FLASH) + 1, WHITE, PAL.prism[4], 0.6);
    },
  };
}

/** one shard bursts: a flash, prism flecks flying out and a light that falls away */
function burst(x: number, y: number): void {
  game.fx.push(flash(x, y));
  const [least, most] = SHATTER.flecks;
  const n = rng.int(least, most);
  for (let i = 0; i < n; i++)
    particles.spawn(PK.SHARD, x, y, rng.range(-90, 90), rng.range(-150, -30), rng.range(0.3, 0.6), {
      col: rng.pick(SPARKS.prism),
      size: rng.range(1, 2),
    });
  lights.add(x, y, 14, PAL.prism[3], 0.8, SHATTER.light);
}

/**
 * A finisher of the ground string lands as the Prism Knight: every foe within `SHATTER.reach` of the impact on the floor
 * ahead loses all its shards, each bursting, and takes the shatter's damage for them in one hit of his attacks
 */
export function shatterShards(): void {
  if (!isPrism()) return;
  const gx = hero.x + hero.face * SHATTER.ahead;
  const gy = hero.y;
  for (const e of [...game.enemies]) {
    const n = e.hp > 0 ? stacksOf(e, SHARDS.source) : 0;
    if (!n) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - gx, cy - gy) > SHATTER.reach) continue;
    for (const [x, y] of shardSpots(e, n)) burst(x, y);
    consumeStacks(e, SHARDS.source);
    dealDamage(e, progress.stats.ad * SHATTER.power * n, { fromX: hero.x, source: "attacks" });
    shardsBreak();
  }
}

/** the shards in every foe, blinking through their last second */
export function drawShards(): void {
  place();
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const entry = e.stacks.find((s) => s.source === SHARDS.source);
    if (!entry) continue;
    const blinking = entry.left < SHARDS.blinkFrom;
    if (blinking && Math.floor(entry.left * SHARDS.blinkRate * 2) % 2 === 1) continue;
    for (const [x, y] of shardSpots(e, entry.stacks)) drawShard(x, y);
  }
}
