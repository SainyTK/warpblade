import { ENEMY_HITS } from "../../constants/enemies";
import { PAL, SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { approach, clamp } from "../../utils/math";
import { waveScale } from "../../utils/progression";
import { createSlash } from "../effects/slash";
import { hurtHero } from "../hurtHero";
import { game, hero, particles, rng } from "../state";
import { boxHit, heroBox } from "../world";
import { enemyBox } from "./enemy";
import { facesHero, turnToHero } from "./facing";

/** husks walk the ground the way they face, raise a claw at Kael when he is in front, and swipe */
export function updateHusk(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 6 ? e.face * 30 : 0, 200 * dt);
    if (Math.abs(dx) < 26 && facesHero(e) && Math.abs(hero.y - e.y) < 30 && e.cd <= 0 && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= 0.55 * waveScale(game.wave).windup) {
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
      if (boxHit(reach, heroBox())) hurtHero(ENEMY_HITS.huskSwipe * e.power, e.x);
      sfx.swing(0.5);
    }
  } else if (e.state === "swipe") {
    if (e.st >= 0.2) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.7)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.8, 1.6) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = GROUND;
  if (rng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), e.y - rng.range(6, 22), 0, -10, rng.range(0.4, 0.8), {
      sparks: SPARKS.shadow,
    });
  if (e.state === "walk" && boxHit(enemyBox(e), heroBox())) hurtHero(ENEMY_HITS.huskTouch * e.power, e.x);
}
