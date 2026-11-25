import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { CRYO, CRYO_HITS } from "./constants";
import { createIceSpike } from "./spike";
import { ageWard, raiseWard, wardLeft } from "./ward";

const staffTip = (e: Enemy): [number, number] => [e.x + e.face * 9, e.y - 40];

function gather(e: Enemy): void {
  const [sx, sy] = staffTip(e);
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, sx + Math.cos(a) * 9, sy + Math.sin(a) * 9, -Math.cos(a) * 30, -Math.sin(a) * 30, 0.3, {
    col: FOE.crystal[3],
    size: 0.5,
  });
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const sees = foeSees(e);
  let want = 0;
  if (!sees) want = e.face * CRYO.pace;
  else if (gap < CRYO.near) want = -e.face * CRYO.pace;
  else if (gap > CRYO.far) want = e.face * CRYO.pace;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 120 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (wardLeft(e) <= 0 && gap < CRYO.far) Object.assign(e, { state: "summon", st: 0 });
  else if (gap < CRYO.reach) {
    const x = clampStageX(hero.x, 8);
    const y = surfaceBelow(x, hero.y - 2);
    Object.assign(e, { state: "wind", st: 0, ax: x });
    game.fx.push(createIceSpike(x, y, CRYO.cast * waveScale(game.wave).windup, CRYO_HITS.spike * e.power));
  }
}

export function updateCryomancer(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  ageWard(e, dt);
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.4 * ts)) gather(e);
    if (e.st >= CRYO.raise) {
      raiseWard(e, CRYO.ward);
      sfx.chime(0);
      Object.assign(e, { state: "walk", st: 0, cd: rng.range(0.5, 0.9) * scale.cooldown });
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.6 * ts)) gather(e);
    if (e.st >= CRYO.cast * scale.windup) Object.assign(e, { state: "shoot", st: 0 });
  } else if (e.state === "shoot") {
    if (e.st >= CRYO.slam) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= CRYO.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.4, 2.2) * scale.cooldown });
  if (e.state !== "walk") e.vx -= e.vx * 4 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.08 * ts))
    particles.spawn(
      PK.FLAKE,
      e.x + fxRng.range(-8, 8),
      e.y - fxRng.range(2, 10),
      fxRng.range(-6, 6),
      -fxRng.range(4, 10),
      0.8,
      {
        col: FOE.fur[2],
      },
    );
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(CRYO_HITS.touch * e.power, e.x);
  });
}
