import { ENEMY_HITS } from "../../constants/enemies";
import { SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { approach, clamp } from "../../utils/math";
import { waveScale } from "../../utils/progression";
import { hurtHero } from "../hurtHero";
import { game, hero, particles, rng } from "../state";
import { boxHit, heroBox } from "../world";
import { enemyBox } from "./enemy";
import { facesHero, turnToHero } from "./facing";

/** wisps circle at a distance, wind up with flaring eyes when they face Kael, then lunge */
export function updateWisp(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 18;
  const dx = hx - e.x;
  const dy = hy - e.y;
  const d = Math.hypot(dx, dy) || 1;
  if (e.state === "drift") {
    turnToHero(e, dt);
    const tx = hx - e.side * 44;
    const ty = hy - 10 + Math.sin(game.t * 1.7 + e.seed) * 8;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.6, -70, 70), 220 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -60, 60), 220 * dt);
    if (d < 70 && e.cd <= 0 && facesHero(e) && hero.state !== "dead") Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, -Math.sign(dx) * 20, 300 * dt);
    e.vy = approach(e.vy, 0, 300 * dt);
    if (e.st >= 0.45 * waveScale(game.wave).windup) {
      Object.assign(e, { state: "lunge", st: 0, vx: (dx / d) * 240, vy: (dy / d) * 240 });
      sfx.lunge();
    }
  } else if (e.state === "lunge") {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(ENEMY_HITS.wispLunge * e.power, e.x);
    if (e.st >= 0.35) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.7)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1, 2.2) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
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
      {
        sparks: SPARKS.shadow,
      },
    );
}
