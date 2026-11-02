import { ENEMY_HITS } from "../../constants/enemies";
import { PAL, SPARKS, WORLD_COLORS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { approach, clamp } from "../../utils/math";
import { waveScale } from "../../utils/progression";
import { createFloorRing } from "../effects/floorRing";
import { createSlash } from "../effects/slash";
import { hurtHero } from "../hurtHero";
import { game, hero, particles, rng } from "../state";
import { boxHit, dust, heroBox, shake } from "../world";
import { facesHero, turnToHero } from "./facing";

const SLAM_REACH = 64;
const LEAP_CROUCH = 0.4;

function slam(e: Enemy): void {
  game.fx.push(createFloorRing(e.x, GROUND, SLAM_REACH, PAL.shadow, 0.5));
  dust(e.x - 10, GROUND, 6, -1);
  dust(e.x + 10, GROUND, 6, 1);
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      e.x + rng.range(-20, 20),
      GROUND - 1,
      rng.range(-120, 120),
      rng.range(-200, -80),
      rng.range(0.5, 0.9),
      {
        col: WORLD_COLORS.rubble,
        size: rng.range(1.5, 3),
      },
    );
  shake(0.35, 3.5);
  sfx.boom();
  if (hero.ground && Math.abs(hero.x - e.x) < SLAM_REACH && hero.y > GROUND - 4)
    hurtHero(ENEMY_HITS.bruteSlam * e.power, e.x);
}

/** The Rift Brute: a giant husk. It swipes when Kael is close and leaps to slam the floor when he keeps away. Jump the slam. */
export function updateBrute(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const enraged = e.hp < e.max * 0.5;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, Math.abs(dx) > 10 ? e.face * (enraged ? 34 : 24) : 0, 160 * dt);
    if (e.cd <= 0 && facesHero(e) && hero.state !== "dead") {
      if (Math.abs(dx) < 36) Object.assign(e, { state: "wind", st: 0 });
      else if (Math.abs(dx) < 170) Object.assign(e, { state: "leap", st: 0, vy: 0 });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= (enraged ? 0.45 : 0.6) * waveScale(game.wave).windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      game.fx.push(
        createSlash(e.x, e.y, e.face, {
          cx: 6,
          cy: -22,
          R: 26,
          sy: 0.7,
          rot: -0.2,
          a0: -2.3,
          a1: 1.1,
          W: 9,
          ramp: PAL.shadow,
        }),
      );
      const reach = e.face > 0 ? ([e.x, e.y - 46, e.x + 42, e.y] as const) : ([e.x - 42, e.y - 46, e.x, e.y] as const);
      if (boxHit(reach, heroBox())) hurtHero(ENEMY_HITS.bruteSwipe * e.power, e.x);
      sfx.swing(0.4);
    }
  } else if (e.state === "swipe") {
    if (e.st >= 0.3) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "leap") {
    if (e.st < LEAP_CROUCH) e.vx = approach(e.vx, 0, 400 * dt);
    else if (e.y >= GROUND && e.vy === 0) {
      e.vy = -300;
      e.vx = clamp(dx * 1.4, -170, 170);
      dust(e.x, GROUND, 5);
    } else {
      e.vy += 900 * dt;
      e.y += e.vy * dt;
      if (e.y >= GROUND) {
        Object.assign(e, { y: GROUND, vy: 0, vx: 0, state: "recover", st: -0.3 });
        slam(e);
      }
    }
  } else if (e.st >= 0.8)
    Object.assign(e, {
      state: "walk",
      st: 0,
      cd: rng.range(0.9, 1.7) * (enraged ? 0.6 : 1) * waveScale(game.wave).cooldown,
    });
  if (e.state !== "walk" && e.state !== "leap") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 14, W - 14);
  if (e.state !== "leap") e.y = GROUND;
  if (rng.chance(0.2 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-10, 10), e.y - rng.range(8, 38), 0, -12, rng.range(0.5, 1), {
      sparks: SPARKS.shadow,
    });
}
