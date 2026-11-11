import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { eachStanding } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { boxHit, dust, heroBox, shake } from "../../world";
import { foeSees } from "../awareness";
import { enemyBox } from "../enemy";
import { facesHero, turnToHero } from "../facing";
import { DAY_SPARKS } from "./colors";

/** contact and charge damage before wave scaling */
export const THORN_HITS = { charge: 15, touch: 6 } as const;
const CHARGE = { speed: 165, reach: 140, wind: 0.7, recover: 0.95 } as const;

/** thornbacks trot toward Kael, paw the ground with lowered head, then charge in a line to a wall or a set distance and stand winded */
export function updateThornback(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  if (e.state === "walk") {
    turnToHero(e, dt);
    e.vx = approach(e.vx, (Math.abs(dx) > 8 || !foeSees(e)) && e.halt <= 0 ? e.face * 26 : 0, 200 * dt);
    if (e.cd <= 0 && facesHero(e) && Math.abs(dx) < 130 && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0, n: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    // pawing: a kick of dust behind it every few beats
    if (Math.floor(e.st * 6) !== Math.floor((e.st - dt) * 6)) dust(e.x - e.face * 6, GROUND, 2, -e.face);
    // a pinned thornback keeps pawing: it cannot charge until the pin lets go
    if (e.pinned > 0) e.st = Math.min(e.st, CHARGE.wind * waveScale(game.wave).windup * 0.9);
    if (e.st >= CHARGE.wind * waveScale(game.wave).windup) {
      Object.assign(e, { state: "lunge", st: 0, ax: e.x, n: 0, vx: e.face * CHARGE.speed });
      sfx.lunge();
      dust(e.x, GROUND, 5, -e.face);
    }
  } else if (e.state === "lunge" && e.pinned > 0) {
    // pinned mid-charge: the charge is spent where it stands
    Object.assign(e, { state: "recover", st: 0, vx: 0 });
  } else if (e.state === "lunge") {
    e.vx = e.face * CHARGE.speed;
    if (rng.chance(0.5 * ts)) dust(e.x - e.face * 8, GROUND, 1, -e.face);
    eachStanding(() => {
      if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
        e.n = 1;
        hurtHero(THORN_HITS.charge * e.power, e.x - e.face * 10);
      }
    });
    const wall = (e.face < 0 && e.x <= 12) || (e.face > 0 && e.x >= W - 12);
    if (wall || Math.abs(e.x - e.ax) >= CHARGE.reach) {
      Object.assign(e, { state: "recover", st: 0, vx: wall ? -e.face * 40 : e.vx * 0.5 });
      if (wall) {
        shake(0.15, 1.5);
        sfx.block();
        for (let i = 0; i < 6; i++)
          particles.spawn(
            PK.SHARD,
            e.x + e.face * 8,
            GROUND - rng.range(4, 12),
            -e.face * rng.range(30, 90),
            -rng.range(40, 120),
            rng.range(0.4, 0.7),
            {
              col: DAY_SPARKS.bark[1],
              size: rng.range(1.5, 2.5),
            },
          );
      }
    }
  } else if (e.st >= CHARGE.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.8) * waveScale(game.wave).cooldown });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 4 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = GROUND;
  if (rng.chance(0.06 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-6, 6), e.y - rng.range(6, 14), 0, -10, rng.range(0.4, 0.8), {
      sparks: DAY_SPARKS.rift,
    });
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(THORN_HITS.touch * e.power, e.x);
  });
}
