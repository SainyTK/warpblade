import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { touchHero } from "../contact";
import { COLOSSUS_COLORS } from "./colors";
import { COLOSSUS, COLOSSUS_HITS } from "./constants";
import { callIcicles, endSlam, raiseCall, raiseSlam, slam } from "./moves";
import { isExposed, recoveryTime } from "./recovery";

function walk(e: Enemy, dt: number, time: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const pace = (gap > 34 || !foeSees(e)) && e.halt <= 0 ? e.face * COLOSSUS.walk : 0;
  e.vx = approach(e.vx, pace, 60 * dt);
  if (pace && Math.floor(time * 2.4) !== Math.floor((time - dt) * 2.4)) dust(e.x + e.face * 8, GROUND, 2);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (gap < COLOSSUS.near) raiseSlam(e);
  else if (gap < COLOSSUS.far) raiseCall(e);
}

function coreMotes(e: Enemy): void {
  particles.spawn(
    PK.MOTE,
    e.x + e.face * 3 + fxRng.range(-4, 4),
    e.y - 30,
    fxRng.range(-10, 10),
    -fxRng.range(10, 24),
    0.4,
    {
      col: COLOSSUS_COLORS.core[2],
      size: 0.7,
    },
  );
}

export function updateFrostcolossus(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") walk(e, dt, game.t + e.seed);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.4 * ts)) coreMotes(e);
    if (e.st >= COLOSSUS.slamWind * scale.windup) slam(e);
  } else if (e.state === "swipe") {
    if (e.st >= COLOSSUS.slamActive) endSlam(e);
  } else if (e.state === "summon") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.3 * ts)) coreMotes(e);
    if (e.st >= COLOSSUS.callWind * scale.windup) callIcicles(e);
  } else {
    if (isExposed(e) && fxRng.chance(0.5 * ts)) coreMotes(e);
    if (e.st >= recoveryTime(e)) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.4, 2.1) * scale.cooldown });
  }
  if (e.state !== "walk") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, COLOSSUS_HITS.touch);
}
