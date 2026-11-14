import { FEEL } from "../../../constants/combo";
import { createImpact } from "../../../game/effects/impact";
import type { Blow } from "../../../game/meleeHit";
import { meleeHit } from "../../../game/meleeHit";
import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero, lights } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import { DAWN_RAMP, DAWN_SPARKS } from "../constants/light";
import "../types/events";

/** the reach of a blow of the shield, from the feet facing right */
const SHIELD_BOX = [-2, -36, 25, 0] as const;

/**
 * A blow of the shield straight ahead (a Guard bash, the Stun bash): a fresh swing, sparks off the rim and a flash of
 * light from the crest. Tells his skills which foe it struck. Returns how many foes it struck.
 */
export function shieldBlow(blow: Blow): number {
  newSwing();
  const hits = meleeHit([boxAhead(...SHIELD_BOX)], { feel: FEEL.firm, ...blow });
  const sx = hero.x + hero.face * 13;
  const sy = hero.y - 19;
  game.fx.push(createImpact(sx, sy, hero.face, !!blow.big, DAWN_SPARKS));
  lights.add(sx, sy, 22, DAWN_RAMP[4], 0.45, 0.18);
  if (hits) emitSkillEvent({ type: "bash", foe: hero.lastHit, hits });
  return hits;
}
