import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game, hero, particles, rng } from "../../state";
import { facesHero, turnToHero } from "../facing";
import { RAIN_HITS, STORM_SPARKS } from "./colors";
import { createStormBolt, createStormMark } from "./stormBolt";

/** how high over Kael's feet a kite hangs to strike, and the seconds its strike gathers before scaling */
const STRIKE_HEIGHT = 50;
export const KITE_WINDUP = 0.6;

/**
 * Storm Kites ride the wind to one side of Kael. To strike they glide over him, stop, and gather a violet charge
 * while a ring marks the floor below; the bolt then falls straight down. They sag for a moment after.
 */
export function updateStormkite(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  const dx = hero.x - e.x;
  const top = hero.y - STRIKE_HEIGHT;
  if (e.state === "drift") {
    turnToHero(e, dt);
    // each kite keeps its own distance and height, so a flock spreads out
    const tx = hero.x - e.side * (44 + ((e.seed * 7) % 26));
    const ty = hero.y - 40 - ((e.seed * 5) % 18) + Math.sin(game.t * 1.4 + e.seed) * 8;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -65, 65), 200 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.4, -55, 55), 200 * dt);
    if (e.cd <= 0 && Math.abs(dx) < 120 && facesHero(e) && hero.state !== "dead")
      Object.assign(e, { state: "dive", st: 0 });
  } else if (e.state === "dive") {
    // glide in over Kael
    e.vx = approach(e.vx, clamp(dx * 4, -110, 110), 500 * dt);
    e.vy = approach(e.vy, clamp((top - e.y) * 4, -90, 90), 500 * dt);
    if ((Math.abs(dx) < 4 && Math.abs(top - e.y) < 6) || e.st > 0.9) {
      Object.assign(e, { state: "wind", st: 0, ax: e.x });
      game.fx.push(createStormMark(e, KITE_WINDUP * scale.windup));
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 400 * dt);
    e.vy = approach(e.vy, 0, 400 * dt);
    e.x = approach(e.x, e.ax, 30 * dt);
    if (rng.chance(dt * 30))
      particles.spawn(PK.SPARK, e.x + rng.range(-6, 6), e.y + rng.range(-4, 6), 0, rng.range(20, 60), 0.15, {
        sparks: STORM_SPARKS,
      });
    if (e.st >= KITE_WINDUP * scale.windup) {
      game.fx.push(createStormBolt(e.ax, e.y + 6, RAIN_HITS.kiteStrike * e.power));
      Object.assign(e, { state: "beam", st: 0 });
      sfx.thunder();
    }
  } else if (e.state === "beam") {
    if (e.st >= 0.2) Object.assign(e, { state: "recover", st: 0, vy: 20 });
  } else if (e.st >= 0.8)
    Object.assign(e, {
      state: "drift",
      st: 0,
      cd: rng.range(1.5, 2.6) * scale.cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  if (e.state === "drift" || e.state === "recover") {
    e.vx -= e.vx * 2 * dt;
    e.vy -= e.vy * 2 * dt;
  }
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  if (rng.chance(0.08 * ts))
    particles.spawn(PK.SPARK, e.x + rng.range(-5, 5), e.y + rng.range(6, 14), rng.range(-10, 10), 15, 0.25, {
      sparks: STORM_SPARKS,
    });
}
