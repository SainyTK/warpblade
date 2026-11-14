import { skillValues } from "../../../game/skills/query";
import type { MoveHit } from "../../../types/move";
import type { AldricMoveId } from "../types/moves";

const GROUND: ReadonlySet<string> = new Set<AldricMoveId>(["oathCut", "shieldBash", "crestBreaker"]);

/**
 * A blow of the string as his skills shape it: Oathblade raises every blow of the ground string and makes Oath cut
 * cut behind him too; Breaking Bash raises the Shield bash, staggers longer and knocks down; Crestfall raises Crest
 * breaker.
 */
export function shapeHit(id: string, hit: MoveHit): MoveHit {
  if (!GROUND.has(id)) return hit;
  const oath = skillValues("al_oath");
  let out: MoveHit = { ...hit, power: hit.power * (oath.power ?? 1) };
  if (id === "oathCut" && oath.behind) out = { ...out, around: true };
  if (id === "shieldBash") {
    const b = skillValues("al_breaker");
    out = {
      ...out,
      power: out.power * (b.power ?? 1),
      stagger: (out.stagger ?? 0) + (b.stagger ?? 0),
      stun: b.stun ?? out.stun,
    };
  }
  if (id === "crestBreaker") out = { ...out, power: out.power * (skillValues("al_crest").crest ?? 1) };
  return out;
}
