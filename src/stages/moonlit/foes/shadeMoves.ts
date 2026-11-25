import { GROUND } from "../../../constants/stage";
import { clampStageX } from "../../../game/adventure";
import { facesHero, turnToHero } from "../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { createGhostFlame } from "./ghostFlame";
import { GHOST_SPARKS, SHADE_HITS } from "./shadeColors";
import { createShadeGloom } from "./shadeGloom";
import { flareOf, flareTime, lanternAt, SHADE } from "./shadePose";

const gloomed = new WeakSet<Enemy>();

export function updateLanternshade(e: Enemy, dt: number, ts: number): void {
  if (!gloomed.has(e)) {
    gloomed.add(e);
    game.fx.push(createShadeGloom(e));
  }
  const scale = waveScale(game.wave);
  const dx = hero.x - e.x;
  if (e.state === "drift") {
    turnToHero(e, dt);
    const tx = hero.x - e.side * (SHADE.keepAway + ((e.seed * 9) % 20));
    const ty = hero.y - SHADE.hover - ((e.seed * 5) % 14) + Math.sin(game.t * 1.3 + e.seed) * 6;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -45, 45), 120 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.2, -40, 40), 120 * dt);
    if (e.cd <= 0 && Math.abs(dx) < SHADE.sense && facesHero(e) && hero.state !== "dead")
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 160 * dt);
    e.vy = approach(e.vy, 0, 160 * dt);
    if (fxRng.chance(dt * 20 * flareOf(e))) {
      const [lx, ly] = lanternAt(e, game.t);
      particles.spawn(PK.SPARK, lx, ly, fxRng.range(-40, 40), fxRng.range(-50, 10), 0.2, { sparks: GHOST_SPARKS });
    }
    if (e.st >= flareTime()) {
      const [lx, ly] = lanternAt(e, game.t);
      game.fx.push(createGhostFlame(lx + e.face * 3, ly, SHADE_HITS.flame * e.power));
      Object.assign(e, { state: "shoot", st: 0, vx: -e.face * 30 });
      sfx.swing(0.7);
    }
  } else if (e.state === "shoot") {
    if (e.st >= SHADE.throwTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= SHADE.recover)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(2, 3) * scale.cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  if (e.state !== "wind") {
    e.vx -= e.vx * 1.5 * dt;
    e.vy -= e.vy * 1.5 * dt;
  }
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 14);
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-4, 4), e.y + 14, fxRng.range(-4, 4), 6, fxRng.range(0.4, 0.7), {
      sparks: GHOST_SPARKS,
    });
}
