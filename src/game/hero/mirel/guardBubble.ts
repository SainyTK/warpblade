import { TIME_GUARD } from "../../../constants/mirel/guard";
import { DIAL } from "../../../constants/mirel/look";
import { disc, glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Point } from "../../../types/world";
import { TAU } from "../../../utils/math";
import { character, game, hero } from "../../state";
import { lowerField, raiseField, type TimeField } from "../../timeFields";
import { parryOpen } from "../heroGuard";
import { type Dial, dialArc, dialMark } from "./clockArt";
import { mirel } from "./memory";

/** seconds the bubble takes to swell open, and the turn its marks make a second, backwards */
const OPEN = 3 / 30;
const TURN = 0.15;

/** her chest, where the bubble stands */
const chest = (): Point => ({ x: hero.x, y: hero.y - 18 });

/**
 * The time bubble of her guard: a fine ring round her, its twelve marks creeping backwards, where foes and their shots
 * slow as they reach her. It stands while she guards (run with its owner swapped in) and is lit white while a parry would
 * still land.
 */
function createGuardBubble(): Effect {
  let at = chest();
  let t = 0;
  const time: TimeField = { at: () => at, radius: () => TIME_GUARD.radius, pace: TIME_GUARD.pace };
  raiseField(time);
  mirel.bubble = true;
  return {
    update(dt) {
      t += dt;
      const up = character.kit === "mirel" && hero.state === "guard";
      if (up) {
        at = chest();
        return true;
      }
      lowerField(time);
      mirel.bubble = false;
      return false;
    },
    draw() {},
    drawBack() {
      place();
      const r = TIME_GUARD.radius * Math.min(1, t / OPEN);
      const fresh = parryOpen();
      const dial: Dial = { x: at.x, y: at.y, r, a: 1, floor: hero.y + 1 };
      disc(at.x, at.y, r, DIAL.fill, fresh ? 0.2 : 0.1, hero.y + 1);
      dialArc(dial, r, 0, TAU, fresh ? DIAL.flash : DIAL.bezel, fresh ? 0.9 : 0.6);
      const turn = -t * TURN * TAU;
      for (let i = 0; i < 12; i++) dialMark(dial, turn + (i / 12) * TAU, r - 2, r - 0.5, DIAL.hour, 0.7);
      glow(at.x, at.y, r, DIAL.light, fresh ? 0.14 : 0.06);
    },
  };
}

/** she has raised her guard: the bubble swells round her, once */
export function keepGuardBubble(): void {
  if (hero.state === "guard" && !mirel.bubble) game.fx.push(createGuardBubble());
}
