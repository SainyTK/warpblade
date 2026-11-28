import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BELL_COLORS } from "./colors";
import { BELL } from "./constants";
import { hymnAllies, singHymn } from "./hymn";
import { createTollRing, createTollWarning } from "./ring";

function steer(e: Enemy, tx: number, ty: number, dt: number): void {
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.2, -BELL.drift, BELL.drift), 140 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.3, -BELL.drift, BELL.drift), 160 * dt);
}

function choose(e: Enemy): void {
  const scale = waveScale(game.wave);
  const hymn = e.ay !== 1 && hymnAllies(e).length > 0;
  e.ay = hymn ? 1 : 0;
  if (hymn) {
    Object.assign(e, { state: "summon", st: 0 });
    return;
  }
  Object.assign(e, { state: "wind", st: 0 });
  game.fx.push(createTollWarning(e, BELL.tollWind * scale.windup));
  sfx.chime(0);
}

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  steer(e, hero.x - e.side * BELL.hover, hero.y - BELL.height + Math.sin(game.t * 1.4 + e.seed) * 5, dt);
  if (e.cd <= 0 && Math.abs(dx) < BELL.notice && hero.state !== "dead" && foeSees(e)) choose(e);
}

function rest(e: Enemy, wait: number): void {
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: wait * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateFrostbell(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "drift") hover(e, dt);
  else if (e.state === "summon") {
    steer(e, e.x, e.y, dt);
    if (e.st >= BELL.hymnWind * scale.windup) {
      singHymn(e);
      Object.assign(e, { state: "beam", st: 0 });
    }
  } else if (e.state === "beam") {
    if (e.st >= BELL.hymnRecover) rest(e, rng.range(0.8, 1.3));
  } else if (e.state === "wind") {
    steer(e, e.x + clamp(hero.x - e.x, -30, 30), e.y, dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.MOTE, e.x + fxRng.range(-10, 10), e.y + 8, 0, -fxRng.range(10, 20), 0.35, {
        col: BELL_COLORS.rune[1],
        size: 0.6,
      });
    if (e.st >= BELL.tollWind * scale.windup) {
      game.fx.push(createTollRing(e));
      shake(0.15, 2);
      sfx.chime(4);
      Object.assign(e, { state: "volley", st: 0, vx: 0, vy: 0 });
    }
  } else if (e.state === "volley") {
    if (e.st >= BELL.tollActive) Object.assign(e, { state: "recover", st: 0 });
  } else {
    e.vy = approach(e.vy, e.st < BELL.tollRecover * 0.6 ? BELL.sink : -BELL.sink * 2, 80 * dt);
    if (e.st >= BELL.tollRecover) rest(e, rng.range(1.3, 2));
  }
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = clamp(e.y + e.vy * dt, 22, GROUND - 26);
}
