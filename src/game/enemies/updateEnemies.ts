import { PAL, SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { approach, clamp } from "../../utils/math";
import { damageEnemy, hurtHero } from "../combat";
import { createSlash } from "../effects/slash";
import { game, hero, particles, rng } from "../state";
import { boxHit, heroBox } from "../world";
import { enemyBox, enemyCenter } from "./enemy";

/** burning, shocked and frozen foes; returns the time scale the foe moves at */
function updateStatus(e: Enemy, dt: number): number {
  e.flash = Math.max(0, e.flash - dt);
  e.frozen = Math.max(0, e.frozen - dt);
  e.shock = Math.max(0, e.shock - dt);
  const [cx, cy] = enemyCenter(e);
  if (e.burn > 0) {
    e.burn -= dt;
    if (rng.chance(0.3))
      particles.spawn(
        PK.FIRE,
        cx + rng.range(-5, 5),
        cy + rng.range(-4, 6),
        rng.range(-8, 8),
        -20,
        rng.range(0.2, 0.4),
        { col: 0, size: rng.range(1, 1.8) },
      );
    e.burnTick -= dt;
    if (e.burnTick <= 0) {
      e.burnTick = 0.4;
      damageEnemy(e, 2, 0, 0);
    }
  }
  if (e.shock > 0 && rng.chance(0.25))
    particles.spawn(
      PK.SPARK,
      cx + rng.range(-6, 6),
      cy + rng.range(-6, 6),
      rng.range(-60, 60),
      rng.range(-60, 20),
      0.1,
      { sparks: SPARKS.volt },
    );
  return e.shock > 0 ? 0 : e.frozen > 0 ? 0.3 : 1;
}

/** wisps circle at a distance, wind up with flaring eyes, then lunge */
function updateWisp(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 18;
  const dx = hx - e.x;
  const dy = hy - e.y;
  const d = Math.hypot(dx, dy) || 1;
  if (Math.abs(dx) > 2) e.face = Math.sign(dx);
  if (e.state === "drift") {
    const tx = hx - e.side * 44;
    const ty = hy - 10 + Math.sin(game.t * 1.7 + e.seed) * 8;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.6, -70, 70), 220 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -60, 60), 220 * dt);
    if (d < 70 && e.cd <= 0 && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -Math.sign(dx) * 20, 300 * dt);
    e.vy = approach(e.vy, 0, 300 * dt);
    if (e.st >= 0.45) {
      Object.assign(e, { state: "lunge", st: 0, vx: (dx / d) * 240, vy: (dy / d) * 240 });
      sfx.lunge();
    }
  } else if (e.state === "lunge") {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(12, e.x);
    if (e.st >= 0.35) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.7)
    Object.assign(e, { state: "drift", st: 0, cd: rng.range(1, 2.2), side: rng.chance(0.5) ? 1 : -1 });
  if (e.state !== "lunge") {
    e.vx -= e.vx * 2 * dt;
    e.vy -= e.vy * 2 * dt;
  }
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  if (rng.chance(0.15 * ts))
    particles.spawn(
      PK.EMBER,
      e.x + rng.range(-3, 3),
      e.y + 5,
      rng.range(-6, 6),
      rng.range(-10, 6),
      rng.range(0.4, 0.8),
      { sparks: SPARKS.shadow },
    );
}

/** husks walk the ground, raise a claw and swipe */
function updateHusk(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    if (Math.abs(dx) > 2) e.face = Math.sign(dx);
    e.vx = approach(e.vx, e.face * 30, 200 * dt);
    if (Math.abs(dx) < 26 && Math.abs(hero.y - e.y) < 30 && e.cd <= 0 && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= 0.55) {
      Object.assign(e, { state: "swipe", st: 0 });
      game.fx.push(
        createSlash(e.x, e.y, e.face, {
          cx: 4,
          cy: -14,
          R: 15,
          sy: 0.7,
          rot: -0.2,
          a0: -2.2,
          a1: 1.0,
          W: 6,
          ramp: PAL.shadow,
        }),
      );
      const reach = e.face > 0 ? ([e.x, e.y - 30, e.x + 28, e.y] as const) : ([e.x - 28, e.y - 30, e.x, e.y] as const);
      if (boxHit(reach, heroBox())) hurtHero(16, e.x);
      sfx.swing(0.5);
    }
  } else if (e.state === "swipe") {
    if (e.st >= 0.2) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.7) Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.8, 1.6) });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  if (rng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), e.y - rng.range(6, 22), 0, -10, rng.range(0.4, 0.8), {
      sparks: SPARKS.shadow,
    });
  if (e.state === "walk" && boxHit(enemyBox(e), heroBox())) hurtHero(8, e.x);
}

export function updateEnemies(dt: number): void {
  for (const e of game.enemies) {
    const ts = updateStatus(e, dt);
    if (e.hp <= 0) continue;
    const sdt = dt * ts;
    e.st += sdt;
    e.cd -= sdt;
    if (e.type === "wisp") updateWisp(e, sdt, ts);
    else updateHusk(e, sdt, ts);
  }
  game.enemies = game.enemies.filter((e) => e.hp > 0);
}

/** small fires left by burning chunks, which keep burning what walks through them */
export function updateBlazes(dt: number): void {
  for (const b of game.blazes) {
    b.life -= dt;
    if (rng.chance(0.5))
      particles.spawn(
        PK.FIRE,
        b.x + rng.range(-3, 3),
        b.y - 1,
        rng.range(-6, 6),
        -rng.range(10, 25),
        rng.range(0.2, 0.4),
        {
          col: 0,
          size: rng.range(1, 2) * (b.life / b.max + 0.4),
        },
      );
    b.tick -= dt;
    if (b.tick > 0) continue;
    b.tick = 0.3;
    for (const e of game.enemies)
      if (boxHit(enemyBox(e), [b.x - 7, b.y - 14, b.x + 7, b.y])) {
        damageEnemy(e, 3, 0, 0);
        e.burn = Math.max(e.burn, 1);
      }
  }
  game.blazes = game.blazes.filter((b) => b.life > 0);
}
