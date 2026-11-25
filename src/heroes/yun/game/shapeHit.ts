import { COMBO } from "../../../constants/combat";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import { SKILL } from "../constants/skillIds";
import type { YunMoveId } from "../types/moves";

/** the air string's moves, which Petal Storm shapes; the rest are the ground string, which Crane's Reach shapes */
const AIR: ReadonlySet<YunMoveId> = new Set<YunMoveId>(["driftingCut", "fallingPetal"]);
/** Crane's Reach draws foes in with this knockback toward Yun */
const PULL_KX = -12;

/** Crane's Reach on a ground blow: further, harder, longer stagger, cuts behind and draws foes in */
function crane(id: YunMoveId, hit: MoveHit): MoveHit {
  const v = skillValues(SKILL.crane);
  if (!v.reach) return hit;
  const [x0, y0, x1, y1] = hit.box;
  const finisher = id === "returningTide";
  const around =
    skillEvolved(SKILL.crane) || (id === "craneWheel" && !!v.behind) || (finisher && !!v.tideBehind) || !!hit.around;
  return {
    ...hit,
    box: [x0, y0, x1 + withBuild("area", v.reach), y1],
    power: hit.power * (v.power ?? 1),
    stagger: (hit.stagger ?? COMBO.stagger) * (v.stagger ?? 1),
    kx: v.pull && !finisher ? PULL_KX : hit.kx,
    around,
  };
}

/** Petal Storm on an air cut: harder, and evolved a sure critical hit */
function petal(hit: MoveHit): MoveHit {
  const v = skillValues(SKILL.petal);
  if (!v.power) return hit;
  return { ...hit, power: hit.power * v.power, crit: hit.crit || skillEvolved(SKILL.petal) };
}

/** Flowing Water on a Keen blow: its foe takes the Keen bonus, every other foe the plain blow */
function flow(hit: MoveHit): MoveHit {
  const keen = skillValues(SKILL.flow).keen;
  if (!keen || !hero.keen) return hit;
  return { ...hit, power: hit.power * (1 + keen), plain: hit.power };
}

/** Yun's blows as his skills shape them */
export function shapeHit(id: string, raw: MoveHit): MoveHit {
  const move = id as YunMoveId;
  const shaped = AIR.has(move) ? petal(raw) : crane(move, raw);
  return flow(shaped);
}
