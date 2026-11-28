import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { HUSHWARDEN, HUSHWARDEN_HITS } from "./moves";
import { callAdds, hushAddsAlive } from "./summon";
import { createSweepTrail } from "./trail";

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const go = (gap > HUSHWARDEN.keep || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, go ? e.face * HUSHWARDEN.pace : 0, 120 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  const due = e.n >= (e.ax > 0 ? HUSHWARDEN.summonEvery : HUSHWARDEN.summonFirst);
  if (due && gap > HUSHWARDEN.keep && hushAddsAlive() < HUSHWARDEN.most) {
    Object.assign(e, { state: "summon", st: 0, n: 0, ax: 1 });
    sfx.chime(0);
  } else if (gap < HUSHWARDEN.range) {
    Object.assign(e, { state: "wind", st: 0 });
    sfx.swingHeavy(0.5);
  }
}

function sweep(e: Enemy): void {
  const reach = HUSHWARDEN.reach;
  const box =
    e.face > 0 ? ([e.x - 6, e.y - 40, e.x + reach, e.y] as const) : ([e.x - reach, e.y - 40, e.x + 6, e.y] as const);
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(HUSHWARDEN_HITS.sweep * e.power, e.x);
  });
  game.fx.push(createSweepTrail(e.x, e.y, e.face));
  sfx.swingHeavy(0.7);
}

function landBook(e: Enemy): void {
  const x = e.x + e.face * (HUSHWARDEN.reach - 8);
  dust(x, GROUND, 5, e.face);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.FLAKE, x, GROUND - 4, fxRng.range(-50, 50), -fxRng.range(30, 90), 0.7, {
      col: FOE.paper[3],
      size: 1.2,
    });
  shake(0.18, 2);
  sfx.boom();
}

export function updateHushwarden(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  e.n += dt;
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-14, 14), e.y - 56 + fxRng.range(-8, 8), 0, 0, 0.3, {
        col: FOE.inkSheen,
        size: 0.6,
      });
    if (e.st >= HUSHWARDEN.sweepWind * windup) {
      Object.assign(e, { state: "swipe", st: 0, vx: e.face * 30 });
      sweep(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= HUSHWARDEN.sweep) {
      Object.assign(e, { state: "recover", st: 0, ay: HUSHWARDEN.sweepRecover });
      landBook(e);
    }
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (e.st >= HUSHWARDEN.summonCast * windup) {
      callAdds(e);
      Object.assign(e, { state: "recover", st: 0, ay: HUSHWARDEN.summonRecover });
    }
  } else if (e.st >= e.ay)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2) * waveScale(game.wave).cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(HUSHWARDEN_HITS.touch * e.power, e.x);
  });
}
