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
import type { Box } from "../../../../types/world";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { aimAtHero, eyeX, eyeY } from "./aim";
import { BASILISK_SPARKS } from "./colors";
import { BASILISK, BASILISK_HITS, BASILISK_MOVE } from "./constants";
import { createSunGaze } from "./gaze";
import { createLashArc } from "./lash";
import { coilTime, gazeTime, rearTime } from "./timing";

export const prowling = (e: Enemy): boolean => e.state === "walk";

function rest(e: Enemy, seconds: number): void {
  if (e.st < seconds) return;
  Object.assign(e, { state: "walk", st: 0, n: 0, cd: rng.range(1.2, 2) * waveScale(game.wave).cooldown });
}

function strike(e: Enemy, box: Box, damage: number): void {
  eachStanding(() => {
    if (e.ay !== 0 || !boxHit(box, heroBox())) return;
    e.ay = 1;
    hurtHero(damage * e.power, e.x);
  });
}

function choose(e: Enemy): void {
  const dx = hero.x - e.x;
  const close = Math.abs(hero.y - e.y) < 34;
  if (close && !facesHero(e) && Math.abs(dx) < BASILISK.behind) {
    Object.assign(e, { state: "wind", st: 0, n: BASILISK_MOVE.lash, vx: 0 });
    sfx.noise(0.3, 4000, 2000, 0.05, "highpass");
    return;
  }
  if (!facesHero(e)) return;
  if (close && Math.abs(dx) < BASILISK.near) {
    Object.assign(e, { state: "wind", st: 0, n: BASILISK_MOVE.bite, vx: 0 });
    return;
  }
  if (Math.abs(dx) < BASILISK.gazeRange * 0.8) {
    Object.assign(e, { state: "wind", st: 0, n: BASILISK_MOVE.gaze, vx: 0 });
    aimAtHero(e);
    game.fx.push(createSunGaze(e, BASILISK_HITS.gaze * e.power));
    sfx.bossRoar();
  }
}

function prowl(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const moving = !foeSees(e) || gap > BASILISK.stand;
  e.vx = approach(e.vx, moving && e.halt <= 0 ? e.face * BASILISK.pace : 0, 100 * dt);
  if (e.cd <= 0 && hero.state !== "dead" && foeSees(e)) choose(e);
}

function chargeGaze(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.st < gazeTime() * BASILISK.lock) aimAtHero(e);
  if (fxRng.chance(dt * 30))
    particles.spawn(PK.MOTE, eyeX(e) + fxRng.range(-10, 10), eyeY(e) + fxRng.range(-10, 10), 0, 0, 0.3, {
      col: fxRng.pick(BASILISK_SPARKS.sun),
      size: 0.5,
    });
  if (e.st < gazeTime()) return;
  Object.assign(e, { state: "beam", st: 0 });
  sfx.thunder();
  shake(0.12, 1.2);
}

function coil(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.st < coilTime()) return;
  Object.assign(e, { state: "swipe", st: 0, ay: 0 });
  game.fx.push(createLashArc(e.x));
  sfx.swingHeavy(0.7);
  dust(e.x - e.face * 30, GROUND, 6, -e.face);
}

function lash(e: Enemy): void {
  const r = BASILISK.lashReach;
  if (e.st >= BASILISK.lashFrom && e.st <= BASILISK.lashTo)
    strike(e, [e.x - r, GROUND - 18, e.x + r, GROUND], BASILISK_HITS.lash);
  if (e.st >= BASILISK.lash * 0.5 && e.face !== Math.sign(hero.x - e.x)) e.face = Math.sign(hero.x - e.x) || e.face;
  if (e.st >= BASILISK.lash) Object.assign(e, { state: "recover", st: 0, n: BASILISK_MOVE.lash });
}

function rear(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, -e.face * 10, 200 * dt);
  if (e.st < rearTime()) return;
  Object.assign(e, { state: "lunge", st: 0, ay: 0, vx: e.face * BASILISK.biteSpeed });
  sfx.lunge();
}

function bite(e: Enemy, dt: number): void {
  const head = e.x + e.face * 30;
  strike(
    e,
    [Math.min(head, head + e.face * 10), GROUND - 20, Math.max(head, head + e.face * 10), GROUND - 2],
    BASILISK_HITS.bite,
  );
  e.vx = approach(e.vx, 0, 500 * dt);
  if (e.st < BASILISK.bite) return;
  Object.assign(e, { state: "recover", st: 0, n: BASILISK_MOVE.bite, vx: 0 });
  dust(head + e.face * 6, GROUND, 6);
  sfx.boom();
}

const RESTS = [BASILISK.gazeRest, BASILISK.lashRest, BASILISK.biteRest] as const;

export function updateBasilisk(e: Enemy, dt: number): void {
  if (e.state === "walk") prowl(e, dt);
  else if (e.state === "wind" && e.n === BASILISK_MOVE.gaze) chargeGaze(e, dt);
  else if (e.state === "wind" && e.n === BASILISK_MOVE.lash) coil(e, dt);
  else if (e.state === "wind") rear(e, dt);
  else if (e.state === "beam") {
    e.vx = 0;
    if (e.st >= BASILISK.beam) Object.assign(e, { state: "recover", st: 0, n: BASILISK_MOVE.gaze });
  } else if (e.state === "swipe") lash(e);
  else if (e.state === "lunge") bite(e, dt);
  else {
    e.vx = approach(e.vx, 0, 300 * dt);
    rest(e, RESTS[e.n] ?? BASILISK.gazeRest);
  }
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = GROUND;
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(BASILISK_HITS.touch * e.power, e.x);
  });
}
