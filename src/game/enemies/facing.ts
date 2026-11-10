import { AWARENESS } from "../../constants/awareness";
import { TURN_DELAY } from "../../constants/combat";
import { W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { game, hero } from "../state";
import { foeSees, heroHidden } from "./awareness";
import { kindOf } from "./kinds";

/** walkers this near, face to face, turn round so neither marches on the spot against the other; a walker this near the
 *  stage's edge turns back from it */
const MEET = 12;
const EDGE = 14;

/**
 * A foe that cannot see the hero keeps its facing and walks on; when it meets another walker of the floor coming the
 * other way, or reaches the edge of the stage, it turns back, as a foe searching for someone it lost would.
 */
function wander(e: Enemy): void {
  e.turn = 0;
  if (kindOf(e.type).flies) return;
  const blocked = game.enemies.some(
    (o) =>
      o !== e &&
      o.hp > 0 &&
      o.face === -e.face &&
      !kindOf(o.type).flies &&
      (o.x - e.x) * e.face > 0 &&
      Math.abs(o.x - e.x) < MEET &&
      Math.abs(o.y - e.y) < 8,
  );
  const atWall = (e.face < 0 && e.x <= EDGE) || (e.face > 0 && e.x >= W - EDGE);
  if (blocked || atWall) e.face = -e.face;
}

/** a mini boss turns slower toward a hero it can barely see */
const turnDelay = (e: Enemy): number =>
  TURN_DELAY[e.rank] * (e.rank === "mini" && heroHidden() ? AWARENESS.miniTurn : 1);

/**
 * foes turn toward Kael only after he has been behind them for a moment, which opens them to back attacks; a foe that
 * cannot see the hero keeps its facing (game/enemies/awareness.ts)
 */
export function turnToHero(e: Enemy, dt: number): void {
  const want = Math.sign(hero.x - e.x);
  if (!foeSees(e)) return wander(e);
  if (!want || want === e.face || Math.abs(hero.x - e.x) < 2) {
    e.turn = 0;
    return;
  }
  e.turn += dt;
  if (e.turn < turnDelay(e)) return;
  e.face = want;
  e.turn = 0;
}

/** the foe faces the hero and can see them, so it may start a wind-up at them */
export const facesHero = (e: Enemy): boolean => foeSees(e) && Math.sign(hero.x - e.x) === e.face;
