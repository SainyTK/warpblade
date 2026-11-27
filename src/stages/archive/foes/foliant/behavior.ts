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
import { FOLIANT, FOLIANT_HITS } from "./moves";
import { createPageWave } from "./wave";

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const go = (gap > FOLIANT.shoveReach - 6 || !foeSees(e)) && e.halt <= 0;
  e.vx = approach(e.vx, go ? e.face * FOLIANT.pace : 0, 120 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead") return;
  if (gap < FOLIANT.shoveReach && rng.chance(0.5)) Object.assign(e, { state: "charge", st: 0 });
  else if (gap < FOLIANT.slamRange) {
    Object.assign(e, { state: "wind", st: 0 });
    sfx.swingHeavy(0.6);
  }
}

function slam(e: Enemy): void {
  const reach = FOLIANT.slamReach;
  eachStanding(() => {
    if (boxHit([e.x - reach, GROUND - 30, e.x + reach, GROUND], heroBox())) hurtHero(FOLIANT_HITS.slam * e.power, e.x);
  });
  for (const dir of [-1, 1]) game.fx.push(createPageWave(e.x + dir * 14, dir, FOLIANT_HITS.wave * e.power));
  dust(e.x - 14, GROUND, 5, -1);
  dust(e.x + 14, GROUND, 5, 1);
  for (let i = 0; i < 16; i++)
    particles.spawn(
      PK.FLAKE,
      e.x + fxRng.range(-10, 10),
      e.y - fxRng.range(14, 30),
      fxRng.range(-70, 70),
      -fxRng.range(40, 120),
      fxRng.range(0.6, 1.1),
      {
        col: FOE.paper[fxRng.int(2, 4)],
        size: fxRng.range(1, 1.8),
      },
    );
  shake(0.25, 2.5);
  sfx.boom();
}

function shove(e: Enemy): void {
  const reach = FOLIANT.shoveReach;
  const box = e.face > 0 ? ([e.x, e.y - 34, e.x + reach, e.y] as const) : ([e.x - reach, e.y - 34, e.x, e.y] as const);
  eachStanding(() => {
    if (boxHit(box, heroBox())) hurtHero(FOLIANT_HITS.shove * e.power, e.x);
  });
  dust(e.x + e.face * 10, GROUND, 3, e.face);
  sfx.swingHeavy(0.8);
}

export function updateFoliant(e: Enemy, dt: number, ts: number): void {
  const windup = waveScale(game.wave).windup;
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-6, 6), e.y - 26 + fxRng.range(-4, 4), 0, -20, 0.4, {
        col: FOE.glyph[3],
        size: 0.6,
      });
    if (e.pinned > 0) e.st = Math.min(e.st, FOLIANT.slamWind * 0.9);
    if (e.st >= FOLIANT.slamWind * windup) {
      Object.assign(e, { state: "swipe", st: 0 });
      slam(e);
    }
  } else if (e.state === "swipe") {
    if (e.st >= FOLIANT.slam) Object.assign(e, { state: "recover", st: 0, ay: FOLIANT.unbound });
  } else if (e.state === "charge") {
    e.vx = approach(e.vx, -e.face * 6, 200 * dt);
    if (e.st >= FOLIANT.shoveWind * windup) {
      Object.assign(e, { state: "lunge", st: 0, vx: e.face * 90 });
      shove(e);
    }
  } else if (e.state === "lunge") {
    if (e.st >= FOLIANT.shove) Object.assign(e, { state: "recover", st: 0, ay: FOLIANT.shoveRecover, ax: 1 });
  } else {
    if (unbound(e) && fxRng.chance(0.3 * ts))
      particles.spawn(
        PK.FLAKE,
        e.x + fxRng.range(-8, 8),
        e.y - fxRng.range(16, 28),
        fxRng.range(-20, 20),
        -fxRng.range(10, 40),
        0.8,
        {
          col: FOE.paper[3],
        },
      );
    if (e.st >= e.ay)
      Object.assign(e, { state: "walk", st: 0, ax: 0, cd: rng.range(1.4, 2.2) * waveScale(game.wave).cooldown });
  }
  if (e.state !== "walk") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox()))
      hurtHero(FOLIANT_HITS.touch * e.power, e.x);
  });
}

export const unbound = (e: Enemy): boolean => e.state === "recover" && e.ax === 0;
