import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { grounded } from "./armour";
import { GARGOYLE_SPARKS } from "./colors";
import { GARGOYLE, GARGOYLE_HITS } from "./constants";
import { createLandingMark } from "./marker";
import { createRubble } from "./rubble";

export const foldTime = (): number => GARGOYLE.fold * waveScale(game.wave).windup;
const seat = (): number => GROUND - GARGOYLE.sit;

function hover(e: Enemy, dt: number): void {
  const dx = hero.x - e.x;
  e.face = Math.sign(dx) || e.face;
  const tx = hero.x - e.side * GARGOYLE.hover + Math.sin(game.t * 0.8 + e.seed) * 10;
  const ty = hero.y - GARGOYLE.height + Math.sin(game.t * 5 + e.seed) * 2.5;
  e.vx = approach(e.vx, clamp((tx - e.x) * 1.1, -45, 45), 140 * dt);
  e.vy = approach(e.vy, clamp((ty - e.y) * 1.5, -45, 45), 160 * dt);
  if (e.cd > 0 || Math.abs(dx) > GARGOYLE.sense || hero.state === "dead" || !foeSees(e)) return;
  Object.assign(e, { state: "wind", st: 0, n: 0, ax: clampStageX(hero.x, 14) });
  game.fx.push(createLandingMark(e));
}

function fold(e: Enemy, dt: number): void {
  if (e.st < foldTime() * GARGOYLE.lock) e.ax = clampStageX(hero.x, 14);
  e.vx = approach(e.vx, clamp((e.ax - e.x) * 2, -60, 60), 200 * dt);
  e.vy = approach(e.vy, -GARGOYLE.climb, 200 * dt);
  if (fxRng.chance(dt * 16))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-6, 6), e.y + fxRng.range(-6, 6), 0, -10, 0.4, {
      sparks: GARGOYLE_SPARKS.rift,
    });
  if (e.st < foldTime()) return;
  Object.assign(e, { state: "dive", st: 0, n: 0, vy: 40 });
  sfx.swingHeavy(0.7);
}

function land(e: Enemy): void {
  Object.assign(e, { state: "recover", st: 0, vx: 0, vy: 0, y: seat(), ay: GARGOYLE.grounded });
  const box = [e.x - GARGOYLE.slamHalf, GROUND - 22, e.x + GARGOYLE.slamHalf, GROUND] as const;
  eachStanding(() => {
    if (e.n === 0 && boxHit(box, heroBox())) hurtHero(GARGOYLE_HITS.slam * e.power, e.x);
  });
  for (const dir of [-1, 1]) game.fx.push(createRubble(e.x + dir * 8, dir, GARGOYLE_HITS.rubble * e.power));
  shake(0.16, 1.6);
  sfx.boom();
  dust(e.x, GROUND, 10);
  for (let i = 0; i < 12; i++)
    particles.spawn(PK.SHARD, e.x, GROUND - 3, fxRng.range(-90, 90), -fxRng.range(40, 150), fxRng.range(0.3, 0.6), {
      col: fxRng.pick(GARGOYLE_SPARKS.chip),
      size: fxRng.range(1, 2.2),
    });
}

function dive(e: Enemy, dt: number): void {
  e.vy = Math.min(GARGOYLE.fallMost, e.vy + GARGOYLE.fall * dt);
  e.vx = clamp((e.ax - e.x) * 8, -160, 160);
  eachStanding(() => {
    if (e.n === 0 && boxHit([e.x - 9, e.y - 10, e.x + 9, e.y + 11], heroBox())) {
      e.n = 1;
      hurtHero(GARGOYLE_HITS.slam * e.power, e.x);
    }
  });
  if (e.y + e.vy * dt >= seat()) land(e);
}

function sit(e: Enemy, dt: number): void {
  e.ay = Math.max(0, e.ay - dt);
  if (e.state !== "recover") Object.assign(e, { state: "recover", st: 0 });
  e.vx = 0;
  e.vy = 0;
  e.y = seat();
  if (fxRng.chance(dt * 10))
    particles.spawn(PK.EMBER, e.x + fxRng.range(-7, 7), e.y - fxRng.range(0, 8), 0, -14, 0.5, {
      sparks: GARGOYLE_SPARKS.rift,
    });
  if (e.ay > 0) return;
  Object.assign(e, { state: "hop", st: 0, vy: -90 });
  dust(e.x, GROUND, 6);
  sfx.swingHeavy(0.8);
}

function rise(e: Enemy, dt: number): void {
  e.vy = approach(e.vy, -50, 200 * dt);
  if (e.st < GARGOYLE.takeoff) return;
  Object.assign(e, {
    state: "drift",
    st: 0,
    cd: rng.range(1.8, 2.8) * waveScale(game.wave).cooldown,
    side: rng.chance(0.5) ? 1 : -1,
  });
}

export function updateGargoyle(e: Enemy, dt: number): void {
  if (grounded(e)) sit(e, dt);
  else if (e.state === "drift") hover(e, dt);
  else if (e.state === "wind") fold(e, dt);
  else if (e.state === "dive") dive(e, dt);
  else if (e.state === "hop") rise(e, dt);
  else Object.assign(e, { state: "drift", st: 0 });
  if (e.state === "dive" || grounded(e)) {
    e.x = clampStageX(e.x + e.vx * dt, 10);
    if (!grounded(e)) e.y += e.vy * dt;
    return;
  }
  e.vx -= e.vx * 1.5 * dt;
  e.vy -= e.vy * 1.5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = clamp(e.y + e.vy * dt, 18, seat());
}
