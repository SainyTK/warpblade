import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FLIT_COLORS } from "./colors";
import { FLIT, FLIT_HITS } from "./constants";

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * FLIT.hover + Math.sin(game.t * 1.3 + e.seed) * 10;
  const ty = hero.y - FLIT.height + Math.sin(game.t * 3.1 + e.seed) * 5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.6, -FLIT.drift, FLIT.drift), 200 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -FLIT.drift, FLIT.drift), 220 * dt);
  if (e.cd <= 0 && Math.abs(dx) < FLIT.notice && hero.state !== "dead" && foeSees(e))
    Object.assign(e, { state: "wind", st: 0 });
}

function startDive(e: Enemy): void {
  const ax = hero.x - e.x;
  const ay = hero.y - 14 - e.y;
  const len = Math.hypot(ax, ay) || 1;
  e.face = Math.sign(ax) || e.face;
  Object.assign(e, { state: "dive", st: 0, n: 0, vx: (ax / len) * FLIT.speed, vy: (ay / len) * FLIT.speed });
  sfx.swing(0.3);
}

function dive(e: Enemy, dt: number): void {
  e.vy -= 140 * dt;
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(FLIT_HITS.dive * e.power, e.x - e.face * 4);
    }
  });
  if (e.st >= FLIT.dive || e.y >= GROUND - 8) Object.assign(e, { state: "recover", st: 0, vy: -50 });
}

export function updateSnowflit(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 220 * dt);
    e.vy = approach(e.vy, -18, 220 * dt);
    e.face = Math.sign(hero.x - e.x) || e.face;
    if (e.st >= FLIT.wind * scale.windup) startDive(e);
  } else if (e.state === "dive") dive(e, dt);
  else {
    e.vy = approach(e.vy, -30, 160 * dt);
    if (e.st >= FLIT.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.4, 2.4) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  if (e.state !== "dive") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 14, GROUND - 8);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.FLAKE, e.x + fxRng.range(-3, 3), e.y + 3, fxRng.range(-4, 4), fxRng.range(6, 14), 0.6, {
      col: FLIT_COLORS.down[2],
    });
}
