import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { DAY_SPARKS, DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { createAimLine } from "./aim";
import { WASP, WASP_HITS } from "./constants";

export const windTime = (): number => WASP.wind * waveScale(game.wave).windup;
export const aimLocked = (e: Enemy): boolean => e.st >= windTime() * WASP.lockAt;

const aimAt = (e: Enemy): number => Math.atan2(hero.y - 16 - e.y, hero.x - e.x);

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * WASP.hover + Math.sin(game.t * 1.7 + e.seed) * 10;
  const ty = hero.y - WASP.height + Math.sin(game.t * 5.3 + e.seed) * 4;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.5, -70, 70), 220 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -60, 60), 240 * dt);
  if (e.cd <= 0 && Math.abs(dx) < WASP.sense && hero.state !== "dead" && foeSees(e)) {
    Object.assign(e, { state: "wind", st: 0, ax: aimAt(e) });
    game.fx.push(createAimLine(e));
    sfx.chime(3);
  }
}

function aim(e: Enemy, dt: number, ts: number): void {
  e.vx = approach(e.vx, 0, 260 * dt);
  e.vy = approach(e.vy, 0, 260 * dt);
  if (!aimLocked(e)) {
    e.ax = aimAt(e);
    e.face = Math.sign(Math.cos(e.ax)) || e.face;
  }
  if (fxRng.chance(0.5 * ts))
    particles.spawn(PK.MOTE, e.x - e.face * 2, e.y + 5, fxRng.range(-10, 10), fxRng.range(-10, 10), 0.25, {
      col: DC.crackHot,
      size: 0.5,
    });
  if (e.st < windTime()) return;
  Object.assign(e, { state: "lunge", st: 0, n: 0, vx: Math.cos(e.ax) * WASP.speed, vy: Math.sin(e.ax) * WASP.speed });
  sfx.lunge();
}

function dart(e: Enemy): void {
  eachStanding(() => {
    const bit = 1 << heroSlot();
    if (e.n & bit || !boxHit(enemyBox(e), heroBox())) return;
    e.n |= bit;
    hurtHero(WASP_HITS.sting * e.power, e.x - Math.cos(e.ax) * 6);
  });
  const grounded = e.y >= GROUND - 9 && e.vy > 0;
  if (e.st < WASP.dart && !grounded) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3, vy: grounded ? -20 : e.vy * 0.2 });
}

function tire(e: Enemy, dt: number): void {
  const sagging = e.st < WASP.sag;
  const ty = sagging ? hero.y - WASP.low : hero.y - WASP.height;
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -35, 30), 120 * dt);
  e.vx = approach(e.vx, 0, 120 * dt);
  if (e.st < WASP.recover) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.5, 2.4) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateAmberwasp(e: Enemy, dt: number, ts: number): void {
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") aim(e, dt, ts);
  else if (e.state === "lunge") dart(e);
  else tire(e, dt);
  if (e.state !== "lunge") {
    e.vx -= e.vx * 2 * dt;
    e.vy -= e.vy * 2 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 16, GROUND - 9);
  if (fxRng.chance(0.08 * ts))
    particles.spawn(PK.EMBER, e.x - e.face * 8, e.y + 3, 0, -8, fxRng.range(0.3, 0.6), {
      sparks: DAY_SPARKS.pollen,
    });
}
