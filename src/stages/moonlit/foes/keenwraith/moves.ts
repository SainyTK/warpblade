import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MOON_MOTES } from "../graveColors";
import { createKeen, createKeenTell } from "./keen";
import { drawTime, mouthAt, WRAITH, WRAITH_HITS } from "./pose";

const aimAt = (e: Enemy): number => {
  const [mx, my] = mouthAt(e);
  return Math.atan2(hero.y - 16 - my, hero.x - mx);
};

function drift(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const tx = hero.x - e.side * (WRAITH.keepAway + ((e.seed * 7) % 16));
  const ty = hero.y - WRAITH.hover + Math.sin(game.t * 1.2 + e.seed) * 6;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -40, 40), 110 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.1, -36, 36), 110 * dt);
  if (e.cd > 0 || !facesHero(e) || Math.abs(dx) > WRAITH.sense || hero.state === "dead" || !foeSees(e)) return;
  Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
  game.fx.push(createKeenTell(e));
}

function gather(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 120 * dt);
  e.vy = approach(e.vy, 0, 120 * dt);
  if (e.st < drawTime() * WRAITH.lock) e.ax = aimAt(e);
  if (fxRng.chance(dt * 26)) {
    const [mx, my] = mouthAt(e);
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.MOTE, mx + Math.cos(a) * 12, my + Math.sin(a) * 12, -Math.cos(a) * 40, -Math.sin(a) * 40, 0.3, {
      col: fxRng.pick(MOON_MOTES),
      size: 0.6,
    });
  }
  if (e.st < drawTime()) return;
  const [mx, my] = mouthAt(e);
  game.fx.push(createKeen(mx, my, e.ax, WRAITH_HITS.keen * e.power));
  Object.assign(e, { state: "beam", st: 0, vx: -e.face * 24 });
  sfx.thunder();
}

function spent(e: Enemy, dt: number): void {
  const sag = hero.y - WRAITH.sag;
  e.vx = approach(e.vx, 0, 80 * dt);
  e.vy = approach(e.vy, clamp((sag - e.y) * 1.2, -20, 30), 90 * dt);
  if (e.st >= WRAITH.spent)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(2.2, 3) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
}

export function updateKeenwraith(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") drift(e, dt);
  else if (e.state === "wind") gather(e, dt);
  else if (e.state === "beam") {
    e.vx = approach(e.vx, 0, 120 * dt);
    if (e.st >= WRAITH.scream) Object.assign(e, { state: "recover", st: 0 });
  } else spent(e, dt);
  e.vx -= e.vx * 1.2 * dt;
  e.vy -= e.vy * 1.2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, WRAITH.top, GROUND - 14);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.MOTE, e.x + fxRng.range(-5, 5), e.y + 12, fxRng.range(-4, 4), 8, fxRng.range(0.4, 0.7), {
      col: fxRng.pick(MOON_MOTES),
      size: 0.5,
    });
}
