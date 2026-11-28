import { GROUND } from "../../../../constants/stage";
import { clampStageX } from "../../../../game/adventure";
import { createSlash } from "../../../../game/effects/slash";
import { VOID, VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { foeSees } from "../../../../game/enemies/awareness";
import { facesHero, turnToHero } from "../../../../game/enemies/facing";
import { fxRng, game, hero, particles, rng } from "../../../../game/state";
import { dust } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { approach } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { createFloorMark } from "../floorMark";
import { boxAheadOf, strikeOnceBy, touchHero } from "../strike";
import { KNIGHT, KNIGHT_HITS, KNIGHT_MOVE } from "./constants";

const windOf = (e: Enemy): number =>
  (e.ay === KNIGHT_MOVE.bash ? KNIGHT.bashWind : KNIGHT.cleaveWind) * waveScale(game.wave).windup;

function choose(e: Enemy, gap: number): void {
  const move = gap < KNIGHT.cleaveReach ? KNIGHT_MOVE.cleave : KNIGHT_MOVE.bash;
  Object.assign(e, { state: "wind", st: 0, ay: move, n: 0 });
  if (move === KNIGHT_MOVE.cleave)
    game.fx.push(createFloorMark(e, "wind", KNIGHT.cleaveFrom, KNIGHT.cleaveTo, windOf(e)));
  else game.fx.push(createFloorMark(e, "wind", 6, Math.min(gap + 10, KNIGHT.bashReach), windOf(e)));
  sfx.swing(0.5);
}

function march(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const want = !foeSees(e) || gap > KNIGHT.keep ? e.face * KNIGHT.pace : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 120 * dt);
  if (e.cd > 0 || !facesHero(e) || gap > KNIGHT.bashReach || Math.abs(hero.y - e.y) > 40 || hero.state === "dead")
    return;
  choose(e, gap);
}

function cleave(e: Enemy): void {
  Object.assign(e, { state: "swipe", st: 0, n: 0 });
  game.fx.push(
    createSlash(e.x, e.y, e.face, { cx: 8, cy: -18, R: 22, sy: 0.9, rot: 0.2, a0: -2.2, a1: 0.9, W: 7, ramp: VOID }),
  );
  dust(e.x + e.face * 26, GROUND, 6);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, e.x + e.face * 26, GROUND - 1, fxRng.range(-80, 80), -fxRng.range(60, 150), 0.35, {
      sparks: VOID_SPARKS,
    });
  sfx.swingHeavy(0.8);
}

function bash(e: Enemy): void {
  Object.assign(e, { state: "charge", st: 0, n: 0, vx: e.face * KNIGHT.bashSpeed });
  dust(e.x, GROUND, 6, -e.face);
  sfx.lunge();
}

function release(e: Enemy): void {
  if (e.ay === KNIGHT_MOVE.bash) bash(e);
  else cleave(e);
}

export function updateEclipseknight(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") march(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, 0, 300 * dt);
    if (fxRng.chance(0.4 * ts))
      particles.spawn(PK.EMBER, e.x - e.face * 4, e.y - 40, fxRng.range(-6, 6), -14, 0.4, { sparks: VOID_SPARKS });
    if (e.st >= windOf(e)) release(e);
  } else if (e.state === "swipe") {
    if (e.st < 0.12)
      strikeOnceBy(
        e,
        boxAheadOf(e, KNIGHT.cleaveFrom, KNIGHT.cleaveTo, GROUND - 40, GROUND),
        KNIGHT_HITS.cleave * e.power,
      );
    if (e.st >= KNIGHT.cleaveTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.state === "charge") {
    strikeOnceBy(e, boxAheadOf(e, -4, 14, GROUND - 34, GROUND), KNIGHT_HITS.bash * e.power);
    if (fxRng.chance(0.6 * ts)) dust(e.x - e.face * 6, GROUND, 1, -e.face);
    if (e.st >= KNIGHT.bashTime) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= KNIGHT.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.2, 1.9) * scale.cooldown });
  if (e.state !== "walk" && e.state !== "charge") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 12);
  e.y = GROUND;
  if (e.state === "walk") touchHero(e, KNIGHT_HITS.touch);
}
