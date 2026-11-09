import { COMBO, MP_PER_HIT } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import { ECHO, type StaffBlowSpec } from "../../../constants/mirel/string";
import { SPARKS } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { SourceId } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import type { StaffBlow } from "../../../types/mirel";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { feat } from "../../feat";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { fieldPace } from "../../timeFields";
import { hitStop, shake } from "../../world";
import { afterStaffHit, blowSkillScale } from "./blowSkills";
import { type StrikePlace, shapeReaches } from "./shape";

/** one blow of her staff, or its echo, struck at a place */
export interface StaffStrike {
  blow: StaffBlow;
  spec: StaffBlowSpec;
  at: StrikePlace;
  /** the echo half a second after the blow, rather than the blow */
  echo: boolean;
  /** pixels the shape grows (Long Echo, Great Toll) */
  grow: number;
  /** a multiple on top of the blow's power: an echo's share, a skill's bonus */
  scale: number;
  /** a sure crit */
  sure?: boolean;
  /** breaks guards (Great Toll) */
  heavy?: boolean;
  /** a skill's own strike (Past Self's ghost) counts for the skill, not her attacks */
  source?: SourceId;
}

/** a foe held in a field or stopped in time: her echoes on it hit at full */
export function isStill(e: Enemy): boolean {
  if (e.stopped > 0) return true;
  const [cx, cy] = enemyCenter(e);
  return fieldPace(cx, cy, e.rank) < 1;
}

/** Still Point: blows on a still foe always crit once it says so */
const stillCrit = (e: Enemy): boolean => !!skillValues("m_stillpoint").crit && isStill(e);

/** an echo's share of the blow's power on this foe: full on a still foe, and with Eternal Noon twice that on a stopped one */
function echoShare(e: Enemy): number {
  if (!isStill(e)) return ECHO.power;
  return e.stopped > 0 && skillValues("m_noon").echoes ? ECHO.still * 2 : ECHO.still;
}

/** a blow's stun: the echo of Toll stuns only with Long Echo */
function stunOf(s: StaffStrike): number | undefined {
  if (!s.echo) return s.spec.stun;
  return s.blow === "toll" ? skillValues("m_echo").stun || undefined : undefined;
}

/** one foe struck by the blow or its echo */
function strikeFoe(e: Enemy, s: StaffStrike): boolean {
  const { spec } = s;
  const dir = Math.sign(e.x - s.at.x) || s.at.face;
  const knock = s.echo ? ECHO.knock : 1;
  const share = s.echo ? echoShare(e) : 1;
  const launchable = ENEMIES[e.type].launchable;
  const power = spec.power * share * s.scale * blowSkillScale(e, s);
  const hpBefore = e.hp;
  const storedBefore = e.stopStore;
  const result = dealDamage(e, progress.stats.ad * power, {
    fromX: s.at.x,
    kx: spec.kx * dir * knock,
    ky: spec.ky * knock,
    launch: spec.lift && launchable ? spec.lift * knock : undefined,
    stun: stunOf(s),
    heavy: s.heavy,
    melee: true,
    source: s.source,
    sureCrit: s.sure || stillCrit(e),
    stagger: spec.stagger ?? COMBO.stagger,
  });
  if (result === "blocked") return false;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx - dir * 3, cy, dir, !s.echo && s.blow === "toll", s.echo ? SPARKS.hour : undefined));
  const own = !s.echo && !s.source;
  if (own) hero.mp = Math.min(progress.stats.mp, hero.mp + MP_PER_HIT);
  if (own) hero.lastHit = e;
  if (s.echo) emitSkillEvent({ type: "echo", foe: e, blow: s.blow });
  afterStaffHit(e, s, Math.max(0, hpBefore - e.hp), e.stopStore - storedBefore);
  return true;
}

/**
 * The blow (or its echo) strikes every foe its shape reaches that `struck` has not marked yet, marking each. Returns the
 * foes it landed on.
 */
export function strikeShape(s: StaffStrike, struck: (e: Enemy) => boolean, mark: (e: Enemy) => void): Enemy[] {
  const landed: Enemy[] = [];
  let blocked = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || struck(e)) continue;
    if (!shapeReaches(s.spec.shape, s.at, enemyBox(e), s.grow)) continue;
    mark(e);
    if (strikeFoe(e, s)) landed.push(e);
    else blocked++;
  }
  const hits = landed.length;
  if (!s.echo) hero.moveHits += hits + blocked;
  if (hits) {
    hitStop(s.echo ? 0.03 : (s.spec.stop ?? 0.05));
    shake(s.echo ? 0.06 : 0.1, s.blow === "toll" && !s.echo ? 2 : 1.2);
    sfx.hit(s.blow === "toll", s.echo ? 1.35 : 1);
    if (!s.echo) feat({ kind: "comboHit", moves: hero.chain });
  } else if (blocked) hitStop(0.04);
  return landed;
}
