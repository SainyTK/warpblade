import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero } from "../../../game/state";

/** a blow of hers threw foes up: each foe now in the air close in front of her is told to the skills */
export function tellLaunched(reach: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || !e.air || Math.abs(e.x - hero.x) > reach) continue;
    emitSkillEvent({ type: "launch", foe: e });
  }
}
