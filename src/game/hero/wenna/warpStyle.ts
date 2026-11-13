import { SHOULDER_Y } from "../../../constants/wenna/lamp";
import { CANDLE_WARP } from "../../../constants/wenna/warp";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { createFlameCone } from "../../effects/wenna/flameCone";
import { meleeHit } from "../../meleeHit";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead } from "../../world";
import { candleArrived, STEP } from "./candleWarp";
import { drawThrownCandle } from "./thrownCandle";

/** her arrival blow: the lantern's flame thrown out ahead as she appears, at the shared power */
function flareStrike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  const { far, half } = CANDLE_WARP.cone;
  const y = hero.y - SHOULDER_Y;
  game.fx.push(createFlameCone({ x: hero.x + hero.face * 6, y, face: hero.face, near: 2, far, half, power: 1 }));
  const box = boxAhead(-6, -40, CANDLE_WARP.reach, 2);
  meleeHit([box], { power, kx: CANDLE_WARP.kx, ky: CANDLE_WARP.ky, big: true, sureCrit });
}

/**
 * Wenna's warp: she throws a lit candle at the foe, trades places with it and arrives in a flare of her lamp, the foe
 * now her Quarry and the candle left burning as a Wick where she stood. With no foe ahead she throws at her farthest
 * Wick ahead and trades places with it. Her damage is ability power, so the warp grows with it.
 */
export const WENNA_WARP: WarpStyle = {
  stat: "ap",
  drawThrown: drawThrownCandle,
  strike: flareStrike,
  arrived: candleArrived,
  tune: () => skillValues(STEP),
};
