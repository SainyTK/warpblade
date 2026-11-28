import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { game, hero, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { WING, WING_HITS } from "./constants";

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * WING.hover + Math.sin(game.t * 1.3 + e.seed) * 8;
  const ty = hero.y - WING.height + Math.sin(game.t * 3.1 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.5, -60, 60), 200 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.6, -55, 55), 200 * dt);
  const near = Math.abs(dx) < WING.reach && hero.y - e.y > 10;
  if (e.cd <= 0 && near && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0, ax: hero.x, ay: hero.y - 14 });
}

function dive(e: Enemy, dt: number): void {
  eachStanding(() => {
    if (e.n || !boxHit(enemyBox(e), heroBox())) return;
    e.n = 1;
    hurtHero(WING_HITS.dive * e.power, e.x);
  });
  e.vy -= 260 * dt;
  if (e.st >= WING.diveTime || e.y >= GROUND - 8) Object.assign(e, { state: "recover", st: 0 });
}

export function updateGlimmerwing(e: Enemy, dt: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 240 * dt);
    e.vy = approach(e.vy, -18, 240 * dt);
    e.ax = hero.x;
    e.face = Math.sign(e.ax - e.x) || e.face;
    if (e.st >= WING.wind * scale.windup) {
      const a = Math.atan2(e.ay - e.y + 10, e.ax - e.x);
      Object.assign(e, { state: "dive", st: 0, n: 0, vx: Math.cos(a) * WING.dive, vy: Math.sin(a) * WING.dive });
      sfx.lunge();
    }
  } else if (e.state === "dive") dive(e, dt);
  else {
    e.vx = approach(e.vx, e.face * 30, 160 * dt);
    e.vy = approach(e.vy, -45, 200 * dt);
    if (e.st >= WING.climb)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.1, 1.9) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  if (e.state === "drift") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 8);
  e.y = clamp(e.y + e.vy * dt, 14, GROUND - 8);
}
