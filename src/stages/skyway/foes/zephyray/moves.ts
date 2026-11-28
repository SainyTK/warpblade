import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { createAimMark, volleyAngles } from "./aimMark";
import { createWindBlade } from "./blade";
import { RAY } from "./colors";
import { RAY_GLIDE, RAY_HITS, RAY_VOLLEY } from "./constants";

const aimAt = (e: Enemy): number => Math.atan2(hero.y - 16 - e.y, Math.abs(hero.x - e.x) || 1);

function glide(e: Enemy, dt: number): void {
  const sway = Math.sin(game.t * 0.7 + e.seed * 4);
  const tx = hero.x - e.side * RAY_GLIDE.keep + sway * 18;
  const ty = hero.y - RAY_GLIDE.height + Math.sin(game.t * 1.4 + e.seed) * 8;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -RAY_GLIDE.speed, RAY_GLIDE.speed), 90 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -RAY_GLIDE.speed, RAY_GLIDE.speed), 90 * dt);
  e.face = Math.sign(hero.x - e.x) || e.face;
  if (e.cd > 0 || Math.abs(hero.x - e.x) > RAY_VOLLEY.reach || !foeSees(e) || hero.state === "dead") return;
  Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
  game.fx.push(createAimMark(e, RAY_VOLLEY.windup * waveScale(game.wave).windup));
  sfx.swing(0.5);
}

function gather(e: Enemy): void {
  const a = fxRng.range(0, TAU);
  particles.spawn(
    PK.STREAK,
    e.x + Math.cos(a) * 16,
    e.y + Math.sin(a) * 10,
    -Math.cos(a) * 60,
    -Math.sin(a) * 40,
    0.25,
    {
      col: RAY.blade[2],
      size: 1,
    },
  );
}

function fire(e: Enemy): void {
  for (const a of volleyAngles(e))
    game.fx.push(createWindBlade(e.x + Math.cos(a) * 8, e.y + Math.sin(a) * 8, a, RAY_HITS.blade * e.power));
  sfx.swingHeavy(1.3);
}

export function updateZephyray(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") glide(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 160 * dt);
    e.vy = approach(e.vy, 0, 160 * dt);
    if (e.st < RAY_VOLLEY.windup * scale.windup * 0.7) {
      e.face = Math.sign(hero.x - e.x) || e.face;
      e.ax = aimAt(e);
    }
    if (fxRng.chance(0.5 * ts)) gather(e);
    if (e.st >= RAY_VOLLEY.windup * scale.windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      fire(e);
    }
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, -e.face * 40, 300 * dt);
    if (e.st >= RAY_VOLLEY.hold) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vx = approach(e.vx, 0, 80 * dt);
    e.vy = approach(e.vy, 22, 60 * dt);
    if (e.st >= RAY_VOLLEY.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(2.2, 3.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 18);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.MOTE, e.x - e.face * 14, e.y + fxRng.range(-2, 3), -e.face * 10, 4, 0.6, {
      col: RAY.edge[1],
      size: 0.5,
    });
}
