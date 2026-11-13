import { STOPPED_MOMENT } from "../../../constants/mirel/guard";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { enemyCenter } from "../../enemies/enemy";
import { stopFoe } from "../../enemies/timeStop";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { createClockFace } from "./clockFace";
import { createMomentLook } from "./momentLook";
import { lostLately } from "./rewind";
import { momentLook, rewound } from "./rewound";
import { gainSand } from "./sand";
import { openFreeField } from "./stillfield";

const LONG = "m_longrewind";

/** seconds a foe of this rank stays stopped: Long Rewind lengthens it */
const stopFor = (e: Enemy): number =>
  withCharms("duration", STOPPED_MOMENT.stop[e.rank] * (1 + (skillValues(LONG).stop ?? 0)));

/** a foe stops in time under a clock face, storing what it takes for its restart */
function stopInTime(e: Enemy, returns: number): void {
  stopFoe(e, stopFor(e), returns);
  game.fx.push(createClockFace(e));
}

/** the living foes within `reach` of the attacker, the attacker left out */
function besides(foe: Enemy, reach: number): Enemy[] {
  const [fx, fy] = enemyCenter(foe);
  return game.enemies.filter((e) => {
    if (e === foe || e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return Math.hypot(cx - fx, cy - fy) <= reach;
  });
}

/**
 * Her parry, the Stopped Moment: the attacker stops in time and stores what it takes for its restart, and the HP she
 * lost lately rewinds back. Long Rewind looks further back, gives back more, stops it longer and the foes beside it too,
 * and opens a free Stillfield on it; Patience gives Sand back.
 */
export function stoppedMoment(foe: Enemy | null): void {
  const v = skillValues(LONG);
  const returns = v.returns ?? STOPPED_MOMENT.returns;
  if (foe && foe.hp > 0) {
    stopInTime(foe, returns);
    if (v.ring) for (const e of besides(foe, withCharms("area", v.ring))) stopInTime(e, returns);
    const [cx, cy] = enemyCenter(foe);
    if (v.field) openFreeField(cx, cy, withCharms("duration", v.fieldLife), withCharms("area", v.field));
  }
  gainSand(skillValues("m_patience").parry ?? 0);
  const healed = lostLately(momentLook()) * (v.heal ?? STOPPED_MOMENT.heal);
  game.fx.push(createMomentLook());
  sfx.chime(3);
  const here = { x: hero.x, y: hero.y };
  rewound(Math.min(progress.stats.hp - hero.hp, healed), here, here);
}
