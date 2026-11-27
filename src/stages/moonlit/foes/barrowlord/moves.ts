import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { DIRT_BITS, FIRE_MOTES } from "../graveColors";
import { freshStrike, reachBox, strikeOnce, touchHero } from "../strike";
import { createGraveHands } from "./graveHands";
import { CHARGE, LORD, LORD_HITS, SLAM, windTime } from "./pose";
import { createLordTell } from "./tell";

function march(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const dx = hero.x - e.x;
  const gap = Math.abs(dx);
  const want = foeSees(e) && gap > LORD.near ? e.face * LORD.pace : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 80 * dt);
  if (e.cd > 0 || !facesHero(e) || hero.state === "dead" || Math.abs(hero.y - e.y) > 50) return;
  if (gap < LORD.slamReach) Object.assign(e, { state: "wind", st: 0, n: SLAM, vx: 0 });
  else if (gap > LORD.chargeFrom && gap < LORD.sense)
    Object.assign(e, { state: "wind", st: 0, n: CHARGE, vx: 0, ax: clampStageX(hero.x + e.face * LORD.past, 14) });
  else return;
  game.fx.push(createLordTell(e));
}

function gather(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 200 * dt);
  if (e.n === CHARGE && e.st < windTime(e) * 0.6) e.ax = clampStageX(hero.x + e.face * LORD.past, 14);
  if (e.n === CHARGE && fxRng.chance(dt * 14)) dust(e.x - e.face * 4, GROUND, 1, -e.face);
  if (e.n === SLAM && fxRng.chance(dt * 16))
    particles.spawn(PK.EMBER, e.x - e.face * 12, e.y - 44, fxRng.range(-8, 8), fxRng.range(-4, 10), 0.4, {
      sparks: FIRE_MOTES,
    });
  if (e.st < windTime(e)) return;
  freshStrike(e);
  if (e.n === SLAM) {
    Object.assign(e, { state: "swipe", st: 0 });
    sfx.swing(0.35);
    return;
  }
  Object.assign(e, { state: "charge", st: 0, vx: e.face * LORD.chargeSpeed });
  sfx.lunge();
}

function slam(e: Enemy): void {
  if (e.st < LORD.slam * 0.6) return;
  strikeOnce(e, reachBox(e, 4, 34, -40, 0), LORD_HITS.slam * e.power);
  if (e.st < LORD.slam) return;
  const x = e.x + e.face * 30;
  game.fx.push(createGraveHands(x, e.face, LORD_HITS.hands * e.power));
  dust(x, GROUND, 10);
  for (let i = 0; i < 14; i++)
    particles.spawn(PK.DUST, x, GROUND - 2, fxRng.range(-70, 70), -fxRng.range(40, 120), fxRng.range(0.4, 0.7), {
      col: fxRng.pick(DIRT_BITS),
      size: fxRng.range(1, 2.4),
    });
  shake(0.18, 2);
  sfx.boom();
  Object.assign(e, { state: "recover", st: 0 });
}

function charge(e: Enemy, dt: number): void {
  strikeOnce(e, reachBox(e, -6, 14, -32, 0), LORD_HITS.charge * e.power);
  if (fxRng.chance(dt * 30)) dust(e.x - e.face * 6, GROUND, 1, -e.face);
  const passed = (e.x - e.ax) * e.face >= 0;
  if (!passed && e.st < LORD.chargeMost) return;
  Object.assign(e, { state: "recover", st: 0 });
  dust(e.x, GROUND, 6, e.face);
}

function recover(e: Enemy, dt: number): void {
  e.vx = approach(e.vx, 0, 300 * dt);
  if (e.st >= (e.n === SLAM ? LORD.stuck : LORD.winded))
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.6, 2.4) * waveScale(game.wave).cooldown });
}

export function updateBarrowlord(e: Enemy, dt: number): void {
  if (e.state === "walk") march(e, dt);
  else if (e.state === "wind") gather(e, dt);
  else if (e.state === "swipe") slam(e);
  else if (e.state === "charge") charge(e, dt);
  else recover(e, dt);
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, LORD_HITS.touch * e.power);
}
