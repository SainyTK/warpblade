import { FEEL } from "../../../constants/combo";
import { ENEMIES } from "../../../constants/enemies";
import { GRIT } from "../../../constants/hulda/grit";
import { WARP_GRAB } from "../../../constants/hulda/moveset";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle, WarpTune } from "../../../types/moveset";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { meleeHit } from "../../meleeHit";
import { emitSkillEvent } from "../../skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead, boxBehind, dust, shake } from "../../world";
import { setState } from "../actions";
import { drawThrownGauntlet } from "./effects/thrownGauntlet";
import { thudLight } from "./effects/thud";
import { crushFractures, fracture } from "./fracture";
import { gainGrit } from "./grit";
import { canHold, take } from "./hold";
import { mount, rideable, rideDown } from "./skyfall";

const HAUL = "h_chainHaul";
const SKYFALL = "h_skyfall";

/** Chain Haul's numbers for the shared warp: cost, recharge, charges, the arrival's power and the chain's path */
function tune(): WarpTune {
  if (!skillLevel(HAUL)) return {};
  const v = skillValues(HAUL);
  return { strike: v.strike, path: v.path, charges: v.charges, recharge: v.recharge, cost: v.cost };
}

/**
 * Her arrival blow: both gauntlets slam into the foe, a short shove so a minion stays at her hands. Wrecking Ball
 * (Chain Haul evolved) strikes every foe round her as wide as its ring.
 */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  const [x0, y0, x1, y1] = WARP_GRAB.box;
  const ring = skillValues(HAUL).ring ?? 0;
  const boxes = ring ? [boxAhead(x0, y0, ring, y1), boxBehind(x0, y0, ring, y1)] : [boxAhead(x0, y0, x1, y1)];
  meleeHit(boxes, { power, kx: WARP_GRAB.kx, ky: WARP_GRAB.ky, big: true, sureCrit, feel: FEEL.crush });
  const [x, y] = foe && foe.hp > 0 ? enemyCenter(foe) : [hero.x + hero.face * 12, hero.y - 18];
  game.fx.push(createImpact(x - hero.face * 3, y, hero.face, true));
  thudLight(x, y, ring ? "big" : "mid");
  if (hero.ground) dust(hero.x + hero.face * 6, hero.y, ring ? 10 : 4, hero.face);
  if (ring) shake(0.2, 2.5);
}

/** Chain Haul: foes near the landing reel, and from its sixth level are dragged in toward her */
function reel(caught: Enemy | null): void {
  const v = skillValues(HAUL);
  if (!v.reel) return;
  for (const e of game.enemies) {
    if (e === caught || e.hp <= 0) continue;
    const dx = enemyCenter(e)[0] - hero.x;
    if (Math.abs(dx) > v.reel) continue;
    e.stun = Math.max(e.stun, WARP_GRAB.reelStun);
    if (v.drag) e.x -= Math.sign(dx) * Math.min(Math.abs(dx) - 8, WARP_GRAB.drag);
  }
}

/** the gauntlet clamped on a minion: in her hands on the floor; in the air, or from over it with Comet Grab, ridden down */
function seize(e: Enemy): void {
  gainGrit(GRIT.grab);
  emitSkillEvent({ type: "grab", foe: e });
  sfx.tone(160, 110, 0.08, "square", 0.06);
  if (hero.ground && skillEvolved(SKYFALL) && !kindOf(e.type).flies) {
    hero.y -= WARP_GRAB.comet;
    hero.ground = false;
  }
  if (!hero.ground) return rideDown(e);
  take(e);
  setState("hold");
}

/** a foe too big to hold is crushed in both hands: fractured and worth Grit, or ridden with Skyfall Breaker */
function crush(e: Enemy): void {
  gainGrit(GRIT.grab);
  if (rideable(e)) return mount(e);
  fracture(e, crushFractures());
  sfx.hit(true, 0.6);
}

/** her extra on arrival: the clamped foe is hers, held or ridden down if it is a minion, crushed if it is bigger */
function arrived(foe: Enemy | null): void {
  const e = foe && foe.hp > 0 ? foe : null;
  reel(e);
  if (!e) return;
  if (canHold(e)) return seize(e);
  if (!ENEMIES[e.type].launchable) crush(e);
}

/** Hulda's warp: the chained gauntlet clamps on the foe, she hauls herself in and arrives already holding it */
export const HULDA_WARP: WarpStyle = {
  drawThrown: drawThrownGauntlet,
  strike,
  arrived,
  tune,
};
