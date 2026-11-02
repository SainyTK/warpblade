import { TURN_DELAY } from "../../constants/combat";
import type { Enemy } from "../../types/enemy";
import { hero } from "../state";

/** foes turn toward Kael only after he has been behind them for a moment, which opens them to back attacks */
export function turnToHero(e: Enemy, dt: number): void {
  const want = Math.sign(hero.x - e.x);
  if (!want || want === e.face || Math.abs(hero.x - e.x) < 2) {
    e.turn = 0;
    return;
  }
  e.turn += dt;
  if (e.turn < TURN_DELAY[e.rank]) return;
  e.face = want;
  e.turn = 0;
}
export const facesHero = (e: Enemy): boolean => Math.sign(hero.x - e.x) === e.face;
