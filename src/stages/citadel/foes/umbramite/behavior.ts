import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { strikeOnceBy, touchHero } from "../strike";
import { MITE, MITE_HITS } from "./constants";

function crawl(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  e.vx = approach(e.vx, (gap > 8 || !foeSees(e)) && e.halt <= 0 ? e.face * MITE.crawl : 0, 200 * dt);
  if (e.cd <= 0 && facesHero(e) && gap < MITE.notice && Math.abs(hero.y - e.y) < 30 && hero.state !== "dead")
    Object.assign(e, { state: "wind", st: 0 });
}

function leap(e: Enemy): void {
  Object.assign(e, { state: "leap", st: 0, n: 0, vx: e.face * MITE.leapSpeed, vy: -MITE.leapRise });
  dust(e.x, GROUND, 3, -e.face);
  sfx.lunge();
}

function fly(e: Enemy, dt: number): void {
  e.vy += MITE.gravity * dt;
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y += e.vy * dt;
  strikeOnceBy(e, enemyBox(e), MITE_HITS.leap * e.power);
  if (e.y < GROUND || e.vy < 0) return;
  e.y = GROUND;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3, vy: 0 });
  dust(e.x, GROUND, 2);
}

export function updateUmbramite(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") crawl(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= MITE.wind * scale.windup) leap(e);
  } else if (e.state === "leap") {
    fly(e, dt);
    return;
  } else if (e.st >= MITE.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.9, 1.6) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = GROUND;
  if (fxRng.chance(0.05 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-3, 3), e.y - fxRng.range(3, 8), 0, -8, 0.5, { sparks: VOID_SPARKS });
  if (e.state === "walk") touchHero(e, MITE_HITS.touch);
}
