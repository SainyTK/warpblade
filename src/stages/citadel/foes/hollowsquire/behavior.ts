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
import { SQUIRE, SQUIRE_HITS } from "./constants";

function march(e: Enemy, dt: number): void {
  turnToHero(e, dt);
  const gap = Math.abs(hero.x - e.x);
  const want = !foeSees(e) || gap > SQUIRE.keep ? e.face * SQUIRE.pace : 0;
  e.vx = approach(e.vx, e.halt > 0 ? 0 : want, 160 * dt);
  if (e.cd > 0 || !facesHero(e) || gap > SQUIRE.reach || Math.abs(hero.y - e.y) > 30 || hero.state === "dead") return;
  const windup = SQUIRE.wind * waveScale(game.wave).windup;
  Object.assign(e, { state: "wind", st: 0 });
  game.fx.push(createFloorMark(e, "wind", SQUIRE.spearFrom, SQUIRE.spearTo, windup));
  sfx.swing(0.7);
}

function thrust(e: Enemy): void {
  Object.assign(e, { state: "lunge", st: 0, n: 0, vx: e.face * SQUIRE.thrustSpeed });
  game.fx.push(
    createSlash(e.x, e.y, e.face, { cx: 14, cy: -16, R: 18, sy: 0.18, rot: 0, a0: -0.5, a1: 0.5, W: 3, ramp: VOID }),
  );
  dust(e.x, GROUND, 3, -e.face);
  sfx.lunge();
}

export function updateHollowsquire(e: Enemy, dt: number, ts: number): void {
  const scale = waveScale(game.wave);
  if (e.state === "walk") march(e, dt);
  else if (e.state === "wind") {
    e.vx = approach(e.vx, -e.face * 8, 300 * dt);
    if (e.st >= SQUIRE.wind * scale.windup) thrust(e);
  } else if (e.state === "lunge") {
    strikeOnceBy(
      e,
      boxAheadOf(e, SQUIRE.spearFrom, SQUIRE.spearTo, GROUND - 24, GROUND - 6),
      SQUIRE_HITS.thrust * e.power,
    );
    if (e.st >= SQUIRE.thrust) Object.assign(e, { state: "recover", st: 0 });
  } else if (e.st >= SQUIRE.recover)
    Object.assign(e, { state: "walk", st: 0, cd: rng.range(1.1, 1.8) * scale.cooldown });
  if (e.state !== "walk" && e.state !== "lunge") e.vx -= e.vx * 6 * dt;
  e.x = clampStageX(e.x + e.vx * dt, 10);
  e.y = GROUND;
  if (fxRng.chance(0.06 * ts))
    particles.spawn(PK.EMBER, e.x + e.face * 2, e.y - 25, 0, -8, 0.5, { sparks: VOID_SPARKS });
  if (e.state === "walk") touchHero(e, SQUIRE_HITS.touch);
}
