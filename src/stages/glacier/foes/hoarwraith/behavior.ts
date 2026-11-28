import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { WRAITH_COLORS } from "./colors";
import { WRAITH } from "./constants";
import { aimDive, diveStep, startDive } from "./dive";
import { gatherWail, wail } from "./wail";

const WAILS = 1;

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * WRAITH.hover + Math.sin(game.t * 0.8 + e.seed) * 14;
  const ty = hero.y - WRAITH.height + Math.sin(game.t * 1.9 + e.seed) * 6;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -WRAITH.drift, WRAITH.drift), 160 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -WRAITH.drift, WRAITH.drift), 180 * dt);
  if (e.cd > 0 || Math.abs(dx) > WRAITH.notice || hero.state === "dead" || !foeSees(e)) return;
  const next = e.ay === WAILS ? "volley" : "wind";
  e.ay = e.ay === WAILS ? 0 : WAILS;
  Object.assign(e, { state: next, st: 0 });
  aimDive(e);
}

function rest(e: Enemy, scale: ReturnType<typeof waveScale>): void {
  Object.assign(e, { state: "drift", st: 0, cd: rng.range(1.2, 1.9) * scale.cooldown, side: rng.chance(0.5) ? 1 : -1 });
}

export function updateHoarwraith(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, -14, 200 * dt);
    if (e.st < WRAITH.wind * WRAITH.aimLock * scale.windup) aimDive(e);
    e.face = Math.sign(e.ax - e.x) || e.face;
    if (e.st >= WRAITH.wind * scale.windup) startDive(e);
  } else if (e.state === "dive") diveStep(e);
  else if (e.state === "volley") {
    e.vx = approach(e.vx, 0, 220 * dt);
    e.vy = approach(e.vy, 0, 220 * dt);
    e.face = Math.sign(hero.x - e.x) || e.face;
    if (fxRng.chance(0.6 * ts)) gatherWail(e);
    if (e.st >= WRAITH.wail * scale.windup) {
      wail(e);
      Object.assign(e, { state: "shoot", st: 0 });
    }
  } else if (e.state === "shoot") {
    e.vx = approach(e.vx, -e.face * 24, 200 * dt);
    if (e.st >= WRAITH.wailHold + WRAITH.wailRecover) rest(e, scale);
  } else {
    e.vy = approach(e.vy, e.st > WRAITH.recover * 0.6 ? -40 : 0, 120 * dt);
    if (e.st >= WRAITH.recover) rest(e, scale);
  }
  if (e.state !== "dive") {
    e.vx -= e.vx * 1.6 * dt;
    e.vy -= e.vy * 1.6 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 18, GROUND - 14);
  if (fxRng.chance(0.25 * ts))
    particles.spawn(PK.VAPOUR, e.x + fxRng.range(-6, 6), e.y + 12, fxRng.range(-6, 6), fxRng.range(4, 12), 0.7, {
      col: WRAITH_COLORS.shroud[3],
      size: fxRng.range(1, 1.8),
    });
}
