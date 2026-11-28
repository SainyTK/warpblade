import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { touchHero } from "../contact";
import { HOARBACK, HOARBACK_HITS } from "./constants";

function plod(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const pace = (Math.abs(dx) > 26 || !foeSees(e)) && e.halt <= 0 ? e.face * HOARBACK.plod : 0;
  e.vx = approach(e.vx, pace, 120 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (Math.abs(dx) < HOARBACK.notice && Math.abs(hero.y - e.y) < 40) {
    Object.assign(e, { state: "wind", st: 0 });
    sfx.swing(0.4);
  }
}

function ram(e: Enemy): void {
  e.vx = e.face * HOARBACK.speed;
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(HOARBACK_HITS.ram * e.power, e.x - e.face * 8);
    }
  });
  if (fxRng.chance(0.5)) dust(e.x - e.face * 10, GROUND, 1, -e.face);
  const stalled = e.st > 0.05 && Math.abs(e.x - e.ay) < 0.2;
  if (!stalled && Math.abs(e.x - e.ax) < HOARBACK.reach) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3 });
  dust(e.x + e.face * 12, GROUND, 4);
}

export function updateHoarback(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") plod(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    if (fxRng.chance(10 * dt)) dust(e.x - e.face * 6, GROUND, 1, -e.face);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, e.x + e.face * 14, e.y - 20, fxRng.range(-6, 6), -fxRng.range(6, 16), 0.35, {
        col: FOE.crystal[4],
        size: 0.6,
      });
    if (e.st >= HOARBACK.wind * scale.windup) {
      Object.assign(e, { state: "charge", st: 0, n: 0, ax: e.x });
      sfx.lunge();
    }
  } else if (e.state === "charge") ram(e);
  else if (e.st >= HOARBACK.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2) * scale.cooldown });
  if (e.state === "wind" || e.state === "recover") e.vx -= e.vx * 5 * dt;
  e.ay = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, HOARBACK_HITS.touch);
}
