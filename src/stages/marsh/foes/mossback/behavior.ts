import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { foeSees } from "../../../../game/enemies/awareness";
import { enemyBox } from "../../../../game/enemies/enemy";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { MUD_SPARKS, WATER_SPARKS } from "../../../../game/enemies/rain/colors";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { boxHit, dust, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach, clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SNAPPER_HITS } from "./colors";
import { SNAP, SNAP_MOVE } from "./constants";
import { createLandingMark } from "./landingMark";
import { biteBox, crouchTime, drawTime } from "./moves";

function splash(x: number, n: number, up: number): void {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    particles.spawn(
      PK.SPARK,
      x + side * fxRng.range(4, 12),
      GROUND - 1,
      side * fxRng.range(30, 110),
      -fxRng.range(up * 0.4, up),
      fxRng.range(0.25, 0.5),
      { sparks: i % 3 ? MUD_SPARKS : WATER_SPARKS },
    );
  }
}

function walk(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const moving = e.halt <= 0 && (!foeSees(e) || gap > SNAP.near);
  e.vx = approach(e.vx, moving ? e.face * SNAP.walk : 0, 90 * dt);
  if (e.cd > 0 || hero.state === "dead" || !facesHero(e)) return;
  if (gap < SNAP.snapRange && Math.abs(hero.y - e.y) < 24) {
    Object.assign(e, { state: "wind", st: 0, n: SNAP_MOVE.bite, vx: 0 });
    sfx.swing(0.7);
    return;
  }
  if (gap > SNAP.slamFrom && gap < SNAP.slamTo && rng.chance(dt * 1.5)) {
    Object.assign(e, { state: "wind", st: 0, n: SNAP_MOVE.slam, vx: 0 });
    splash(e.x, 4, 40);
  }
}

function hop(e: Enemy): void {
  const target = clampStageX(clamp(hero.x, e.x - SNAP.hopMost, e.x + SNAP.hopMost), 14);
  e.face = Math.sign(target - e.x) || e.face;
  Object.assign(e, {
    state: "leap",
    st: 0,
    vx: (target - e.x) / SNAP.flight,
    vy: (-SNAP.gravity * SNAP.flight) / 2,
  });
  game.fx.push(createLandingMark(e, target, SNAP.flight));
  dust(e.x, GROUND, 5, -e.face);
  splash(e.x, 6, 90);
  sfx.lunge();
}

function windUp(e: Enemy, dt: number, ts: number): void {
  e.vx = approach(e.vx, 0, 400 * dt);
  if (e.n === SNAP_MOVE.slam) {
    if (fxRng.chance(0.4 * ts)) splash(e.x, 1, 30);
    if (e.st >= crouchTime()) hop(e);
    return;
  }
  if (e.st < drawTime()) return;
  Object.assign(e, { state: "lunge", st: 0, ay: 0 });
  sfx.swing(1.2);
}

function bite(e: Enemy): void {
  if (e.st < SNAP.out + SNAP.hold) {
    const box = biteBox(e);
    eachStanding(() => {
      if (e.ay || !boxHit(box, heroBox())) return;
      e.ay = 1;
      hurtHero(SNAPPER_HITS.snap * e.power, e.x);
    });
  }
  if (e.st >= SNAP.back) Object.assign(e, { state: "recover", st: 0 });
}

function slamDown(e: Enemy): void {
  Object.assign(e, { y: GROUND, vx: 0, vy: 0, state: "swipe", st: 0 });
  dust(e.x - 10, GROUND, 6, -1);
  dust(e.x + 10, GROUND, 6, 1);
  splash(e.x, 16, 160);
  sfx.boom();
  const struck = new Set<number>();
  eachStanding(() => {
    if (struck.has(heroSlot())) return;
    if (Math.abs(hero.x - e.x) > SNAP.splash || hero.y < GROUND - 12) return;
    struck.add(heroSlot());
    hurtHero(SNAPPER_HITS.slam * e.power, e.x);
  });
}

function fly(e: Enemy, dt: number): void {
  e.vy += SNAP.gravity * dt;
  e.y += e.vy * dt;
  if (e.vy > 0 && e.y >= GROUND) slamDown(e);
}

export function updateMossback(e: Enemy, dt: number, ts: number): void {
  if (e.state === "walk") walk(e, dt);
  else if (e.state === "wind") windUp(e, dt, ts);
  else if (e.state === "lunge") bite(e);
  else if (e.state === "leap") fly(e, dt);
  else if (e.state === "swipe") {
    if (e.st >= SNAP.land) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= SNAP.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2.1) * waveScale(game.wave).cooldown });
  if (e.state !== "walk" && e.state !== "leap") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 14);
  if (e.state !== "leap") e.y = GROUND;
  if (e.state !== "walk" || e.halt > 0) return;
  eachStanding(() => {
    if (boxHit(enemyBox(e), heroBox())) hurtHero(SNAPPER_HITS.touch * e.power, e.x);
  });
}
