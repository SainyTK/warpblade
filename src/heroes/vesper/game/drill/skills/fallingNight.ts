import { createImpact } from "../../../../../game/effects/impact";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { consumeStacks } from "../../../../../game/enemies/skillStatus";
import { game, hero } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import { DUSK_SPARKS } from "../../../look/colors";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { layNight } from "../../skills/fallingNight";
import { skillStrike } from "../strike";

const ID = "ve_night";

function starless(foe: Enemy, power: number): void {
  const n = consumeStacks(foe, ID);
  if (!n) {
    return;
  }
  const [x, y] = enemyCenter(foe);
  game.fx.push(createImpact(x, y, hero.face, true, DUSK_SPARKS));
  skillStrike(foe, power * n, ID);
}

export const FALLING_NIGHT_DRILL: VesperDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, strike, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    if (evolved) {
      starless(foe, values.consume);
    } else if (values.land) {
      layNight(foe, values.land);
    }
  },
};
