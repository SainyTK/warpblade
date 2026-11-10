import { GROUND, W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { approach, clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game, hero, particles, rng } from "../../state";
import { foeSees } from "../awareness";
import { ABYSS_HITS, VOID_SPARKS } from "./colors";
import { BEAM, createEyeBeam } from "./eyeBeam";

/** the share of the wind-up that the sight line still follows Kael; after that it holds still */
const TRACK = 0.55;
/** e.n while winding up: the aim has locked */
const LOCKED = 1;

/** at most this many eyes wind up or burn a beam at once */
const MAX_STARING = 2;
const staring = (): number =>
  game.enemies.filter((o) => o.type === "eye" && (o.state === "wind" || o.state === "beam")).length;

/** Abyss Eyes hover high and off to Kael's side, stare at him along a sight line that follows him, then lock it and burn a beam down it */
export function updateEye(e: Enemy, dt: number, ts: number): void {
  const hx = hero.x;
  const hy = hero.y - 16;
  const dx = hx - e.x;
  const d = Math.hypot(dx, hy - e.y);
  const windup = 0.75 * waveScale(game.wave).windup;
  if (e.state === "drift") {
    // each eye keeps its own distance and height, so a flock spreads out around Kael
    const tx = hx - e.side * (48 + e.seed * 5);
    const ty = hy - 22 - e.seed * 3 + Math.sin(game.t * 1.5 + e.seed) * 7;
    e.face = Math.sign(dx) || e.face;
    e.vx = approach(e.vx, clamp((tx - e.x) * 1.3, -55, 55), 180 * dt);
    e.vy = approach(e.vy, clamp((ty - e.y) * 1.3, -45, 45), 180 * dt);
    if (e.cd <= 0 && d < 150 && hero.state !== "dead" && foeSees(e) && staring() < MAX_STARING) {
      Object.assign(e, { state: "wind", st: 0, n: 0, ay: Math.atan2(hy - e.y, dx) });
      game.fx.push(createEyeBeam(e, ABYSS_HITS.eyeBeam * e.power));
      sfx.chime(0);
    }
  } else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 200 * dt);
    e.vy = approach(e.vy, 0, 200 * dt);
    if (e.st < TRACK * windup) {
      e.face = Math.sign(dx) || e.face;
      e.ay = Math.atan2(hy - e.y, dx);
    } else if (e.n !== LOCKED) {
      e.n = LOCKED;
      sfx.chime(3);
    }
    if (rng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, e.x + rng.range(-9, 9), e.y + rng.range(-9, 9), 0, 0, 0.2, {
        col: VOID_SPARKS[1],
        size: 0.5,
      });
    if (e.st >= windup) {
      Object.assign(e, { state: "beam", st: 0, vx: -Math.cos(e.ay) * 30, vy: -Math.sin(e.ay) * 30 });
      sfx.lunge();
    }
  } else if (e.state === "beam") {
    if (e.st >= BEAM.life) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= 0.6)
    Object.assign(e, {
      state: "drift",
      st: 0,
      n: 0,
      cd: rng.range(1.5, 2.6) * waveScale(game.wave).cooldown,
      side: rng.chance(0.5) ? 1 : -1,
    });
  e.vx -= e.vx * 2 * dt;
  e.vy -= e.vy * 2 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y = clamp(e.y + e.vy * dt, 20, GROUND - 10);
  if (rng.chance(0.12 * ts))
    particles.spawn(PK.EMBER, e.x + rng.range(-4, 4), e.y + 5, 0, rng.range(4, 12), rng.range(0.3, 0.6), {
      sparks: VOID_SPARKS,
    });
}
