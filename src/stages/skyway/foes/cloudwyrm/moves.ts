import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_SPARKS } from "../colors";
import { createAimLine } from "./aimLine";
import { createBreath, mouthOf } from "./breath";
import { WYRM } from "./colors";
import { BREATH, COIL, WYRM_HITS } from "./constants";

function aimAt(e: Enemy): number {
  const [x, y] = mouthOf(e);
  return Math.atan2(hero.y - 16 - y, hero.x - x);
}

function coil(e: Enemy, dt: number): void {
  const tx = hero.x - e.side * COIL.keep + Math.sin(game.t * 0.6 + e.seed * 3) * 20;
  const ty = hero.y - COIL.height + Math.sin(game.t * 1.8 + e.seed) * 10;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -COIL.speed, COIL.speed), 80 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -COIL.speed, COIL.speed), 80 * dt);
  if (Math.abs(e.vx) > 6) e.face = Math.sign(e.vx);
  if (e.cd > 0 || Math.abs(hero.x - e.x) > COIL.reach || !foeSees(e) || hero.state === "dead") return;
  e.face = Math.sign(hero.x - e.x) || e.face;
  Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
  game.fx.push(createAimLine(e, BREATH.windup * waveScale(game.wave).windup));
  sfx.chime(4);
}

function windUp(e: Enemy, dt: number, windup: number): void {
  e.vx = approach(e.vx, 0, 120 * dt);
  e.vy = approach(e.vy, -8, 120 * dt);
  if (e.st < windup * BREATH.lock) {
    e.face = Math.sign(hero.x - e.x) || e.face;
    e.ax = aimAt(e);
  }
  if (fxRng.chance(dt * 20)) {
    const [x, y] = mouthOf(e);
    particles.spawn(PK.SPARK, x, y, fxRng.range(-20, 20), fxRng.range(-20, 20), 0.15, { sparks: SKY_SPARKS.volt });
  }
  if (e.st < windup) return;
  Object.assign(e, { state: "beam", st: 0 });
  game.fx.push(createBreath(e, e.ax, WYRM_HITS.breath * e.power));
  sfx.thunder();
}

export function updateCloudwyrm(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") coil(e, dt);
  else if (e.state === "wind") windUp(e, dt, BREATH.windup * scale.windup);
  else if (e.state === "beam") {
    e.vx = approach(e.vx, -Math.cos(e.ax) * 20, 200 * dt);
    if (e.st >= BREATH.live) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vx = approach(e.vx, 0, 60 * dt);
    e.vy = approach(e.vy, 16, 50 * dt);
    if (fxRng.chance(0.25 * ts))
      particles.spawn(PK.VAPOUR, e.x + fxRng.range(-10, 10), e.y, fxRng.range(-6, 6), -10, 0.7, { col: WYRM.fin[1] });
    if (e.st >= BREATH.spent)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(2.2, 3.2) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.x = clampStageX(e.x + e.vx * dt, 14);
  e.y = clamp(e.y + e.vy * dt, 24, GROUND - 20);
}
