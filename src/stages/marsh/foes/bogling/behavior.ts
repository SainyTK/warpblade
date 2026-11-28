import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { MUD_SPARKS, WATER_SPARKS } from "../../../../game/enemies/rain/colors";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BOGLING, BOGLING_HITS } from "./constants";
import { squashTime } from "./timing";

function splash(x: number, n: number, sparks: Ramp): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-4, 4),
      GROUND - 1,
      fxRng.range(-50, 50),
      -fxRng.range(30, 80),
      fxRng.range(0.2, 0.35),
      { sparks },
    );
}

function waddle(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const step = 0.4 + 0.6 * Math.abs(Math.sin(game.t * 6 + e.seed));
  const moving = e.halt <= 0 && (!foeSees(e) || gap > BOGLING.near);
  e.vx = approach(e.vx, moving ? e.face * BOGLING.waddle * step : 0, 200 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (gap > BOGLING.reach || Math.abs(hero.y - e.y) > BOGLING.rise) return;
  Object.assign(e, { state: "wind", st: 0, vx: 0 });
}

function squash(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.st < squashTime()) return;
  Object.assign(e, { state: "lunge", st: 0, n: 0, vx: e.face * BOGLING.leapSpeed, vy: -BOGLING.leapLift });
  splash(e.x, 4, MUD_SPARKS);
  sfx.swing(1.7);
}

function leap(e: Enemy, dt: number): void {
  e.vy += BOGLING.gravity * dt;
  e.y = Math.min(GROUND, e.y + e.vy * dt);
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(BOGLING_HITS.lunge * e.power, e.x);
  });
  if (e.y < GROUND || e.vy < 0) return;
  Object.assign(e, { state: "recover", st: 0, vy: 0, vx: e.vx * 0.3 });
  dust(e.x, GROUND, 2);
  splash(e.x, 5, WATER_SPARKS);
}

function settle(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 260 * dt);
  if (e.st < BOGLING.recover) return;
  Object.assign(e, { state: "walk", st: 0, cd: rng.range(1, 1.6) * waveScale(game.wave).cooldown });
}

function touch(e: Enemy): void {
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(BOGLING_HITS.touch * e.power, e.x);
  });
}

export function updateBogling(e: Enemy, dt: number): void {
  if (e.state === "walk") waddle(e, dt);
  else if (e.state === "wind") squash(e, dt);
  else if (e.state === "lunge") leap(e, dt);
  else settle(e, dt);
  e.x = clampStageX(e.x + e.vx * dt, 8);
  if (e.state !== "lunge") e.y = GROUND;
  touch(e);
}
