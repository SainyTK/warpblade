import { FLARE } from "../../../../constants/ysra/rites";
import { createSlash } from "../../../effects/slash";
import { ignite } from "../../../enemies/burn";
import { skillEvolved, skillValues } from "../../../skills/query";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero, progress } from "../../../state";
import { struckThisSwing, surfaceBelow } from "../../../world";
import { createCrescent } from "./effects/crescent";
import { G_AIR_REAP } from "./slashes";

/** Sunreap's ring of fire on the floor below her reaches this far */
const RING = 36;

/**
 * After an air reap with Sunreap: the cut behind her drawn, struck foes set burning, a ring of fire on the floor below,
 * and Sunscythe's crescent of fire thrown ahead.
 */
export function reaped(hits: number): void {
  const v = skillValues("y_reap");
  if (v.around) game.fx.push(createSlash(hero.x, hero.y, -hero.face, G_AIR_REAP));
  if (v.burn && hits) for (const e of game.enemies) if (e.hp > 0 && struckThisSwing(e)) ignite(e, v.burn);
  const floor = surfaceBelow(hero.x, hero.y);
  if (v.ring && hits) game.fx.push(castFlare(hero.x, floor, { ...FLARE, radius: RING, power: v.ring }, "attacks"));
  if (skillEvolved("y_reap"))
    game.fx.push(createCrescent(hero.x, floor, hero.face, progress.stats.ad * v.crescent, "y_reap"));
}
