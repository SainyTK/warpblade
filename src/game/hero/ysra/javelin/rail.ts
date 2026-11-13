import { GLAIVE_FEEL } from "../../../../constants/ysra/glaive";
import { RAIL } from "../../../../constants/ysra/javelin";
import { meleeHit } from "../../../meleeHit";
import { skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { newSwing } from "../../../world";
import { emitYsra } from "../events";
import { createRailTrail } from "./railTrail";

/** one pass of the rail along the line from x0 to x1, at her middle: its own swing, so it strikes each foe once and
 *  leaves the swing of whatever blow she has moved on to */
function pass(x0: number, x1: number, y: number, power: number): void {
  const keep = hero.swing;
  newSwing();
  const back = x1 < x0 === hero.face > 0;
  const hits = meleeHit([[Math.min(x0, x1), y + RAIL.top, Math.max(x0, x1), y + RAIL.bottom]], {
    power,
    kx: back ? -30 : 30,
    ky: -20,
    feel: GLAIVE_FEEL.lunge,
  });
  hero.swing = keep;
  game.fx.push(createRailTrail(x0, x1, y - 15, true));
  emitYsra("strike", { source: "railLance", hits });
}

/** Ember Javelin: a moment after she arrives, a rail of fire runs back along the line she warped and strikes it again;
 *  Rail Lance runs it out once more */
export function startRail(x0: number, x1: number, y: number): void {
  const v = skillValues("y_javelin");
  if (!v.rail) return;
  game.fx.push(createRailTrail(x0, x1, y - 15));
  const passes = v.back ? 2 : 1;
  let t = 0;
  let done = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      if (t >= RAIL.delay * (1 + done * 2)) {
        const out = done % 2 === 1;
        pass(out ? x0 : x1, out ? x1 : x0, y, v.rail);
        done++;
      }
      return done < passes;
    },
    draw() {},
  });
}
