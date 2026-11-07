import { RUST } from "../../../constants/hulda/rust";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { addStacks } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";
import { game, lights, particles, progress, rng } from "../../state";
import { skillLevel, skillValues } from "../query";
import { distance2 } from "../targets";

const ID = "h_rustShards";

/** the skill whose Rust is laid now and its spec: Rust Shards when held, else Living Fortress's small spray */
function rust(): { source: string; damage: number; duration: number; max: number; radius: number } {
  if (!skillLevel(ID)) return { source: "h_ironHide", ...RUST.fortress };
  const v = skillValues(ID);
  return { source: ID, damage: v.damage, duration: v.duration, max: v.max, radius: v.radius };
}

/** the Rust a foe carries, from either skill */
export const rustOn = (e: Enemy): number =>
  e.stacks.reduce((n, s) => (s.source === ID || s.source === "h_ironHide" ? n + s.stacks : n), 0);

/** lay `stacks` Rust on one foe */
export function rustFoe(e: Enemy, stacks: number): void {
  const r = rust();
  addStacks(e, r.source, {
    stacks,
    max: r.max,
    damage: progress.stats.ad * r.damage * RUST.every,
    every: RUST.every,
    duration: r.duration,
  });
}

/** rust shards burst from her plates: every foe within reach takes `stacks` Rust */
export function sprayRust(x: number, y: number, stacks: number): void {
  const r = rust();
  for (let i = 0; i < 10; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(50, 40 + r.radius * 3);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 30, rng.range(0.3, 0.6), {
      col: skin.ramp[rng.int(2, 4)],
      size: rng.range(1.5, 2.5),
    });
  }
  lights.add(x, y, r.radius * 0.6, skin.ramp[3], 0.5, 0.15);
  for (const e of game.enemies) if (e.hp > 0 && distance2(e, x, y) <= r.radius * r.radius) rustFoe(e, stacks);
}
