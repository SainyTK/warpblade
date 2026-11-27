import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { RAIN_FOES, STORM_SPARKS } from "../../../../game/enemies/rain/colors";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { castTime, castWard, plantSpears, raiseTime } from "./cast";
import { SEER_HITS } from "./colors";
import { SEER_CAST, SEER_MOVE, SEER_TIMES } from "./constants";
import { staffTip } from "./staffTip";
import { wardTarget } from "./wardTarget";

function gather(e: Enemy, ts: number): void {
  if (!fxRng.chance(0.5 * ts)) return;
  const [sx, sy] = staffTip(e);
  const a = fxRng.range(0, Math.PI * 2);
  particles.spawn(PK.MOTE, sx + Math.cos(a) * 10, sy + Math.sin(a) * 10, -Math.cos(a) * 34, -Math.sin(a) * 34, 0.3, {
    col: e.n === SEER_CAST.ward ? RAIN_FOES.water : RAIN_FOES.wartHot,
    size: 0.6,
  });
}

function hopBack(e: Enemy): void {
  Object.assign(e, { state: "hop", st: 0, vx: -e.face * SEER_MOVE.hopBack, vy: -SEER_MOVE.hopUp });
  dust(e.x, GROUND, 4, e.face);
  sfx.swing(1.4);
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  e.ay = Math.max(0, e.ay - dt);
  const gap = Math.abs(hero.x - e.x);
  const sees = foeSees(e);
  if (sees && gap < SEER_MOVE.near && e.ay <= 0 && hero.state !== "dead" && e.halt <= 0) {
    hopBack(e);
    return;
  }
  let want = 0;
  if (!sees || gap > SEER_MOVE.far) want = e.face * SEER_MOVE.pace;
  else if (gap < SEER_MOVE.near) want = -e.face * SEER_MOVE.pace;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 120 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (wardTarget(e) && rng.chance(0.55)) {
    Object.assign(e, { state: "summon", st: 0, n: SEER_CAST.ward });
    sfx.chime(1);
    return;
  }
  if (gap < SEER_MOVE.spearRange) {
    Object.assign(e, { state: "wind", st: 0, n: SEER_CAST.spears });
    plantSpears(e);
    sfx.cast();
  }
}

function hop(e: Enemy, dt: number): void {
  e.vy += SEER_MOVE.gravity * dt;
  e.y += e.vy * dt;
  if (e.vy <= 0 || e.y < GROUND) return;
  Object.assign(e, { y: GROUND, vy: 0, vx: e.vx * 0.2, state: "walk", st: 0, ay: SEER_MOVE.hopRest });
  dust(e.x, GROUND, 3);
}

function release(e: Enemy, time: number, dt: number, ts: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  gather(e, ts);
  if (e.st < time) return;
  if (e.n === SEER_CAST.ward) castWard(e);
  Object.assign(e, { state: "shoot", st: 0 });
  for (let i = 0; i < 8; i++) {
    const [sx, sy] = staffTip(e);
    particles.spawn(PK.SPARK, sx, sy, fxRng.range(-60, 60), fxRng.range(-70, 30), 0.3, { sparks: STORM_SPARKS });
  }
}

export function updateReedseer(e: Enemy, dt: number, ts: number): void {
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "hop") hop(e, dt);
  else if (e.state === "summon") release(e, raiseTime(), dt, ts);
  else if (e.state === "wind") release(e, castTime(), dt, ts);
  else if (e.state === "shoot") {
    if (e.st >= SEER_TIMES.release) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= SEER_TIMES.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown });
  if (e.state !== "walk" && e.state !== "hop") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  if (e.state !== "hop") e.y = GROUND;
  if (fxRng.chance(0.06 * ts)) {
    const [sx, sy] = staffTip(e);
    particles.spawn(PK.SPARK, sx + fxRng.range(-2, 2), sy, 0, fxRng.range(10, 30), 0.25, { sparks: STORM_SPARKS });
  }
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(SEER_HITS.touch * e.power, e.x);
  });
}
