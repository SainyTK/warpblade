import { ENEMIES } from "../../../constants/enemies";
import { SPARKS } from "../../../constants/palette";
import { WICK } from "../../../constants/wenna/wick";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, progress } from "../../state";
import { isQuarry } from "./quarry";
import { byWick } from "./wickKills";

/** the next foe standing just behind a bitten one, for Blue Flame */
function behind(e: Enemy, face: number): Enemy | null {
  const [cx] = enemyCenter(e);
  let best: Enemy | null = null;
  let bestD = 30;
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0) continue;
    const d = (enemyCenter(o)[0] - cx) * face;
    if (d > 0 && d < bestD) {
      best = o;
      bestD = d;
    }
  }
  return best;
}

/** a bite's power as a multiple of ability power: Bright Fangs, Hunting Call on a Quarry, Singe's weakness */
export function bitePower(e: Enemy, scale = 1): number {
  let power = WICK.bitePower * (1 + (skillValues("w_fangs").power ?? 0)) * scale;
  if (isQuarry(e)) power *= 1 + (skillValues("w_quarry").bite ?? 0);
  if (stacksOf(e, "w_singe") > 0) power *= 1 + (skillValues("w_singe").weak ?? 0);
  return power;
}

/** one bite lands on a foe: a hit for her abilities that builds no Flow, a small violet spark. A foe in the air is only
 *  nipped where it hangs, so the Wicks never carry a foe her Flare threw up out of her reach. */
function strike(w: Wick, e: Enemy, scale: number): void {
  const fangs = skillValues("w_fangs");
  const minion = ENEMIES[e.type].rank === "minion";
  const knock = WICK.biteKnock * (fangs.knock && minion ? 3 : 1);
  const before = e.hp;
  byWick(() => {
    dealDamage(e, progress.stats.ap * bitePower(e, scale), {
      fromX: w.x,
      kx: e.air ? 0 : w.face * knock,
      source: "abilities",
      noFlow: true,
    });
  });
  const box = enemyBox(e);
  const hx = w.face > 0 ? box[0] : box[2];
  game.fx.push(createImpact(hx, Math.max(box[1] + 2, w.y - 9), w.face, false, SPARKS.wick));
  emitSkillEvent({ type: "bite", foe: e, wick: w, damage: Math.max(0, before - e.hp) });
}

/** a Great Wick (her Great Wick skill) bites this many times as hard */
const GREAT_BITE = 3;

/** a Wick bites a foe: Bright Fangs bites twice on every third, and Blue Flame strikes the foe behind too */
export function biteFoe(w: Wick, e: Enemy, given = 1): void {
  const fangs = skillValues("w_fangs");
  const scale = w.great > 0 ? given * GREAT_BITE : given;
  w.lunge = WICK.lunge;
  w.bites++;
  strike(w, e, scale);
  if (fangs.twice && w.bites % 3 === 0 && e.hp > 0) strike(w, e, scale);
  if (fangs.blue) {
    const next = behind(e, w.face);
    if (next) strike(w, next, scale);
  }
  sfx.hit(false, 1.6);
}
