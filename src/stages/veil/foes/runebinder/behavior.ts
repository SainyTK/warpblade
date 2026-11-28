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
import { approach, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { VEIL } from "../colors";
import { BASH, BINDER, BINDER_HITS, SEAL } from "./constants";
import { createRuneSeal } from "./seal";

function gather(e: Enemy): void {
  const a = fxRng.range(0, TAU);
  const cx = e.x + e.face * 10;
  const cy = e.y - 20;
  particles.spawn(PK.MOTE, cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, -Math.cos(a) * 30, -Math.sin(a) * 30, 0.3, {
    col: VEIL.rune[3],
    size: 0.6,
  });
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  let want = 0;
  if (!foeSees(e)) want = e.face * BINDER.pace;
  else if (gap > BINDER.keep) want = e.face * BINDER.pace;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 100 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (gap < BINDER.bash && Math.abs(hero.y - e.y) < 30) {
    Object.assign(e, { state: "wind", st: 0, n: BASH, vx: 0 });
    sfx.swing(0.5);
  } else if (gap < BINDER.far) {
    const x = clampStageX(hero.x, 12);
    Object.assign(e, { state: "wind", st: 0, n: SEAL, vx: 0, ax: x });
    game.fx.push(createRuneSeal(x, BINDER.seal * waveScale(game.wave).windup, BINDER_HITS.seal * e.power));
    sfx.chime(0);
  }
}

function shove(e: Enemy): void {
  const reach = e.x + e.face * 26;
  const box = [Math.min(e.x, reach), e.y - 28, Math.max(e.x, reach), e.y] as const;
  eachStanding(() => {
    if (e.ax || !boxHit(box, heroBox())) return;
    e.ax = 1;
    hurtHero(BINDER_HITS.bash * e.power, e.x);
  });
}

function release(e: Enemy): void {
  if (e.n === BASH) {
    Object.assign(e, { state: "swipe", st: 0, ax: 0, vx: e.face * 70 });
    sfx.swing(1);
  } else Object.assign(e, { state: "summon", st: 0 });
}

export function updateRunebinder(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.6 * ts)) gather(e);
    if (e.st >= (e.n === BASH ? BINDER.bashWind : BINDER.sealWind) * scale.windup) release(e);
  } else if (e.state === "swipe") {
    shove(e);
    e.vx = approach(e.vx, 0, 400 * dt);
    if (e.st >= BINDER.shove) {
      Object.assign(e, { state: "recover", st: 0 });
      dust(e.x + e.face * 18, GROUND, 3);
    }
  } else if (e.state === "summon") {
    if (e.st >= (BINDER.seal - BINDER.sealWind) * scale.windup) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= BINDER.recover)
    Object.assign(e, { state: "walk", st: 0, n: SEAL, cd: rng.range(1.4, 2.2) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(BINDER_HITS.touch * e.power, e.x);
  });
}
