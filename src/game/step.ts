import { PACE, STEP } from "../constants/stage";
import { menuContext } from "../ui/menu/menuState";
import { advanceBeats } from "./beat";
import { game } from "./state";
import { update, updateAmbience } from "./update";

/** let a screen shake run out while everything else stands still */
function settleShake(rate: number): void {
  game.shake = Math.max(0, game.shake - STEP * rate);
}

/** one fixed 120 Hz step, which moves the fight on by PACE of its length: only the scenery moves behind the start menu, a skill pick, an opened chest and hit-stop freeze all but the shake; a hero's beat and the run clock run on through hit-stop */
export function stepGame(): void {
  if (menuContext() === "title") {
    updateAmbience(STEP);
    return;
  }
  if (game.mode === "pick" || game.mode === "chest") {
    settleShake(1);
    return;
  }
  // the run clock counts real play time, hit-stop and slow motion included
  if (game.mode === "play") game.clock += STEP;
  advanceBeats(STEP * PACE);
  if (game.freeze > 0) {
    game.freeze -= STEP;
    settleShake(0.5);
    return;
  }
  update(STEP * PACE);
}
