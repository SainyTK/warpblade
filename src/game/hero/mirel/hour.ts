import { HOUR } from "../../../constants/mirel/special";
import { PAL } from "../../../constants/palette";
import { ULT_REACH } from "../../../constants/ultimate";
import { sfx } from "../../../services/audio";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights } from "../../state";
import { surfaceBelow } from "../../world";
import { setState } from "../actions";
import { createHourClock, hourSpec } from "./hourClock";
import { mirel } from "./memory";

/** the clock reaches this far at most, so the whole-screen level covers the stage from wherever she stands */
const SCREEN = 400;
/** the cast pose holds this long after the clock opens, then she is free */
const HOLD = 0.25;

/** where the clock opens: on her, at chest height */
const centre = (): { x: number; y: number } => ({ x: hero.x, y: hero.y - 18 });

/** the reach of the level, the whole stage at level 4 */
const reachOf = (level: number): number => Math.min(SCREEN, ULT_REACH[Math.max(0, level - 1)]);

/** Hour of Stillness: she raises the staff, then a clock face opens round her */
export function castHourOfStillness(level: number): void {
  mirel.ultLevel = level;
  mirel.ultAt = centre();
  mirel.ultReach = reachOf(level);
  setState("hour");
}

/** Eternal Noon: every foe on screen stops longer, and the toll returns more of what they took */
export function castEternalNoon(level: number): void {
  mirel.ultLevel = level;
  mirel.ultAt = centre();
  mirel.ultReach = SCREEN;
  setState("noon");
}

/** the clock of the special, or of Eternal Noon at its level */
function openClock(): void {
  const at = mirel.ultAt ?? centre();
  const floor = surfaceBelow(hero.x, hero.y - 1);
  const spec = hourSpec(at.x, at.y, floor, withCharms("area", mirel.ultReach), mirel.ultLevel);
  if (hero.state === "noon") {
    const v = skillValues("m_noon");
    spec.stop = withCharms("duration", v.stop);
    spec.stored = v.returns;
    spec.power = v.power;
    spec.stun = v.stun;
    spec.cap = v.endless ? Number.POSITIVE_INFINITY : spec.cap;
  }
  game.fx.push(createHourClock(spec));
  lights.add(at.x, at.y, 80, PAL.hour[3], 0.55, 0.3);
  sfx.chime(5);
}

/** the anticipation with the staff raised, the clock opening, then she is free while the foes stay stopped */
export function runHour(): void {
  const h = hero;
  h.vx = 0;
  if (!h.hitDone && h.st >= HOUR.windup) {
    h.hitDone = true;
    openClock();
  }
  if (h.st >= HOUR.windup + HOLD) setState(h.ground ? "idle" : "fall");
}
