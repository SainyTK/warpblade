import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp, TAU } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game, hero, particles, rng } from "../../state";
import { foeSees } from "../awareness";
import { DAY_COLORS as DC } from "./colors";
import { createPollen } from "./pollen";

/** moth blows before wave scaling */
export const MOTH_HITS = { pollen: 9 } as const;
const SHED = { wind: 0.5, hold: 0.2, dip: 0.8, drift: 42 } as const;

/** two puffs of pollen, thrown a little toward Kael and apart so they fall either side of where he stands */
function shed(e: Enemy): void {
  const toward = clamp((hero.x - e.x) * 0.9, -45, 45);
  for (const side of [-1, 1])
    game.fx.push(createPollen(e.x + side * 3, e.y + 4, toward + side * SHED.drift * 0.5, MOTH_HITS.pollen * e.power));
  for (let i = 0; i < 10; i++) {
    const a = rng.range(0, TAU);
    particles.spawn(PK.MOTE, e.x, e.y, Math.cos(a) * 40, Math.sin(a) * 40, rng.range(0.3, 0.5), {
      col: rng.pick(DC.pollen),
      size: 0.6,
    });
  }
  sfx.chime(1);
}

/** Glimmer Moths flutter high over Kael, beat their wings to a glow, shed two puffs of pollen, then dip low for a moment */
export function updateMoth(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 18;
  const dx = hx - e.x;
  if (e.state === "drift") {
    e.face = Math.sign(dx) || e.face;
    const flutter = Math.sin(game.t * 3.1 + e.seed) * 6 + Math.sin(game.t * 7.3 + e.seed * 2) * 3;
    const tx = hx - e.side * 38 + Math.sin(game.t * 1.3 + e.seed) * 10;
    const ty = hy - 28 + flutter;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.4, -60, 60), 200 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.8, -60, 60), 240 * dt);
    if (e.cd <= 0 && Math.abs(dx) < 80 && hero.state !== "dead" && foeSees(e))
      Object.assign(e, { state: "wind", st: 0 });
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, -6, 200 * dt);
    if (rng.chance(0.6 * ts)) {
      const a = rng.range(0, TAU);
      particles.spawn(
        PK.MOTE,
        e.x + Math.cos(a) * 9,
        e.y + Math.sin(a) * 7,
        -Math.cos(a) * 30,
        -Math.sin(a) * 30,
        0.25,
        {
          col: rng.chance(0.6) ? DC.pollen[2] : DC.pollenPink,
          size: 0.5,
        },
      );
    }
    if (e.st >= SHED.wind * waveScale(game.wave).windup) {
      Object.assign(e, { state: "shoot", st: 0 });
      shed(e);
    }
  } else if (e.state === "shoot") {
    e.vy = approach(e.vy, -20, 300 * dt);
    if (e.st >= SHED.hold) Object.assign(e, { state: "recover", st: 0, vy: 30 });
  } else {
    // worn out, it sinks toward Kael's head height where a swing can reach it
    e.vy = approach(e.vy, clamp((hy - 6 - e.y) * 1.5, -30, 30), 120 * dt);
    if (e.st >= SHED.dip)
      Object.assign(e, {
        state: "drift",
        st: 0,
        cd: rng.range(1.4, 2.4) * waveScale(game.wave).cooldown,
        side: rng.chance(0.5) ? 1 : -1,
      });
  }
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  if (rng.chance(0.12 * ts))
    particles.spawn(PK.MOTE, e.x + rng.range(-5, 5), e.y + 3, rng.range(-4, 4), rng.range(6, 14), rng.range(0.4, 0.8), {
      col: rng.chance(0.7) ? DC.pollen[2] : DC.pollenPink,
      size: 0.5,
    });
}
