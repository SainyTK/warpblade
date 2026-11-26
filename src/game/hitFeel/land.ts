import { HIT_CROWD, HIT_WEIGHTS, STAGE_PULSE } from "../../constants/hitFeel";
import type { Enemy } from "../../types/enemy";
import type { HitLook, HitWeight } from "../../types/hit";
import { WHITE } from "../../utils/color";
import { createHitSpark } from "../effects/hitSpark";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { game, lights } from "../state";
import { hitStop, shake } from "../world";
import { countCrowd } from "./crowd";

export interface LandedHit {
  look?: HitLook;
  crit: boolean;
  heavy: boolean;
  fromX?: number;
}

function ownWeight({ look, crit, heavy }: LandedHit): HitWeight {
  if (crit) return "crit";
  if (heavy || look?.heavy) return "heavy";
  return look?.spell ? "spell" : "light";
}

function crowdWeight(own: HitWeight, prior: number, now: number): HitWeight {
  if (now > HIT_CROWD.fullAtOnce) return "crowd";
  if (prior >= HIT_CROWD.from && (own === "light" || own === "spell")) return "crowd";
  return own;
}

export function landHit(e: Enemy, hit: LandedHit): void {
  const own = ownWeight(hit);
  const { look } = hit;
  if (!look) {
    e.struck = own;
    return;
  }
  const { prior, now } = countCrowd();
  const weight = crowdWeight(own, prior, now);
  const lead = now === 1;
  e.struck = weight;
  const feel = HIT_WEIGHTS[weight];
  const [cx, cy] = enemyCenter(e);
  const dir = Math.sign(cx - (hit.fromX ?? cx)) || 1;
  const x = cx - dir * 3;
  if (now <= HIT_CROWD.sparksAtOnce) game.fx.push(createHitSpark(x, cy, dir, feel.spark, look.sparks));
  if (feel.impact && lead) game.fx.push(createImpact(x, cy, dir, weight !== "light", look.sparks));
  hitStop(feel.stop);
  if (feel.shake) shake(feel.shake[0], feel.shake[1]);
  if (feel.pulse && lead) {
    lights.add(cx, cy, STAGE_PULSE.radius, look.sparks[2], STAGE_PULSE.strength, STAGE_PULSE.life);
    lights.add(cx, cy, STAGE_PULSE.whiteRadius, WHITE, STAGE_PULSE.whiteStrength, STAGE_PULSE.life * 0.5);
  }
}
