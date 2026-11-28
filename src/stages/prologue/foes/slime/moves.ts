import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, riseSpeed } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SLIME_SPARKS } from "./colors";
import { SLIME, SLIME_HITS } from "./constants";

export const slimeGrounded = (e: Enemy): boolean => e.y >= GROUND;
export const slimeTell = (): number => SLIME.tell * waveScale(game.wave).windup;

function splat(x: number, n: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(PK.SPARK, x + fxRng.range(-4, 4), GROUND - 1, fxRng.range(-40, 40), -fxRng.range(20, 60), 0.3, {
      sparks: SLIME_SPARKS,
    });
}

function fall(e: Enemy, dt: number): boolean {
  if (slimeGrounded(e) && e.vy >= 0) return false;
  e.vy += SLIME.gravity * dt;
  e.y += e.vy * dt;
  if (e.y < GROUND) return false;
  e.y = GROUND;
  e.vy = 0;
  return true;
}

function hop(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const landed = fall(e, dt);
  if (landed) {
    e.vx = 0;
    e.ay = SLIME.hopEvery;
    splat(e.x, 2);
  }
  if (!slimeGrounded(e)) return;
  e.vx = approach(e.vx, 0, 300 * dt);
  e.ay -= dt;
  const dx = hero.x - e.x;
  const ready = e.cd <= 0 && hero.state !== "dead" && foeSees(e) && facesHero(e);
  if (ready && Math.abs(dx) < SLIME.near && Math.abs(hero.y - e.y) < 24) {
    Object.assign(e, { state: "wind", st: 0, vx: 0 });
    return;
  }
  if (e.ay > 0 || e.halt > 0) return;
  const toward = foeSees(e) && Math.abs(dx) > 6 ? e.face : 0;
  e.vy = -riseSpeed(SLIME.hopRise, SLIME.gravity);
  e.y -= 0.01;
  e.vx = toward * SLIME.pace;
}

function quiver(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  if (e.st < slimeTell()) return;
  Object.assign(e, {
    state: "lunge",
    st: 0,
    n: 0,
    vx: e.face * SLIME.lungeSpeed,
    vy: -riseSpeed(SLIME.lungeRise, SLIME.gravity),
    y: GROUND - 0.01,
  });
  splat(e.x, 4);
  sfx.swing(1.4);
}

function lunge(e: Enemy, dt: number): void {
  eachStanding(() => {
    if (e.n !== 0 || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(SLIME_HITS.lunge * e.power, e.x - e.face * 4);
  });
  if (!fall(e, dt)) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3 });
  splat(e.x, 5);
}

function rest(e: Enemy, dt: number): void {
  fall(e, dt);
  e.vx = approach(e.vx, 0, 200 * dt);
  if (e.st < SLIME.recover || !slimeGrounded(e)) return;
  Object.assign(e, {
    state: "walk",
    st: 0,
    ay: SLIME.hopEvery * 0.5,
    cd: rng.range(1, 1.8) * waveScale(game.wave).cooldown,
  });
}

export function updateSlime(e: Enemy, dt: number): void {
  if (e.state === "walk") hop(e, dt);
  else if (e.state === "wind") quiver(e, dt);
  else if (e.state === "lunge") lunge(e, dt);
  else rest(e, dt);
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(SLIME_HITS.touch * e.power, e.x);
  });
}
