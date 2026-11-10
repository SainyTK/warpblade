import { AWARENESS } from "../../constants/awareness";
import { TURN_DELAY } from "../../constants/combat";
import type { Enemy } from "../../types/enemy";
import { hero } from "../state";
import { foeSees, heroHidden } from "./awareness";

/** a mini boss turns slower toward a hero it can barely see */
const turnDelay = (e: Enemy): number =>
  TURN_DELAY[e.rank] * (e.rank === "mini" && heroHidden() ? AWARENESS.miniTurn : 1);

/**
 * foes turn toward Kael only after he has been behind them for a moment, which opens them to back attacks; a foe that
 * cannot see the hero keeps its facing (game/enemies/awareness.ts)
 */
export function turnToHero(e: Enemy, dt: number): void {
  const want = Math.sign(hero.x - e.x);
  if (!foeSees(e) || !want || want === e.face || Math.abs(hero.x - e.x) < 2) {
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
