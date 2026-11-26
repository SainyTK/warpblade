import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { SKILL } from "../constants/skillIds";
import { ECHO } from "../constants/swords";
import { createEchoThrust } from "./effects/echoThrust";
import { hoverPlace, type SwordPlace } from "./hover";
import { woundFoe } from "./skills/lingeringQi";
import { yun } from "./state";
import { sendAway } from "./swords";

/** the heights the swords thrust at, top to bottom, so a fan of four covers a foe from head to feet */
const HEIGHTS = [-27, -19, -23, -14] as const;

/** where the jian's own echo starts when no sword is out: at his sword hand */
function jianPlace(): SwordPlace {
  return { x: hero.x + hero.face * hero.hand[0], y: hero.y + hero.hand[1], angle: hero.face > 0 ? 0 : Math.PI };
}

/**
 * Sword Echo: every held sword that is not already out thrusts ahead after one of his blows, one after another, as
 * Twin Echo shapes it. A Keen blow's echo reaches further and is a sure critical hit. `times` thrusts per sword (Petal
 * Storm's air echo, Myriad Echo).
 */
export function echoBlow(keen: boolean, times = 1): void {
  const v = skillValues(SKILL.echo);
  const reach = (ECHO.far + withBuild("area", v.reach ?? 0)) * (keen ? ECHO.keenReach : 1);
  const thrusts = times * (skillEvolved(SKILL.echo) ? 2 : 1);
  const shape = {
    reach,
    power: ECHO.power * (v.power ?? 1),
    crit: keen,
    back: v.back ?? 0,
    chill: v.chill ?? 0,
    struck: woundFoe,
  };
  let order = 0;
  const send = (from: SwordPlace, i: number, slot: number | null): void => {
    for (let k = 0; k < thrusts; k++) {
      const delay = order * ECHO.gap;
      order++;
      game.fx.push(createEchoThrust({ ...shape, from, delay, height: HEIGHTS[(i + k) % HEIGHTS.length] }));
      if (slot !== null) sendAway(slot, delay + ECHO.out + ECHO.hold + ECHO.back);
    }
  };
  for (let i = 0; i < yun.swords; i++) if (yun.away[i] <= 0) send(hoverPlace(i), i, i);
  if (!order && v.ghost) send(jianPlace(), 0, null);
}
