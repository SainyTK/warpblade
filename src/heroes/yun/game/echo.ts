import { game } from "../../../game/state";
import { ECHO } from "../constants/swords";
import { createEchoThrust } from "./effects/echoThrust";
import { hoverPlace } from "./hover";
import { yun } from "./state";
import { sendAway } from "./swords";

/** the heights the swords thrust at, top to bottom, so a fan of four covers a foe from head to feet */
const HEIGHTS = [-27, -19, -23, -14] as const;

/**
 * Sword Echo: every held sword that is not already out thrusts ahead after one of his blows, one after another. A
 * Keen blow's echo reaches further and is a sure critical hit. `power` scales each thrust (a skill's stronger echo).
 */
export function echoBlow(keen: boolean, power = 1): void {
  const reach = ECHO.far * (keen ? ECHO.keenReach : 1);
  let order = 0;
  for (let i = 0; i < yun.swords; i++) {
    if (yun.away[i] > 0) continue;
    const delay = order * ECHO.gap;
    order++;
    game.fx.push(
      createEchoThrust({
        from: hoverPlace(i),
        delay,
        reach,
        height: HEIGHTS[i % HEIGHTS.length],
        power: ECHO.power * power,
        crit: keen,
      }),
    );
    sendAway(i, delay + ECHO.out + ECHO.hold + ECHO.back);
  }
}
