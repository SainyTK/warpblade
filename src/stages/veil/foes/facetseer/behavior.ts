import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { sparkBurst } from "../burst";
import { CRYSTAL_SPARKS, VEIL } from "../colors";
import { aimAtHero } from "./aim";
import { createPrismBeam } from "./beam";
import { SEER, SEER_HITS } from "./constants";

function gather(e: Enemy): void {
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, e.x + Math.cos(a) * 12, e.y + Math.sin(a) * 12, -Math.cos(a) * 40, -Math.sin(a) * 40, 0.3, {
    col: fxRng.pick(VEIL.prism),
    size: 0.6,
  });
}

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const crowded = Math.abs(dx) < SEER.crowd && Math.abs(hero.y - 16 - e.y) < 30;
  const tx = hero.x - e.side * SEER.hover + Math.sin(game.t * 0.8 + e.seed) * 10;
  const ty = hero.y - SEER.height + Math.sin(game.t * 2 + e.seed) * 6;
  const pace = crowded ? 90 : 50;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -pace, pace), 200 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -45, 45), 180 * dt);
  if (crowded && e.n === 0) {
    e.side = -e.side;
    e.n = 1;
    sparkBurst(e.x, e.y, 6, CRYSTAL_SPARKS, 50);
    sfx.evade();
  }
  if (!crowded) e.n = 0;
  if (e.cd > 0 || Math.abs(dx) > SEER.notice || hero.state === "dead" || !foeSees(e)) return;
  Object.assign(e, { state: "wind", st: 0, ax: aimAtHero(e) });
  game.fx.push(createPrismBeam(e, SEER_HITS.beam * e.power));
  sfx.chime(2);
}

export function updateFacetseer(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (e.st < SEER.aim - SEER.lock) {
      e.ax = aimAtHero(e);
      e.face = Math.cos(e.ax) >= 0 ? 1 : -1;
    }
    if (fxRng.chance(0.7 * ts)) gather(e);
    if (e.st >= SEER.aim) {
      Object.assign(e, { state: "shoot", st: 0, vx: -Math.cos(e.ax) * 40, vy: -Math.sin(e.ax) * 40 });
      sfx.boom();
    }
  } else if (e.state === "shoot") {
    if (e.st >= SEER.beam) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vy = approach(e.vy, clamp((hero.y - 22 - e.y) * 1.5, -20, 35), 120 * dt);
    if (e.st >= SEER.recover)
      Object.assign(e, {
        state: "drift",
        st: 0,
        n: 0,
        cd: rng.range(1.8, 2.6) * scale.cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 16, GROUND - 16);
}
