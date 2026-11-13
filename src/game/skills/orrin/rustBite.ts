import { IRON_RUST, RUST_BITE } from "../../../constants/orrin/skillEffects";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { RUST_ID, rusted, rustFoe } from "../../hero/orrin/rust";
import { game, particles, progress, rng } from "../../state";
import { shake } from "../../world";
import { skillValues, withCharms } from "../query";

interface RustMemory {
  /** seconds until rust spreads again */
  spread: number;
  /** when each foe last caught rust by a spread, by game time */
  caught: WeakMap<Enemy, number>;
}

const memoryOf = (m: SkillMemory): RustMemory => m as unknown as RustMemory;

/** rusted foes shed orange flakes now and then, so the player sees who carries it */
function flakes(dt: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !rusted(e) || !rng.chance(dt / RUST_BITE.fleck)) continue;
    const [cx, cy] = enemyCenter(e);
    particles.spawn(PK.EMBER, cx + rng.range(-5, 5), cy + rng.range(-5, 3), rng.range(-6, 6), rng.range(10, 24), 0.6, {
      col: IRON_RUST[rng.int(2, 4)],
      size: 1,
    });
  }
}

/** each second, rust creeps from a rusted foe to one foe touching it that has none */
function creep(m: RustMemory): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !rusted(e) || game.t - (m.caught.get(e) ?? -9) < RUST_BITE.spreadGuard) continue;
    const [x, y] = enemyCenter(e);
    const next = game.enemies.find((o) => {
      if (o === e || o.hp <= 0 || rusted(o)) return false;
      const [ox, oy] = enemyCenter(o);
      return Math.abs(ox - x) < RUST_BITE.spreadReach && Math.abs(oy - y) < RUST_BITE.spreadReach + 8;
    });
    if (!next) continue;
    rustFoe(next);
    m.caught.set(next, game.t);
  }
}

/** Corrode: a rusted foe that falls bursts, hurting and rusting every foe near it */
function corrode(foe: Enemy, power: number): void {
  const [x, y] = enemyCenter(foe);
  const reach = withCharms("area", RUST_BITE.corrodeReach);
  for (const e of game.enemies) {
    if (e === foe || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, cy - y) > reach) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: x, kx: Math.sign(cx - x) * 60, source: RUST_ID });
    rustFoe(e);
    game.fx.push(createImpact(cx, cy, Math.sign(cx - x) || 1, false, IRON_RUST));
  }
  game.fx.push(createFloorRing(x, foe.y, reach, IRON_RUST, 0.45, 0.3));
  for (let i = 0; i < 14; i++) {
    const a = rng.range(0, Math.PI * 2);
    const sp = rng.range(40, 110);
    particles.spawn(PK.EMBER, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 30, rng.range(0.3, 0.6), {
      col: IRON_RUST[rng.int(2, 5)],
      size: 1,
    });
  }
  shake(0.08, 1.2);
}

/**
 * Rust Bite: a foe his warp kick or Chain Bind catches rusts (the kit calls `rustFoe`) and takes damage over time;
 * levels make rusted foes take more from everything, let the rust creep to a foe it touches, rust Anchor Pin's foes and
 * slow them. Corrode bursts a rusted foe that falls.
 */
export const rustBite: SkillBehavior = {
  create: () => ({ spread: RUST_BITE.spreadEvery, caught: new WeakMap() }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(RUST_ID);
    flakes(dt);
    if (v.slow) for (const e of game.enemies) if (e.hp > 0 && rusted(e)) e.chill = Math.max(e.chill, RUST_BITE.chill);
    if (!v.spread) return;
    m.spread -= dt;
    if (m.spread > 0) return;
    m.spread += RUST_BITE.spreadEvery;
    creep(m);
  },
  on: {
    kill(_memory, event) {
      const v = skillValues(RUST_ID);
      if (v.corrode && rusted(event.foe)) corrode(event.foe, v.corrode);
    },
  },
};
