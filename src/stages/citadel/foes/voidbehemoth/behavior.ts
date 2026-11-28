import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageLeft, stageRight } from "../../../../game/adventure";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { VOID, VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { createFloorMark } from "../floorMark";
import { createFloorWave } from "../floorWave";
import { boxAheadOf, strikeHero, strikeOnceBy, touchHero } from "../strike";
import { BEHEMOTH, BEHEMOTH_HITS, BEHEMOTH_MOVE, SLAM_WAVE } from "./constants";

const windOf = (e: Enemy): number =>
  (e.ay === BEHEMOTH_MOVE.charge ? BEHEMOTH.chargeWind : BEHEMOTH.slamWind) * waveScale(game.wave).windup;

function choose(e: Enemy, gap: number): void {
  const move = gap < BEHEMOTH.slamReach ? BEHEMOTH_MOVE.slam : BEHEMOTH_MOVE.charge;
  Object.assign(e, { state: "wind", st: 0, ay: move, n: 0 });
  const wind = windOf(e);
  if (move === BEHEMOTH_MOVE.charge) game.fx.push(createFloorMark(e, "wind", 20, 20 + BEHEMOTH.chargeRun, wind));
  else {
    game.fx.push(createFloorMark(e, "wind", 0, BEHEMOTH.slamHalf + 6, wind));
    game.fx.push(createFloorMark(e, "wind", 0, -BEHEMOTH.slamHalf, wind));
  }
  sfx.bossRoar();
}

function lumber(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const want = !foeSees(e) || gap > BEHEMOTH.keep ? e.face * BEHEMOTH.pace : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 90 * dt);
  if (e.cd > 0 || !facesHero(e) || gap > BEHEMOTH.chargeReach || hero.state === "dead") return;
  choose(e, gap);
}

function slam(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0 });
  const x = e.x + e.face * 14;
  strikeHero([x - BEHEMOTH.slamHalf, GROUND - 22, x + BEHEMOTH.slamHalf, GROUND], BEHEMOTH_HITS.slam * e.power, x);
  for (const dir of [-1, 1]) game.fx.push(createFloorWave(x + dir * 12, dir, BEHEMOTH_HITS.wave * e.power, SLAM_WAVE));
  game.fx.push(createFloorRing(x, GROUND, 34, VOID, 0.45));
  dust(x - 14, GROUND, 8, -1);
  dust(x + 14, GROUND, 8, 1);
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-16, 16),
      GROUND - 1,
      fxRng.range(-120, 120),
      -fxRng.range(60, 200),
      0.45,
      {
        sparks: VOID_SPARKS,
      },
    );
  shake(0.3, 3);
  sfx.boom();
}

function charge(e: Enemy, ts: number): void {
  e.vx = e.face * BEHEMOTH.chargeSpeed;
  strikeOnceBy(e, boxAheadOf(e, -10, 30, GROUND - 34, GROUND), BEHEMOTH_HITS.charge * e.power);
  if (fxRng.chance(0.7 * ts)) dust(e.x - e.face * 18, GROUND, 2, -e.face);
  const wall = (e.face < 0 && e.x <= stageLeft() + 30) || (e.face > 0 && e.x >= stageRight() - 30);
  if (!wall && Math.abs(e.x - e.ax) < BEHEMOTH.chargeRun) return;
  Object.assign(e, { state: "recover", st: 0, vx: e.vx * 0.3 });
  dust(e.x + e.face * 24, GROUND, 6, e.face);
  if (wall) {
    shake(0.2, 2.5);
    sfx.boom();
  }
}

export function updateVoidbehemoth(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") lumber(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (e.ay === BEHEMOTH_MOVE.charge && fxRng.chance(6 * dt)) dust(e.x + e.face * 18, GROUND, 2, -e.face);
    if (fxRng.chance(0.5 * ts))
      particles.spawn(PK.EMBER, e.x + fxRng.range(-20, 10), e.y - 30, 0, -16, 0.5, { sparks: VOID_SPARKS });
    if (e.st < windOf(e)) {
      if (e.ay === BEHEMOTH_MOVE.charge) e.face = Math.sign(hero.x - e.x) || e.face;
    } else if (e.ay === BEHEMOTH_MOVE.charge) {
      Object.assign(e, { state: "charge", st: 0, n: 0, ax: e.x });
      sfx.lunge();
    } else slam(e);
  } else if (e.state === "swipe") {
    if (e.st >= BEHEMOTH.slamTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") charge(e, ts);
  else if (e.st >= BEHEMOTH.recover) Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.3, 2) * scale.cooldown });
  if (e.state !== "walk" && e.state !== "charge") e.vx -= e.vx * 5 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 24);
  e.y = GROUND;
  if (e.state === "recover" && fxRng.chance(0.4 * ts))
    particles.spawn(PK.EMBER, e.x - e.face * 4 + fxRng.range(-8, 8), e.y - 32, 0, -20, 0.5, { sparks: VOID_SPARKS });
  if (e.state === "walk") touchHero(e, BEHEMOTH_HITS.touch);
}

export const behemothExposed = (e: Enemy): boolean => e.state === "recover";

export function behemothTakes(e: Enemy, dmg: number): number {
  return dmg * (behemothExposed(e) ? BEHEMOTH.exposed : BEHEMOTH.armour);
}
