import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
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

export const HOUND_HITS = { dash: 15, touch: 6 } as const;
const HOUND = { trot: 40, speed: 235, reach: 150, notice: 140, wind: 0.62, recover: 0.85 } as const;

function frostBreath(e: Enemy): void {
  particles.spawn(PK.VAPOUR, e.x + e.face * 18, e.y - 13, e.face * fxRng.range(8, 20), -fxRng.range(2, 8), 0.6, {
    col: FOE.crystal[3],
    size: fxRng.range(1.2, 2),
  });
}

function endDash(e: Enemy, wall: boolean): void {
  Object.assign(e, { state: "recover", st: 0, vx: wall ? -e.face * 40 : e.vx * 0.55 });
  if (!wall) return;
  shake(0.12, 1.5);
  sfx.block();
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * 12,
      GROUND - fxRng.range(4, 14),
      -e.face * fxRng.range(30, 90),
      -fxRng.range(40, 110),
      0.5,
      {
        col: fxRng.pick(FOE.crystal),
        size: fxRng.range(1, 2),
      },
    );
}

function dash(e: Enemy, ts: number): void {
  e.vx = e.face * HOUND.speed;
  if (fxRng.chance(0.6 * ts))
    particles.spawn(
      PK.FLAKE,
      e.x - e.face * 10,
      GROUND - fxRng.range(1, 6),
      -e.face * fxRng.range(10, 40),
      -fxRng.range(4, 20),
      0.5,
      {
        col: FOE.crystal[3],
      },
    );
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(HOUND_HITS.dash * e.power, e.x - e.face * 10);
    }
  });
  const stalled = e.st > 0.05 && Math.abs(e.x - e.ay) < 0.2;
  const wall = stalled || (e.face < 0 && e.x <= stageLeft() + 12) || (e.face > 0 && e.x >= stageRight() - 12);
  if (wall || Math.abs(e.x - e.ax) >= HOUND.reach) endDash(e, wall);
}

export function updateRimehound(e: Enemy, dt: number, ts: number): void {
  const dx = hero.x - e.x;
  const scale = waveScale(game.wave);
  if (e.state === "walk") {
    turnToHero(e, dt);
    const trot = (Math.abs(dx) > 30 || !foeSees(e)) && e.halt <= 0 ? e.face * HOUND.trot : 0;
    e.vx = approach(e.vx, trot, 220 * dt);
    if (
      e.cd <= 0 &&
      facesHero(e) &&
      Math.abs(dx) < HOUND.notice &&
      Math.abs(hero.y - e.y) < 50 &&
      hero.state !== "dead"
    )
      Object.assign(e, { state: "wind", st: 0, n: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 500 * dt);
    if (fxRng.chance(8 * dt)) frostBreath(e);
    if (e.pinned > 0) e.st = Math.min(e.st, HOUND.wind * scale.windup * 0.9);
    if (e.st >= HOUND.wind * scale.windup) {
      Object.assign(e, { state: "lunge", st: 0, ax: e.x, n: 0, vx: e.face * HOUND.speed });
      sfx.lunge();
      dust(e.x, GROUND, 5, -e.face);
    }
  } else if (e.state === "lunge" && e.pinned > 0) Object.assign(e, { state: "recover", st: 0, vx: 0 });
  else if (e.state === "lunge") dash(e, ts);
  else {
    if (fxRng.chance(5 * dt)) frostBreath(e);
    if (fxRng.chance(12 * dt) && Math.abs(e.vx) > 20) dust(e.x + e.face * 8, GROUND, 1, e.face);
    if (e.st >= HOUND.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.9) * scale.cooldown });
  }
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 3 * dt;
  e.ay = e.x;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  eachStanding(() => {
    if (e.state === "walk" && e.halt <= 0 && boxHit(enemyBox(e), heroBox())) hurtHero(HOUND_HITS.touch * e.power, e.x);
  });
}
